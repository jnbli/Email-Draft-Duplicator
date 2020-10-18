// Processes user input for number of drafts to duplicate
function handleStartCardForm(e) {
  try {
    if (drafts.length === 0) return goToNoDraftsCard(); 

    const { formInputs } = e;
    const homeCard = HomeCard({ 
      setNumberOfDrafts: formInputs.number_of_drafts, 
      iterationCount: 1, 
      draftIds: getDraftIds() // The getDraftIds function is defined in the Utilities file.
    });

    const navigationToHomeCard = CardService.newNavigation().pushCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

function iterateHomeCard(e) {
  const { cardData } = e.parameters;
  try {
    if (drafts.length === 0) return goToNoDraftsCard();

    const { formInputs } = e;
    const draftId = formInputs.draft_id;
    const numberOfCopies = formInputs.number_of_copies;

    const parsedCardData = JSON.parse(cardData);

    // The updateDraftsData helper function is defined in the Utilities file.
    const iterationCountDelta = updateDraftsData(parsedCardData, draftId, numberOfCopies);
    if (iterationCountDelta !== 0) parsedCardData.iterationCount += iterationCountDelta;

    if (parsedCardData.formInputs) parsedCardData.formInputs = undefined; // So that the inputs reset for the next iteration
    
    const homeCard = HomeCard(parsedCardData);
    const navigationToHomeCard = CardService.newNavigation().updateCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

function resetHomeCard({ parameters } = e) {
  const { setNumberOfDrafts } = parameters;

  // Data for resetting the home card
  const homeCardData = {
    setNumberOfDrafts: Number.parseInt(setNumberOfDrafts), 
    iterationCount: 1, 
    draftIds: getDraftIds()  // The getDraftIds function is defined in the Utilities file.
  };

  try { 
    if (drafts.length === 0) return goToNoDraftsCard();

    const homeCard = HomeCard(homeCardData);
    
    const navigationToHomeCard = CardService.newNavigation().updateCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

// Processes user input for duplicating draft(s) with error checking
function sendHomeCardFormData({ parameters } = e) {
  const { cardData } = parameters;
  try {
    const parsedCardData = JSON.parse(cardData);

    // The function updateDraftDuplicationInfoandCreateCopies is defined in the Utilities file.
    const { numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo } = updateDraftDuplicationInfoAndCreateCopies(parsedCardData);
    const successCard = SuccessCard({ homeCardData: parsedCardData, numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo });
    const navigationToSuccessCard = CardService.newNavigation().pushCard(successCard);

    // The function getNotificationContent is defined in the Utilities file.
    const notification = CardService.newNotification().setText(getNotificationContent(numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft));  
    return generateActionResponse(navigationToSuccessCard, notification); // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

function goBackToStartCard({ parameters } = e) {
  try {
    const startCard = parameters.setNumberOfDrafts ? StartCard({ setNumberOfDrafts: Number.parseInt(parameters.setNumberOfDrafts) }) : StartCard();
    const navigationToStartCard = CardService.newNavigation().popToNamedCard(CardNames.startCardName).updateCard(startCard);
    return generateActionResponse(navigationToStartCard); // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
} 
  
function goBackToHomeCard({ parameters } = e) {
  const { cardData } = parameters;
  try {
    if (drafts.length === 0) return goToNoDraftsCard();

    const parsedCardData = JSON.parse(cardData);
    const iterationCountDelta = updateDraftsData(parsedCardData);
    if (iterationCountDelta !== 0) parsedCardData.iterationCount += iterationCountDelta;

    const homeCard = HomeCard(parsedCardData);
    const navigationToHomeCard = CardService.newNavigation().popToNamedCard(CardNames.homeCardName).updateCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}  
  
function goBackToPreviousCard(e) {
  const navigationToPreviousCard = CardService.newNavigation().popCard();
  return generateActionResponse(navigationToPreviousCard);  // The generateActionResponse function is defined in the Utilities file.
}

// Intended to only be invoked in another ui callback function as a helper function
function goToNoDraftsCard() {
  const noDraftsCard = NoDraftsCard();
  const navigationToNoDraftsCard = CardService.newNavigation().popToRoot().updateCard(noDraftsCard); 
  return generateActionResponse(navigationToNoDraftsCard);  // The generateActionResponse function is defined in the Utilities file.
}

function reloadCard({ parameters, formInputs } = e) {
  const { cardName, cardData } = parameters;
  try {
    let card;

    const parsedCardData = JSON.parse(cardData);
    if (formInputs) parsedCardData.formInputs = formInputs;

    // The CardNames object is defined in the Constants file.
    const { startCardName, homeCardName, successCardName, noDraftsCardName, errorCardName } = CardNames; 
    switch(cardName) {
      case startCardName:
        card = StartCard(parsedCardData);
        break;

      case homeCardName:  // Reloading the home card does not reset it. Resetting occurs in the resetHomeCard callback function.
        const iterationCountDelta = updateDraftsData(parsedCardData);
        if (iterationCountDelta !== 0) parsedCardData.iterationCount += iterationCountDelta;
        card = HomeCard(parsedCardData);
        break;
      
      case successCardName:
        card = SuccessCard(parsedCardData);
        break;

      case noDraftsCardName:
        card = NoDraftsCard();
        break;

      case errorCardName:
        card = ErrorCard(parsedCardData);
        break;

      default:  // If the card name is not valid
        card = ErrorCard({ error: "The Gmail Draft Duplicator cannot reload an unknown card.", prevCardName: startCardName, prevCardData: "{}" }); 
    }
    
    const reloadNavigation = CardService.newNavigation().updateCard(card);
    return generateActionResponse(reloadNavigation);  // The generateActionResponse function is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); } // For all other errors   
}
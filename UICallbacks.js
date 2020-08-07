// Process user input for number of drafts to duplicate
function handleStartCardForm(e) {
  const { cardName, cardData } = e.parameters;
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
  } catch (error) { return ErrorCard({ error, cardName, cardData }); }
}

function iterateHomeCard(e) {
  const { cardName, cardData } = e.parameters;
  try {
    if (drafts.length === 0) return goToNoDraftsCard();

    const { formInputs } = e;
    const draftId = formInputs.draft_id;
    const numberOfCopies = formInputs.number_of_copies;

    const parsedCardData = JSON.parse(cardData);

    // The updateDraftsData helper function is defined in the Utilities file.
    const iterationCountDelta = updateDraftsData(parsedCardData, draftId, numberOfCopies);
    if (iterationCountDelta !== 0) parsedCardData.iterationCount += iterationCountDelta;

    if (parsedCardData.formInputs) parsedCardData.formInputs = undefined; // So that the inputs reset for the next iteration.
    
    const homeCard = HomeCard(parsedCardData);
    const navigationToHomeCard = CardService.newNavigation().updateCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error, cardName, cardData }); }
}

function resetHomeCard({ parameters } = e) {
  const { cardName, setNumberOfDrafts } = parameters;

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
  } catch (error) { return ErrorCard({ error, cardName, cardData: JSON.stringify(homeCardData) }); }
}

// Process user input for duplicating draft(s) with error checking
function sendHomeCardFormData({ parameters } = e) {
  const { cardName, cardData } = parameters;
  try {
    const parsedCardData = JSON.parse(cardData);

    // The function updateDraftDuplicationInfoandCreateCopies is defined in the Utilities file.
    const { numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo } = updateDraftDuplicationInfoAndCreateCopies(parsedCardData);
    const successCard = SuccessCard({ homeCardData: parsedCardData, numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo });
    const navigationToSuccessCard = CardService.newNavigation().pushCard(successCard);

    // The function getNotificationContent is defined in the Utilities file.
    const notification = CardService.newNotification().setText(getNotificationContent(numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft));  
    return generateActionResponse(navigationToSuccessCard, notification); // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error, cardName, cardData }); }
}

function goBackToStartCard({ parameters } = e) {
  const { cardName, cardData } = parameters;
  try {
    const { setNumberOfDrafts } = parameters;
    const startCard = drafts.length > 0 ? StartCard({ setNumberOfDrafts: Number.parseInt(setNumberOfDrafts) }) : StartCard();
    const navigationToStartCard = CardService.newNavigation().popToNamedCard(CardNames.startCardName).updateCard(startCard);
    return generateActionResponse(navigationToStartCard); // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error, cardName, cardData }); }
} 
  
function goBackToHomeCard({ parameters } = e) {
  const { cardName, cardData } = parameters;
  try {
    if (drafts.length === 0) return goToNoDraftsCard();

    const parsedCardData = JSON.parse(cardData);
    const iterationCountDelta = updateDraftsData(parsedCardData);
    if (iterationCountDelta !== 0) parsedCardData.iterationCount += iterationCountDelta;

    const homeCard = HomeCard(parsedCardData);
    const navigationToHomeCard = CardService.newNavigation().popToNamedCard(CardNames.homeCardName).updateCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error, cardName, cardData }); }
}  
  
// Goes back to and reloads the card before the one where an error originated from 
// (either in the card's code or in a callback function invoked by the card)
function goBackToCardBeforeError({ parameters } = e) {
  try {
    return reloadCard({ parameters });
  } catch (error) {
    const { cardName, cardData } = parameters;
    return ErrorCard({ error, cardName, cardData }); 
  }
}

// Intended to only be invoked in another ui callback function as a helper function
function goToNoDraftsCard() {
  try {
    const noDraftsCard = NoDraftsCard();
    const navigateToNoDraftsCard = CardService.newNavigation().popToRoot().updateCard(noDraftsCard); 
    return generateActionResponse(navigateToNoDraftsCard);
  } catch (error) { return ErrorCard({ error, cardName, cardData: JSON.stringify(cardData) }); }
}

function reloadCard({ parameters, formInputs } = e) {
  const { cardName, cardData } = parameters;
  try {
    let cardToReload;

    const parsedCardData = JSON.parse(cardData); 
    if (formInputs) parsedCardData.formInputs = formInputs;

    const { startCardName, homeCardName, successCardName, noDraftsCardName, errorCardName } = CardNames; // The CardNames object is defined in the Constants file.
    switch(cardName) {
      case startCardName:
        cardToReload = StartCard(parsedCardData);

        break;
      case homeCardName:  // Reloading the home card does not reset it. Resetting occurs in the resetHomeCard callback function.
        const iterationCountDelta = updateDraftsData(parsedCardData);
        if (iterationCountDelta !== 0) parsedCardData.iterationCount += iterationCountDelta;
        
        cardToReload = HomeCard(parsedCardData);

        break;
      case successCardName:
        cardToReload = SuccessCard(parsedCardData);
        
        break;
      case noDraftsCardName:
        cardToReload = NoDraftsCard(parsedCardData);
        
        break;
      case errorCardName:
        cardToReload = ErrorCard(parsedCardData); 

        break;
      default:  // If the card name is not valid
        cardToReload = ErrorCard({ error: "Cannot reload unknown card." }); 
    }
    
    const reloadNavigation = CardService.newNavigation().updateCard(cardToReload);
    return generateActionResponse(reloadNavigation);  // The generateActionResponse function is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error, cardName , cardData }); } // For all other errors   
}
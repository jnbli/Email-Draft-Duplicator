// Process user input for number of drafts to duplicate
function handleStartCardForm({ formInputs } = e) { 
  try {
    const homeCard = HomeCard({ 
      setNumberOfDrafts: formInputs.number_of_drafts, 
      iterationCount: 1, 
      draftIds: getDraftIds() // The getDraftIds function is defined in the Utilities file.
    });

    const navigationToHomeCard = CardService.newNavigation().pushCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

// Process user input for duplicating draft(s) with error checking
function sendHomeCardFormData({ parameters } = e) {
  try {
    const cardData = JSON.parse(parameters.cardData); 
    // The function updateDraftDuplicationInfoandCreateCopies is defined in the Utilities file.
    const { numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo } = updateDraftDuplicationInfoAndCreateCopies(cardData);
    const successCard = SuccessCard({ homeCardData: cardData, numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo });
    const navigationToSuccessCard = CardService.newNavigation().pushCard(successCard);

    // The function getNotificationContent is defined in the Utilities file.
    const notification = CardService.newNotification().setText(getNotificationContent(numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft));  
    return generateActionResponse(navigationToSuccessCard, notification); // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

function iterateHomeCard(e) {
  try {
    if (drafts.length === 0) return goBackToStartCard(e);

    const { parameters, formInputs } = e;
    const draftId = formInputs.draft_id;
    const numberOfCopies = formInputs.number_of_copies;

    const cardData = JSON.parse(parameters.cardData);

    // The updateDraftsData helper function is defined in the Utilities file.
    const iterationCountDelta = updateDraftsData(cardData, draftId, numberOfCopies);
    if (iterationCountDelta !== 0) cardData.iterationCount += iterationCountDelta;

    if (cardData.formInputs) cardData.formInputs = undefined; // So that the inputs reset for the next iteration.
    
    const homeCard = HomeCard(cardData);
    const navigationToHomeCard = CardService.newNavigation().updateCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}
  
function goBackToStartCard({ parameters } = e) {
  try {
    const startCard = drafts.length > 0 ? StartCard({ setNumberOfDrafts: JSON.parse(parameters.setNumberOfDrafts) }) : StartCard();
    const navigationToStartCard = CardService.newNavigation().popToRoot().updateCard(startCard);
    return generateActionResponse(navigationToStartCard); // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
} 
  
function goBackToHomeCard(e) {
  try {
    if (drafts.length === 0) return goBackToStartCard(e);

    const { parameters } = e;
    const cardData = JSON.parse(parameters.cardData);

    const iterationCountDelta = updateDraftsData(cardData);
    if (iterationCountDelta !== 0) cardData.iterationCount += iterationCountDelta;

    const homeCard = HomeCard(cardData);
    const navigationToHomeCard = CardService.newNavigation().popToNamedCard(CardNames.homeCardName).updateCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}  

function resetHomeCard({ parameters } = e) {
  try { 
    const homeCard = HomeCard({ 
      setNumberOfDrafts: JSON.parse(parameters.setNumberOfDrafts), 
      iterationCount: 1, 
      draftIds: getDraftIds()  // The getDraftIds function is defined in the Utilities file.
    });
    
    const navigationToHomeCard = CardService.newNavigation().updateCard(homeCard);
    return generateActionResponse(navigationToHomeCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}
  
// Goes back to and reloads the card before the one that used this callback function 
function goBackToPreviousCard(e) {
  try {
    const navigationToPreviousCard = CardService.newNavigation().popCard();
    return generateActionResponse(navigationToPreviousCard);  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

function reloadCard({ parameters, formInputs } = e) {
  try {
    let cardToReload;
    const cardData = JSON.parse(parameters.cardData);
    cardData.formInputs = formInputs;

    const { startCardName, homeCardName, successCardName, errorCardName } = CardNames; // The CardNames object is defined in the Constants file.
    switch(parameters.cardName) {
      case startCardName:
        cardToReload = StartCard(cardData);

        break;
      case homeCardName:  // Reloading the home card does not reset it. Resetting occurs in the resetHomeCard callback function.
        const iterationCountDelta = updateDraftsData(cardData);
        if (iterationCountDelta !== 0) cardData.iterationCount += iterationCountDelta;
        
        cardToReload = HomeCard(cardData);

        break;
      case successCardName:
        cardToReload = SuccessCard(cardData);
        
        break;
      case errorCardName:
        cardToReload = ErrorCard(cardData); 

        break;
      default:  // If the card name is not valid
        cardToReload = ErrorCard({ error: "Cannot reload unknown card." }); 
    }
    
    const navigationToSameCard = CardService.newNavigation().updateCard(cardToReload);
    return generateActionResponse(navigationToSameCard);
  } catch (error) { // For all other errors
    return ErrorCard({ error: error });
  }
}
// Processes user input for number of drafts to duplicate
function handleStartCardForm(e) {
  try {
    if (drafts.length === 0) return goToNoDraftsCard(); 

    const { formInputs } = e;
    return generateActionResponse(CardService.newNavigation().pushCard(HomeCard({ 
      setNumberOfDrafts: formInputs.number_of_drafts, 
      iterationCount: 1, 
      draftIds: getDraftIds() // The getDraftIds function is defined in the Utilities file.
    })));  // The function generateActionResponse is defined in the Utilities file.
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
    
    return generateActionResponse(CardService.newNavigation().updateCard(HomeCard(parsedCardData)));  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

function resetHomeCard({ parameters } = e) {
  try { 
    if (drafts.length === 0) return goToNoDraftsCard();

    const { setNumberOfDrafts } = parameters;
    return generateActionResponse(CardService.newNavigation().updateCard(HomeCard({
      setNumberOfDrafts: Number.parseInt(setNumberOfDrafts), 
      iterationCount: 1, 
      draftIds: getDraftIds()  // The getDraftIds function is defined in the Utilities file.
    })));  // The function generateActionResponse is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); }
}

// Processes user input for duplicating draft(s) with error checking
function sendHomeCardFormData({ parameters } = e) {
  const { cardData } = parameters;
  try {
    const parsedCardData = JSON.parse(cardData);

    // The function updateDraftDuplicationInfoandCreateCopies is defined in the Utilities file.
    const { numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo } = updateDraftDuplicationInfoAndCreateCopies(parsedCardData);

    // The functions generateActionResponse and getNotificationContent are defined in the Utilities file.
    return generateActionResponse(CardService.newNavigation().pushCard(
      SuccessCard({ homeCardData: parsedCardData, numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo })
    ), CardService.newNotification().setText(getNotificationContent(numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft))); 
  } catch (error) { return ErrorCard({ error }); }
}

function goBackToStartCard({ parameters } = e) {
  try {
    // The function generateActionResponse is defined in the Utilities file.
    return generateActionResponse(CardService.newNavigation().popToNamedCard("Start Card").updateCard(
      parameters.setNumberOfDrafts ? StartCard({ setNumberOfDrafts: Number.parseInt(parameters.setNumberOfDrafts) }) : StartCard()
    )); 
  } catch (error) { return ErrorCard({ error }); }
} 
  
function goBackToHomeCard({ parameters } = e) {
  const { cardData } = parameters;
  try {
    if (drafts.length === 0) return goToNoDraftsCard();

    const parsedCardData = JSON.parse(cardData);
    const iterationCountDelta = updateDraftsData(parsedCardData);
    if (iterationCountDelta !== 0) parsedCardData.iterationCount += iterationCountDelta;

    // The function generateActionResponse is defined in the Utilities file.
    return generateActionResponse(CardService.newNavigation().popToNamedCard("Home Card").updateCard(HomeCard(parsedCardData)));  
  } catch (error) { return ErrorCard({ error }); }
}  
  
function goBackToPreviousCard(e) {
  // The generateActionResponse function is defined in the Utilities file.
  return generateActionResponse(CardService.newNavigation().popCard());  
}

// Invoked in other ui callback functions as a helper function
function goToNoDraftsCard() {
  // The generateActionResponse function is defined in the Utilities file.
  return generateActionResponse(CardService.newNavigation().popToRoot().updateCard(NoDraftsCard()));  
}

function reloadCard({ parameters, formInputs } = e) {
  const { cardName, cardData } = parameters;
  try {
    let card;

    const parsedCardData = JSON.parse(cardData);
    if (formInputs) parsedCardData.formInputs = formInputs;

    switch(cardName) {
      case "Start Card":
        card = StartCard(parsedCardData);
        break;

      case "Home Card":  // Reloading the home card does not reset it. Resetting occurs in the resetHomeCard callback function.
        const iterationCountDelta = updateDraftsData(parsedCardData);
        if (iterationCountDelta !== 0) parsedCardData.iterationCount += iterationCountDelta;
        card = HomeCard(parsedCardData);
        break;
      
      case "Success Card":
        card = SuccessCard(parsedCardData);
        break;

      case "No Drafts Card":
        card = NoDraftsCard();
        break;

      case "Error Card":
        card = ErrorCard(parsedCardData);
        break;

      default:  // If the card name is not valid
        card = ErrorCard({ error: "The Email Draft Duplicator cannot reload an unknown card.", prevCardName: "Start Card", prevCardData: "{}" }); 
    }
    
    return generateActionResponse(CardService.newNavigation().updateCard(card));  // The generateActionResponse function is defined in the Utilities file.
  } catch (error) { return ErrorCard({ error }); } // For all other errors   
}
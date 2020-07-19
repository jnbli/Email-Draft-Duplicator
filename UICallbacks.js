// Process user input for number of drafts to duplicate
function handleStartCardForm(e) { 
  try {
    const draftIds = generateDraftIds();
    const homeCard = HomeCard({ 
      setNumberOfDrafts: e.formInputs.number_of_drafts, 
      iterationCount: 1, 
      draftIds: draftIds
    });
    const navigationToHomeCard = CardService.newNavigation().pushCard(homeCard);
    return CardService.newActionResponseBuilder()
      .setNavigation(navigationToHomeCard)
      .build();
  } catch (error) {
    return ErrorCard({ error: error });
  }
}

// Process user input for duplicating draft(s) with error checking
function sendHomeCardFormData(e) {
  try {
    const cardData = JSON.parse(e.parameters.cardData); 
    
    // Get draft ids object since there is a chance the user added, modified, or deleted drafts.
    const draftIds = generateDraftIds();

    let numberOfDraftsDuplicated = 0;
    let userDeletedAtLeastOneSelectedDraft = false;

    let missingDraftInfo = [];

    for (const draftId in cardData.draftsToDuplicate) {
      // The key of draftIds object are the draft ids.
      if (draftIds[draftId]) {  // Selected draft has not been deleted.
        const numberOfCopies = cardData.draftsToDuplicate[draftId];
        const draft = GmailApp.getDraft(draftId);
        createCopies(numberOfCopies, draft); // createCopies function defined in the Utilities file
        numberOfDraftsDuplicated++;

        // Regenerate draft duplication info for the draft just in case the user modified the selected draft.      
        cardData.draftDuplicationInfoObj[draftId] = generateDraftDuplicationInfo(draftId, cardData.draftsToDuplicate);
      } else {  // Selected draft has been deleted.
        if (!userDeletedAtLeastOneSelectedDraft) userDeletedAtLeastOneSelectedDraft = true; 
        missingDraftInfo.push(cardData.draftDuplicationInfoObj[draftId]);
        delete cardData.draftDuplicationInfoObj[draftId];
      }
    }
  
    const successCard = SuccessCard({ 
      draftDuplicationInfoObj: cardData.draftDuplicationInfoObj,
      numberOfDraftsDuplicated: numberOfDraftsDuplicated, 
      userDeletedAtLeastOneSelectedDraft: userDeletedAtLeastOneSelectedDraft, 
      missingDraftInfo: missingDraftInfo
    });

    const navigationToSuccessCard = CardService.newNavigation().pushCard(successCard);

    let notificationContent = "";
    if (numberOfDraftsDuplicated === 0) notificationContent = "Duplication unsuccessful.";
    else if (userDeletedAtLeastOneSelectedDraft) notificationContent = "Duplication partially successful.";
    else { notificationContent = "Duplication successful."; }

    const notification = CardService.newNotification().setText(notificationContent);
    
    return CardService.newActionResponseBuilder()
      .setNavigation(navigationToSuccessCard)
      .setNotification(notification)
      .build();
  } catch (error) {
    return ErrorCard({ error: error });
  }
}

function iterateHomeCard(e) {
  try {
    const draftId = e.formInputs.draft_id;
    const numberOfCopies = e.formInputs.number_of_copies;

    const cardData = JSON.parse(e.parameters.cardData);
    const draftIds = generateDraftIds();

    if (!cardData.draftsToDuplicate) cardData.draftsToDuplicate = {};
    else {  
      for (const chosenDraftId in cardData.draftsToDuplicate) { // Handle user deleting selected draft(s).
        if (!draftIds[chosenDraftId]) { 
          delete cardData.draftsToDuplicate[chosenDraftId];
          cardData.iterationCount--;
        }
      }

      for (const storedDraftId in cardData.draftIds) {  // Handle user deleting unselected draft(s).
        if (!draftIds[storedDraftId]) delete cardData.draftIds[storedDraftId];
      }
    }

    // Handle user deleting currently selected draft.
    if (draftIds[draftId]) {
      cardData.draftsToDuplicate[draftId] = numberOfCopies; 
      cardData.iterationCount++;  
      
      // User cannot select the same draft if duplicating multiple drafts.
      delete cardData.draftIds[draftId];
    } else { delete cardData.draftIds[draftId]; }

    if (cardData.formInputs) cardData.formInputs = undefined; // So that the inputs reset for the next iteration.
    
    const homeCard = HomeCard(cardData);
    const navigationToHomeCard = CardService.newNavigation().updateCard(homeCard);
    return CardService.newActionResponseBuilder()
      .setNavigation(navigationToHomeCard)
      .build();
  } catch (error) {
    return ErrorCard({ error: error });
  }
}
  
function goBackToStartCard(e) {
  try {
    const navigationToStartCard = CardService.newNavigation().popToRoot();
    return CardService.newActionResponseBuilder()
      .setNavigation(navigationToStartCard)
      .build();
  } catch (error) {
    return ErrorCard({ error: error });
  }
} 
  
function goBackToHomeCard(e) {
  try {
    const navigationToHomeCard = CardService.newNavigation().popToNamedCard(CardNames.homeCardName);
    return CardService.newActionResponseBuilder()
      .setNavigation(navigationToHomeCard)
      .build();
  } catch (error) {
    return ErrorCard({ error: error });
  }
}  

function resetHomeCard(e) {
  try {
    // Get draft ids object since there is a chance the user added, modified, or deleted drafts.
    const draftIds = generateDraftIds();
    const homeCard = HomeCard({ 
      setNumberOfDrafts: JSON.parse(e.parameters.setNumberOfDrafts), 
      iterationCount: 1, 
      draftIds: draftIds 
    });
    const navigationToHomeCard = CardService.newNavigation().updateCard(homeCard);
    return CardService.newActionResponseBuilder()
      .setNavigation(navigationToHomeCard)
      .build();
  } catch (error) {
    return ErrorCard({ error: error });
  }
}
  
// Goes back to the card before the one that used this callback function 
function goBackToPreviousCard(e) {
  try {
    const navigationToPreviousCard = CardService.newNavigation().popCard();
    return CardService.newActionResponseBuilder()
      .setNavigation(navigationToPreviousCard)
      .build();
  } catch (error) {
    return ErrorCard({ error: error });
  }
}
  
function reloadCard(e) {
  try {
    let cardToReload;
    const cardData = JSON.parse(e.parameters.cardData);
    cardData.formInputs = e.formInputs;

    switch(e.parameters.cardName) {
      case CardNames.startCardName:
        cardToReload = StartCard(cardData);

        break;
      case CardNames.homeCardName:  // Reloading the home card does not reset it. Resetting occurs in the resetHomeCard callback function.
        // Get draft ids object since there is a chance the user added, modified, or deleted drafts.
        const draftIds = generateDraftIds();

        if (cardData.draftsToDuplicate) { 

          // Remove draft selections that have been deleted and account for valid selections.
          for (const draftId in cardData.draftsToDuplicate) {
            if (!draftIds[draftId]) { 
              delete cardData.draftsToDuplicate[draftId];
              cardData.iterationCount--;
            }
            else { delete draftIds[draftId]; }
          }
        }

        cardData.draftIds = draftIds;
        cardToReload = HomeCard(cardData);

        break;
      case CardNames.successCardName:
        cardToReload = SuccessCard(cardData);
        
        break;
      default:  // If the card name is not valid
        cardToReload = ErrorCard({ error: "Cannot reload unknown card." }); 
    }
    
    const navigationToSameCard = CardService.newNavigation().updateCard(cardToReload);
    return CardService.newActionResponseBuilder()
      .setNavigation(navigationToSameCard)
      .build();
  } catch (error) { // For all other errors
    return ErrorCard({ error: error });
  }
}
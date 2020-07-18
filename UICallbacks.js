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
    
    for (const draftId in cardData.draftsToDuplicate) {
      const numberOfCopies = cardData.draftsToDuplicate[draftId];
      const draft = GmailApp.getDraft(draftId);
      createCopies(numberOfCopies, draft); // createCopies function defined in the Utilities file
    }
  
    const successCard = SuccessCard({ numberOfDrafts: cardData.setNumberOfDrafts, draftDuplicationInfo: e.parameters.draftDuplicationInfo });
    const navigationToSuccessCard = CardService.newNavigation().pushCard(successCard);
    const notification = CardService.newNotification().setText("Duplication successful.")
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
    if (!cardData.draftsToDuplicate) cardData.draftsToDuplicate = {};
    cardData.draftsToDuplicate[draftId] = numberOfCopies; 
    cardData.iterationCount++;

    // User cannot select the same draft if duplicating multiple drafts.
    delete cardData.draftIds[draftId];

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
    // Regenerate the draft ids object since there is a chance the user added, modified, or deleted drafts.
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
        // Regenerate the draft ids object since there is a chance the user added, modified, or deleted drafts.
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
// Process user input for number of drafts to duplicate
function handleStartCardForm(e) { 
  try {
    const homeCard = HomeCard({ numberOfDrafts: e.formInputs.number_of_drafts, iterationCount: 1 });
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
    cardData.draftsToDuplicate.forEach(draftToDuplicate => {
      const draftId = draftToDuplicate.id;
      const numberOfCopies = draftToDuplicate.numberOfCopies;
  
      const draft = GmailApp.getDraft(draftId);
      createCopies(numberOfCopies, draft); // createCopies function defined in Utilities.gs
    });  
  
    const successCard = SuccessCard({ numberOfDrafts: cardData.draftsToDuplicate.length, draftDuplicationInfo: e.parameters.draftDuplicationInfo });
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
    const cardData = JSON.parse(e.parameters.cardData);
    if (!cardData.draftsToDuplicate) cardData.draftsToDuplicate = [];
    cardData.draftsToDuplicate.push({ id: e.formInputs.draft_id, numberOfCopies: e.formInputs.number_of_copies });
    cardData.iterationCount++;
  
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
    const homeCard = HomeCard({ numberOfDrafts: JSON.parse(e.parameters.numberOfDrafts), iterationCount: 1 });
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
    switch(e.parameters.cardName) {
      case CardNames.startCardName:
        cardToReload = StartCard(cardData);
        break;
      case CardNames.homeCardName:
        cardToReload = HomeCard(cardData);
        break;
      case CardNames.successCardName:
        cardToReload = SuccessCard(cardData);
        break;
      default:  // If the card name parameter is not valid
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
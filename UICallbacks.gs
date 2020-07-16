// Process user input for number of drafts to duplicate
function handleStartCardForm(e) { 
  const homeCard = HomeCard({ numberOfDrafts: e.formInputs.number_of_drafts });
  const navigationToHomeCard = CardService.newNavigation().pushCard(homeCard);
  return CardService.newActionResponseBuilder().setNavigation(navigationToHomeCard).build();
}

// Process user input for duplicating draft(s) with error checking
function handleHomeCardForm(e) {
  // numberOfDraftsToDuplicate set in HomeCard.gs
  let copyInfo = [];
  let numberOfDrafts = Number.parseInt(e.parameters.numberOfDrafts);
  for (let i = 0; i < numberOfDrafts; i++) {
    const draftId = e.formInputs[`draft_id${i}`];
    const numberOfCopies = e.formInputs[`number_of_copies${i}`];
    
    const draft = GmailApp.getDraft(draftId);
    const draftInfo = createCopies(numberOfCopies, draft); // createCopies function defined in Utilities.gs
    
    copyInfo.push({ draftInfo, numberOfCopies });
  }
  
  const successCard = SuccessCard({ copyInfo: copyInfo });
  const navigationToSuccessCard = CardService.newNavigation().pushCard(successCard);
  return CardService.newActionResponseBuilder().setNavigation(navigationToSuccessCard).build();
}
  
function goBackToStartCard(e) {
  const navigationToStartCard = CardService.newNavigation().popToRoot();
  return CardService.newActionResponseBuilder().setNavigation(navigationToStartCard).build();
}
  
function reloadCard(e) {
  let cardToReload;
  const cardData = JSON.parse(e.parameters.cardData);
  switch(e.parameters.cardName) {
    case "Start Card":
      cardToReload = StartCard(cardData);
      break;
    case "Home Card":
      cardToReload = HomeCard(cardData);
      break;
    case "Success Card":
      cardToReload = SuccessCard(cardData);
      break;
    default:
      return null; // eventually, this will return an error card
  }
  
  const navigationToSameCard = CardService.newNavigation().popCard().pushCard(cardToReload);
  return CardService.newActionResponseBuilder().setNavigation(navigationToSameCard).build();
}
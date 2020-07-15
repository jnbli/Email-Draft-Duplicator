// Contains helper functions not specific to any card

function reloadCard(e) {
  let cardToReload;
  const cardData = JSON.parse(e.parameters["cardData"]);
  switch(e.parameters["cardName"]) {
    case "startCard":
      cardToReload = StartCard;
      break;
    case "homeCard":
      cardToReload = HomeCard;
      break;
    case "successCard":
      cardToReload = SuccessCard;
      break;
    default:
      return null; // eventually, this will return an error card
  }
  
  return cardToReload(cardData);
}

//function addInputCardData(cardData) {
//  cardData.formInputs = e.formInputs;
//  return cardData;
//}
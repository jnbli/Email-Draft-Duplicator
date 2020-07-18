// Generates a footer section to be used in card(s)
function FooterSection(cardName, cardData) {  
  const refreshButton = CardService.newTextButton()
    .setText("Refresh")
    .setOnClickAction(CardService.newAction()
                       .setFunctionName("reloadCard")
                       // JSON.stringify() is used since setParameters() only takes string keys and values.
                       .setParameters({ "cardName": cardName, "cardData": JSON.stringify(cardData) })); 

  const buttonSet = CardService.newButtonSet()
    .addButton(refreshButton);
  
  // Card service's fixed footer causes display glitch with selection input, so the footer is created as a section instead.
  return CardService.newCardSection().addWidget(buttonSet);
}
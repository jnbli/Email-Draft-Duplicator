// Generates a footer section to be used in card(s)
function FooterSection(cardName, cardData) {  
  const refreshButton = CardService.newTextButton()
    .setText("Refresh")
  
    // JSON.stringify() is used since setParameters() only takes string keys and values.
    .setOnClickAction(CardService.newAction()
                       .setFunctionName("reloadCard")
                       .setParameters({ "cardName": cardName, "cardData": JSON.stringify(cardData) })); 

  const footerButtonSet = CardService.newButtonSet()
    .addButton(refreshButton);
  
  // Card service's fixed footer causes display glitch with selection input, so the footer is created as a section instead.
  return CardService.newCardSection().addWidget(footerButtonSet);
}
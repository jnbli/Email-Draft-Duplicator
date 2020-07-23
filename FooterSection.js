// Generates a footer section to be used in card(s)
function FooterSection(cardName, cardData) {  
  const buttonSet = CardService.newButtonSet();
  let refreshButton = null, backButton = null;
  switch (cardName) {
    case CardNames.startCardName:
      refreshButton = CardService.newTextButton()
        .setText("Refresh")
        .setOnClickAction(CardService.newAction()
                          .setFunctionName("reloadCard")
                          // JSON.stringify() is used since setParameters() only takes string keys and values.
                          .setParameters({ "cardName": cardName, "cardData": JSON.stringify(cardData) })); 
      buttonSet.addButton(refreshButton);

      break;
    case CardNames.homeCardName:
      backButton = CardService.newTextButton()
      .setText("Go Back")
      .setOnClickAction(CardService.newAction()
                          .setFunctionName("goBackToStartCard")); 

      refreshButton = CardService.newTextButton()
        .setText("Refresh")
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(CardService.newAction()
                          .setFunctionName("reloadCard")
                          // JSON.stringify() is used since setParameters() only takes string keys and values.
                          .setParameters({ "cardName": cardName, "cardData": JSON.stringify(cardData) })); 
      buttonSet
        .addButton(backButton)
        .addButton(refreshButton);

      break;
    case CardNames.successCardName:
      const runAgainButton = CardService.newTextButton()
        .setText("Start Over")
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(CardService.newAction()
                            .setFunctionName("goBackToStartCard"));
    
      backButton = CardService.newTextButton()
        .setText("Go Back")
        .setOnClickAction(CardService.newAction()
                            .setFunctionName("goBackToHomeCard")
                            // JSON.stringify() is used since setParameters() only takes string keys and values.
                            .setParameters({ "cardData": JSON.stringify(cardData) })); 

      buttonSet
        .addButton(runAgainButton)
        .addButton(backButton);

      break;
    case CardNames.errorCardName: 
      backButton = CardService.newTextButton()
        .setText("Go Back")
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(CardService.newAction()
                            .setFunctionName("goBackToPreviousCard"));
      
      buttonSet.addButton(backButton);

      break;
    default: // If the card name is not valid
      return CardService.newCardSection().addWidget(CardService.newTextParagraph()
                                                    .setText("Invalid card name for determining the card's footer."));
  }
  
  // Card service's fixed footer causes display glitch with selection input,
  // so the footer is created as a section instead.
  return CardService.newCardSection().addWidget(buttonSet);
}
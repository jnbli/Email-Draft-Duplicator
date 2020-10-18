// Card that displays an error that was caught
function ErrorCard(data = {}) {
  try { return generateErrorCard(data); } 
  catch (error) { Logger.log(error); }
}

function generateErrorCard(data) {
  return CardService.newCardBuilder()
    .setName(errorCard.name)
    .setHeader(errorCard.generateHeader())
    .addSection(errorCard.generateMainSection(data))
    .addSection(errorCard.generateFooterSection(data))
    .build();
}

const errorCard = {
  name: CardNames.errorCardName,  // The CardNames object is located in the Constants file.
  
  generateHeader: function() { return CardService.newCardHeader().setTitle("An error occurred."); },
  
  generateMainSection: function({ error } = {}) {
    const errorInfo = CardService.newTextParagraph().setText(error);
    return CardService.newCardSection()
      .addWidget(errorInfo);
  },

  generateFooterSection: function() {
    // The function generateTextButton is defined in the Utilities file.
    const backButton = generateTextButton("Go Back", CardService.TextButtonStyle.FILLED, "goBackToPreviousCard");  
    return CardService.newCardSection()
      .addWidget(backButton);
  }
}
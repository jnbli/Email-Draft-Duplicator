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
    .addSection(errorCard.generateFooterSection())
    .build();
}

const errorCard = {
  name: "Error Card",
  
  generateHeader: function() { return CardService.newCardHeader().setTitle("An error occurred."); },
  
  generateMainSection: function({ error } = {}) {
    return CardService.newCardSection().addWidget(CardService.newTextParagraph().setText(error));
  },

  generateFooterSection: function() {
    // The function generateTextButton is defined in the Utilities file.
    return CardService.newCardSection().addWidget(generateTextButton("Go Back", CardService.TextButtonStyle.FILLED, "goBackToPreviousCard"));
  }
}
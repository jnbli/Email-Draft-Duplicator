// Card that displays an error that was caught
function ErrorCard(data = {}) {
  const header = CardService.newCardHeader().setTitle("An error occurred.");
  const errorInfo = CardService.newTextParagraph().setText(data.error);
  
  const backButton = CardService.newTextButton()
    .setText("Go Back")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("goBackToPreviousCard"));
  
  const mainSection = CardService.newCardSection()
    .addWidget(errorInfo)
    .addWidget(backButton);
  
  const errorCard = CardService.newCardBuilder()
    .setName(CardNames.errorCardName)
    .setHeader(header)
    .addSection(mainSection)
    .build();
  
  return errorCard;
}
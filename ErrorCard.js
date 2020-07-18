// Card that displays an error that was caught
function ErrorCard(data = {}) {
  try {
    const header = CardService.newCardHeader().setTitle("An error occurred.");
    const errorInfo = CardService.newTextParagraph().setText(data.error);
    
    const mainSection = CardService.newCardSection()
      .addWidget(errorInfo);
    
    const errorCard = CardService.newCardBuilder()
      .setName(CardNames.errorCardName)
      .setHeader(header)
      .addSection(mainSection)
      .addSection(FooterSection(CardNames.errorCardName))
      .build();
    
    return errorCard;
  } catch (error) { Logger.log(error); }
}
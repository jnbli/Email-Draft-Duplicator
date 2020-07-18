// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(data = {}) {  
  try {
    const headerTitle = data.numberOfDrafts === 1 ? "The Gmail draft has been duplicated." : "The Gmail drafts have been duplicated."; 
    const header = CardService.newCardHeader().setTitle(headerTitle);
  
    const concludingSentence = data.numberOfDrafts === 1 ? "Refresh the drafts panel to see your duplicated draft." : "Refresh the drafts panel to see your duplicated drafts.";
    const successParagraph = CardService.newTextParagraph().setText(`Success! You have made:\n${data.draftDuplicationInfo}\n${concludingSentence}`);
    
    const congratsSection = CardService.newCardSection().addWidget(successParagraph);
    
    const successCard = CardService.newCardBuilder()
      .setName(CardNames.successCardName)
      .setHeader(header)
      .addSection(congratsSection)
      .addSection(FooterSection(CardNames.successCardName))
      .build();
    
    return successCard;
  } catch (error) {
    return ErrorCard({ error: error });
  }
}
// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(data = {}) {  
  try {
    const headerTitle = data.copyInfo.length === 1 ? "The Gmail draft has been duplicated." : "The Gmail drafts have been duplicated."; 
    const header = CardService.newCardHeader().setTitle(headerTitle);
    
    let successParagraph = CardService.newTextParagraph();
    let successParagraphText = "Success! You have made: \n";
    
    //  let successParagraphs = [];
    for (let i = 0; i < data.copyInfo.length; i++) {
      const draftInfo = data.copyInfo[i].draftInfo.starred ? "starred draft" : "draft";  // Reflect starred draft.
      //    let successParagraph = CardService.newTextParagraph(); 
      const draftSubjectPortion = data.copyInfo[i].draftInfo.subject.length === 0 ? "\"(no subject)\"" : `"${data.copyInfo[i].draftInfo.subject}"`; // Handle duplicated draft(s) with no subject.
      if (data.copyInfo[i].numberOfCopies == 1) successParagraphText += `  - ${data.copyInfo[i].numberOfCopies} copy of the ${draftInfo} ${draftSubjectPortion}\n`;
      else { successParagraphText += `  - ${data.copyInfo[i].numberOfCopies} copies of the ${draftInfo} ${draftSubjectPortion}\n`; } 
      
      //    successParagraphs.push(successParagraph);
    }
    
    successParagraph.setText(successParagraphText);
    
    const runAgainButton = CardService.newTextButton()
    .setText("Start Over")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("goBackToStartCard"));
    
    const backButton = CardService.newTextButton()
    .setText("Go Back")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("goBackToHomeCard"));
    
    const buttons = CardService.newButtonSet()
    .addButton(runAgainButton)
    .addButton(backButton);
    
    let congratsSection = CardService.newCardSection()
    .addWidget(successParagraph)
    .addWidget(buttons);
    
    const successCard = CardService.newCardBuilder()
    .setName(CardNames.successCardName)
    .setHeader(header)
    .addSection(congratsSection)
    .build();
    
    return successCard;
  } catch (error) {
    return ErrorCard({ error: error });
  }
}
// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(data = {}) {  
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
      
  const backButton = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("StartCard"));
  
  let congratsSection = CardService.newCardSection()
    .addWidget(successParagraph)
    .addWidget(backButton);
  
  const successCard = CardService.newCardBuilder()
    .setName("Success Card")
    .setHeader(header)
    .addSection(congratsSection)
    .addSection(FooterSection())
    .build();
  
  return successCard;
}
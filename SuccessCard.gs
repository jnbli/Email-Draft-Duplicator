// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(n, draftSubject) {
  const header = CardService.newCardHeader().setTitle("The Gmail draft has been duplicated.");
  
  let successParagraph = CardService.newTextParagraph(); 
  if (n == 1) successParagraph.setText(`Success! ${n} copy of the draft "${draftSubject}" was made for you.`);
  else {
    successParagraph.setText(`Success! ${n} copies of the draft "${draftSubject}" were made for you.`);
  }
      
  const backButton = CardService.newTextButton()
    .setText("Go back")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("HomeCard")
                      .setParameters({ err: "" }));
  
  const congratsSection = CardService.newCardSection()
    .addWidget(successParagraph)
    .addWidget(backButton);
  
  const successCard = CardService.newCardBuilder()
    .setName("Success Card")
    .setHeader(header)
    .addSection(congratsSection)
    .build();
  
  return successCard;
}
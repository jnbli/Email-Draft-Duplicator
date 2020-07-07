// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(n, draftInfo) {
  const headerTitle = draftInfo.starred ? "The starred draft has been duplicated." : "The draft has been duplicated."; // Reflect starred draft.
  const header = CardService.newCardHeader().setTitle(headerTitle);
  
  const draftType = draftInfo.starred ? "starred draft" : "draft";  // Reflect starred draft.
  let successParagraph = CardService.newTextParagraph(); 
  if (n == 1) successParagraph.setText(`Success! ${n} copy of the ${draftType} "${draftInfo.subject}" was made for you.`);
  else { successParagraph.setText(`Success! ${n} copies of the ${draftType} "${draftInfo.subject}" were made for you.`); }
      
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
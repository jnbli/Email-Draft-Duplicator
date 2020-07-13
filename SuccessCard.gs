// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(data = {}) {
  const headerTitle = data.draftInfo.starred ? "The starred Gmail draft has been duplicated." : "The Gmail draft has been duplicated."; // Reflect starred draft.
  const header = CardService.newCardHeader().setTitle(headerTitle);
  
  const draftType = data.draftInfo.starred ? "starred Gmail draft" : "Gmail draft";  // Reflect starred draft.
  let successParagraph = CardService.newTextParagraph(); 
  const draftSubjectPortion = data.draftInfo.subject.length === 0 ? "" : ` "${data.draftInfo.subject}"`; // Handle duplicated draft with no subject.
  if (data.numberOfCopies == 1) successParagraph.setText(`Success! ${data.numberOfCopies} copy of the ${draftType}${draftSubjectPortion} was made for you.`);
  else { successParagraph.setText(`Success! ${data.numberOfCopies} copies of the ${draftType}${draftSubjectPortion} were made for you.`); }
      
  const backButton = CardService.newTextButton()
    .setText("Back")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("StartCard"));
  
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
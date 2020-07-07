// Card that prompts the user to duplicate draft(s)
// The additional error parameter is used by the number text input to show an error message if necessary.
function HomeCard(err) {
  let drafts = GmailApp.getDrafts();  
  
  // If the user currently has no Gmail drafts
  if (drafts.length == 0) {
    const header = CardService.newCardHeader().setTitle("You have no Gmail drafts.");
    
    const message = CardService.newTextParagraph().setText("You must have at least one Gmail draft to duplicate draft(s).");
    const mainSection = CardService.newCardSection().addWidget(message);
    
    const homeCard = CardService.newCardBuilder()
      .setName("Home Card")
      .setHeader(header)
      .addSection(mainSection)
      .build();
    
    return homeCard;
  }  
  
  // If the user currently has at least 1 Gmail draft(s)
  const header = CardService.newCardHeader().setTitle("Duplicate your Gmail draft(s).");
  
  let gmailDraftDropDown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Select Gmail Draft")
    .setFieldName("draft_id");  // Used by handleForm.gs to find the draft to duplicate
  
  drafts.forEach(draft => { 
    const draftMessage = draft.getMessage();
    let draftSubject = draftMessage.getSubject();
    
    // Reflect starred drafts.
    if (draftMessage.isStarred()) draftSubject = `(starred) ${draftSubject}`;
    gmailDraftDropDown.addItem(draftSubject, draft.getId(), false);
  });
    
  let numberInput = CardService.newTextInput()
    .setFieldName("number_of_copies")  // Used by handleForm.gs for the number of times to duplicate the draft
    .setTitle("Enter number of copies.");
  
  // Suggestions to help the user enter in valid input
  const numNumbers = 5;
  let suggestions = CardService.newSuggestions();
  for (let num = 1; num <= numNumbers; num++) suggestions.addSuggestion(num.toString());
  numberInput.setSuggestions(suggestions);
  
  if (err.length > 0) numberInput.setHint(err);  // Show error message if necessary.
  
  const submitButton = CardService.newTextButton()
    .setText("Duplicate")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("handleForm"));
  
  const formSection = CardService.newCardSection()
    .addWidget(gmailDraftDropDown)
    .addWidget(numberInput)
    .addWidget(submitButton);
  
  const homeCard = CardService.newCardBuilder()
    .setName("Home Card")
    .setHeader(header)
    .addSection(formSection)
    .build();
  
  return homeCard;
}
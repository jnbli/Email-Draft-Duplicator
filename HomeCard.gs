// Card that prompts the user to duplicate draft(s)
// The additional error parameter is used by the number text input to show an error message if necessary.
function HomeCard(data = {}) {
  // numberOfDraftsToDuplicate gets reset to its default when the add-on reloads.
  const headerMessage = data.numberOfDrafts === 1 ? "You would like to duplicate 1 Gmail draft." : `You would like to duplicate ${data.numberOfDrafts} Gmail drafts.`;
  const header = CardService.newCardHeader().setTitle(headerMessage);
  
  let gmailDraftDropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Select Gmail Draft")
    .setFieldName("draft_id");
  
  // Fill in gmail draft dropdown
  drafts.forEach(draft => { 
    const draftMessage = draft.getMessage();
    let draftSubject = draftMessage.getSubject();
    
    // Handle drafts with empty subject.
    if (draftSubject.length === 0) draftSubject = `(no subject) ${draftSubject}`;
  
    // Reflect starred drafts.
    if (draftMessage.isStarred()) draftSubject = `(starred) ${draftSubject}`;
    gmailDraftDropdown.addItem(draftSubject, draft.getId(), false);
  });
    
  let numberOfCopiesDropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Select Number of Copies")
    .setFieldName("number_of_copies");

  // Fill in number of copies dropdown
  for (let num = 1; num <= maxDuplicatesPerDraft; num++) numberOfCopiesDropdown.addItem(num.toString(), num.toString(), false);
  
  const submitButton = CardService.newTextButton()
    .setText("Duplicate")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("handleHomeCardForm"));
  
  const formSection = CardService.newCardSection()
    .addWidget(gmailDraftDropdown)
    .addWidget(numberOfCopiesDropdown)
    .addWidget(submitButton);
  
  const homeCard = CardService.newCardBuilder()
    .setName("Home Card")
    .setHeader(header)
    .addSection(formSection)
    .build();
  
  return homeCard;
}
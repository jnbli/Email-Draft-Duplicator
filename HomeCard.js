// Card that prompts the user to duplicate draft(s)
// The additional error parameter is used by the number text input to show an error message if necessary.
function HomeCard(data = {}) {    
  try {
    const headerMessage = data.numberOfDrafts == 1 ? "You would like to duplicate 1 Gmail draft." : `You would like to duplicate ${data.numberOfDrafts} Gmail drafts.`;
    const header = CardService.newCardHeader().setTitle(headerMessage);
    
    let gmailDraftDropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Select a Gmail Draft");
    
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
    .setTitle("Select Number of Copies");
  
    // Fill in number of copies dropdown
    for (let num = 1; num <= maxDuplicatesPerDraft; num++) numberOfCopiesDropdown.addItem(num.toString(), num.toString(), false);
  
    const submitButton = CardService.newTextButton()
    .setText("Duplicate")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("handleHomeCardForm")
                      .setParameters({ "numberOfDrafts" : data.numberOfDrafts.toString() }));
  
    const backButton = CardService.newTextButton()
    .setText("Go Back")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("goBackToPreviousCard"))
  
    const buttons = CardService.newButtonSet()
      .addButton(submitButton)
      .addButton(backButton); 
  
    let formSection = CardService.newCardSection();
    for (let i = 0; i < data.numberOfDrafts; i++) { 
      formSection
        .addWidget(CardService.newTextParagraph().setText(`Gmail Draft #${i+1}`))
        .addWidget(gmailDraftDropdown.setFieldName(`draft_id${i}`))
        .addWidget(numberOfCopiesDropdown.setFieldName(`number_of_copies${i}`));
//    if (i < data.numberOfDrafts - 1) formSection.addWidget(CardService.newTextParagraph().setText("\n")); 
    }                                                                                                                            
    formSection.addWidget(buttons);
  
    const homeCard = CardService.newCardBuilder()
    .setName(CardNames.homeCardName)
    .setHeader(header)
    .addSection(formSection)
    .addSection(FooterSection(CardNames.homeCardName, data))
    .build();
  
    return homeCard;  
  } catch(error) {
    return ErrorCard({ error: error });
  }
}
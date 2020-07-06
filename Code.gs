function buildAddOn() {
  return HomeCard("");
}

function SuccessCard(n, draftSubject) {
  const header = CardService.newCardHeader().setTitle("The Gmail draft has been duplicated.");
  
  let successParagraph = CardService.newTextParagraph(); 
  if (n == 1) {
    successParagraph.setText(`Success! ${n} copy of the draft "${draftSubject}" was made for you.`);
  }
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

function HomeCard(err) {
  let drafts = GmailApp.getDrafts();  
  
  // If the user currently has no Gmail drafts.
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
  
  // If the user currently has at least 1 Gmail draft(s).  
  const header = CardService.newCardHeader().setTitle("Duplicate your Gmail draft(s).");
  
  let gmailDraftDropDown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Select Gmail Draft")
    .setFieldName("draft_id");
  
  drafts.forEach(draft => gmailDraftDropDown.addItem(draft.getMessage().getSubject(), draft.getId(), false));
    
  let numberInput = CardService.newTextInput()
    .setFieldName("number_of_copies")
    .setTitle("Enter number of copies.");
  
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

function handleForm(e) {
  const n = e.formInputs.number_of_copies;
  const draftId = e.formInputs.draft_id;
  
  const hasDecimal = (n - Math.floor(n)) !== 0;  // Implicitly checks that the input is a number
  const gtZero = (n > 0);
  
  let error = "";  // Stays this way if there was no error with the input
  
  if (hasDecimal) error = "Number of copies must be an integer.";
  else if (!gtZero) error = "Number of copies must be at least 1.";
  else if (!draftId) error = "There was an error with finding the id of the draft you would like to duplicate.";
  
  if (error == "") {  // No error with the input    
    const draft = GmailApp.getDraft(draftId);
    
    createCopies(n, draft);
    const draftSubject = draft.getMessage().getSubject();
    return SuccessCard(n, draftSubject);
  }
  else { // Display error message
    return HomeCard(error);
  }
}

function createCopies(n, draft) {  
  let template = draft.getMessage();
  
  const recipient = template.getTo();
  const subject = template.getSubject();
  const body = template.getBody();
  const attachments = template.getAttachments();
  const bcc = template.getBcc();
  const cc = template.getCc();
  const from = template.getFrom();
  const replyTo = template.getReplyTo();
  
  for (let i = 0; i < n; i++) {
    GmailApp.createDraft(recipient, subject, body, {
      attachments: attachments,
      bcc: bcc,
      cc: cc,
      from: from,
      htmlBody: body,
      replyTo: replyTo
    });
  }
}
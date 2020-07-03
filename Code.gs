function buildAddOn(e) {
  return HomeCard("");
}

function SuccessCard(n, draftSubject) {
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
    .addSection(congratsSection)
    .build();
  
  return successCard;
}

function HomeCard(err) {
  let gmailDraftDropDown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Select Gmail Draft")
    .setFieldName("draft_id");
  
  let drafts = GmailApp.getDrafts();
  if (drafts.length == 0) {
    gmailDraftDropDown.addItem("", "", false);
  }
  else {
    for (let i = 0; i < drafts.length; i++) {
      gmailDraftDropDown.addItem(drafts[i].getMessage().getSubject(), drafts[i].getId(), false);
    }
  }
      
  let numberInput = CardService.newTextInput()
    .setFieldName("number_of_copies")
    .setTitle("Enter number of copies");
  
  const numNumbers = 5;
  let suggestions = CardService.newSuggestions();
  for (let num = 1; num <= numNumbers; num++) suggestions.addSuggestion(num.toString());
  numberInput.setSuggestions(suggestions);
  
  if (err.length > 0) numberInput.setHint(err);
  
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
  
  if (hasDecimal) error = "Number of copies must be an integer";
  else if (!gtZero) error = "Number of copies must be at least 1";
  else if (!draftId) error = "No drafts available for duplicating";
  
  if (error == "") {  // No error with the input
    createCopies(n, draftId);
    const draftSubject = GmailApp.getDraft(draftId).getMessage().getSubject();
    return SuccessCard(n, draftSubject);
  }
  else { // Display useful error message
    return HomeCard(error);
  }
}

function createCopies(n, draftId) {
  let template = GmailApp.getDraft(draftId).getMessage();
  
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
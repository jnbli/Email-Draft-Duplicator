// Process user input for duplicating draft(s) with error checking
function handleForm(e) {
  const n = e.formInputs.number_of_copies;
  const draftId = e.formInputs.draft_id;
  
  const hasDecimal = (n - Math.floor(n)) !== 0;  // Implicitly checks that the input is a number.
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
  else { // Display error message.
    return HomeCard(error);
  }
}

// Helper function that creates the duplicates
function createCopies(n, draft) {  
  const template = draft.getMessage();
  
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
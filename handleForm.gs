// Process user input for duplicating draft(s) with error checking
function handleForm(e) {
  const n = e.formInputs.number_of_copies;
  const draftId = e.formInputs.draft_id;
  
  const hasDecimal = (n - Math.floor(n)) !== 0;  // Implicitly checks that the input is a number.
  const gtZero = (n > 0);
  
  let error = "";  // Stays this way if there was no error with the input
  
  if (hasDecimal) error = "Number of copies must be an integer.";
  else if (!gtZero || n > maxDuplicatesPerDraft) error = `Number of copies must be from 1-${maxDuplicatesPerDraft}.`;
  else if (!draftId) error = "There was an error with finding the id of the draft you would like to duplicate.";
  
  if (error == "") {  // No error with the input    
    const draft = GmailApp.getDraft(draftId);
    
    const draftInfo = createCopies(n, draft);
    return SuccessCard(n, draftInfo);
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
  const starred = template.isStarred();
  
  for (let i = 0; i < n; i++) {
    let draft = GmailApp.createDraft(recipient, subject, body, {
      attachments: attachments,
      bcc: bcc,
      cc: cc,
      from: from,
      htmlBody: body,
      replyTo: replyTo
    });
    
    if (starred) GmailApp.starMessage(draft.getMessage());  // Duplicating starred drafts duplicates the starred status.
  }
  
  // Draft info used in SuccessCard.gs
  return { 
    subject: subject, 
    starred: starred
  };
}
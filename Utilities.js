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
  return { subject: subject, starred: starred };
}

// Helper function that appends input data to the card's data
//function addInputCardData(cardData) {
//  cardData.formInputs = e.formInputs;
//  return cardData;
//}

// Helper function that does error checking for all start card input
//function checkStartCardInput(numberOfDrafts) {
//  let error = "";  // Stays this way if there was no error with the input
//  
//  let numberOfDraftsInputInfo = checkIntegerInput(numberOfDrafts, 1, drafts.length, "number of drafts");
//  if (!numberOfDraftsInputInfo.valid) error = numberOfDraftsInputInfo.error;
//  
//  return { allValid: error === "", error: error }
//}

// Helper function that does error checking for all home card input
//function checkHomeCardInput(numberOfCopies, draftId) {
//  let error = "";  // Stays this way if there was no error with the input
//  
//  let numberOfCopiesInputInfo = checkIntegerInput(numberOfCopies, 1, maxDuplicatesPerDraft, "number of copies");
//  if (numberOfCopiesInputInfo.valid) { 
//    if (!draftId) error = "There was an error with finding the id of the draft you would like to duplicate.";
//  } else { error = numberOfCopiesInputInfo.error; }
//  
//  return { allValid: error === "", error: error }
//}

// Helper function that does error checking for integer input
// Checks that the input is a valid integer that is in between 1 and max
//function checkIntegerInput(val, min, max, valueName) {
//  const isInteger = (val - Math.floor(val)) === 0;  
//  let error = "";  // Stays this way if there was no error with the input
//  
//  if (!isInteger) error = `The ${valueName} must be an integer.`;
//  else if (val < min || val > max) error = `The ${valueName} must be from 1-${maxDuplicatesPerDraft}.`;
//  
//  return { valid: error === "", error: error }
//}
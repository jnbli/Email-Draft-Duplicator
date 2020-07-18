// Helper function that generates draft duplication information for a draft
function generateDraftDuplicationInfo(draftId, draftsToDuplicate) {
  const template = GmailApp.getDraft(draftId).getMessage(); // So that the referenced draft is up to date when this card is refreshed
  const draftInfo = template.isStarred() ? "starred draft" : "draft";  // Reflect starred draft.
  const draftSubject = template.getSubject();
  const draftSubjectPortion = draftSubject.length === 0 ? "\"(no subject)\"" : `"${draftSubject}"`; // Reflect draft with no subject.

  // For the draftToDuplicate object, the key is the draft id and the value is the number of copies the user selected for each draft.
  if (draftsToDuplicate[draftId] == 1) return `  - ${draftsToDuplicate[draftId]} copy of the ${draftInfo} ${draftSubjectPortion}\n`;
  return `  - ${draftsToDuplicate[draftId]} copies of the ${draftInfo} ${draftSubjectPortion}\n`;
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
}

// Helper function that generates an object of draft ids
function generateDraftIds() {
  const draftIds = {};
  drafts.forEach(draft => draftIds[draft.getId()] = 1);
  return draftIds;
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
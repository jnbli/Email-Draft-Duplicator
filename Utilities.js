// Helper function that updates draft duplication data
function updateDraftsData(cardData, draftId, numberOfCopies) {
  const draftIds = getDraftIds();  // Gets draft ids object since there is a chance the user added, modified, or deleted drafts
  
  let iterationCountDelta = 0;

  if (cardData.draftsToDuplicate) { 
    for (const draftId in cardData.draftsToDuplicate) { // Removes draft selections that have been deleted
      if (!draftIds[draftId]) { 
        delete cardData.draftsToDuplicate[draftId];
        iterationCountDelta--;
      }
      else { delete draftIds[draftId]; }
    }
  }
  
  cardData.draftIds = draftIds; // Accounts for updates with currently selected and/or unselected drafts

  // Draft duplication entry has been made.
  if (draftId && numberOfCopies) {  
    if (!cardData.draftsToDuplicate) cardData.draftsToDuplicate = {};

    // Currently selected draft has not been deleted.
    if (draftIds[draftId]) {
      cardData.draftsToDuplicate[draftId] = numberOfCopies; 
      iterationCountDelta++;  
      
      // Cannot select the same draft if duplicating multiple drafts
      delete cardData.draftIds[draftId];
    } 
  }

  return iterationCountDelta;
}

// Helper function that generates an object of draft ids
function getDraftIds() {
  const draftIds = {};
  drafts.forEach(draft => draftIds[draft.getId()] = 1);
  return draftIds;
}

function updateDraftDuplicationInfoAndCreateCopies(cardData) {
  // Gets draft ids object since there is a chance the user added, modified, or deleted drafts
  const draftIds = getDraftIds();  // The getDraftIds function is defined in the Utilities file.

  let numberOfDraftsDuplicated = 0;
  let userDeletedAtLeastOneSelectedDraft = false;
  const missingDraftInfo = [];
  for (const draftId in cardData.draftsToDuplicate) {
    // The key of draftIds object are the draft ids.
    if (draftIds[draftId]) {  // Selected draft has not been deleted.
      createCopies(cardData.draftsToDuplicate[draftId], GmailApp.getDraft(draftId)); // The createCopies function is defined in the Utilities file.
      numberOfDraftsDuplicated++;

      // Regenerates draft duplication info for the draft just in case the user modified the selected draft     
      cardData.draftDuplicationInfoObj[draftId] = getDraftDuplicationInfo(draftId, cardData.draftsToDuplicate);
    } else {  // Selected draft has been deleted.
      if (!userDeletedAtLeastOneSelectedDraft) userDeletedAtLeastOneSelectedDraft = true; 
      missingDraftInfo.push(cardData.draftDuplicationInfoObj[draftId]);
      delete cardData.draftDuplicationInfoObj[draftId];
    }
  }
  return { numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, missingDraftInfo };
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
  const important = template.getThread().isImportant();
  
  for (let i = 0; i < n; i++) {
    const draft = GmailApp.createDraft(recipient, subject, body, {
      attachments: attachments,
      bcc: bcc,
      cc: cc,
      from: from,
      htmlBody: body,
      replyTo: replyTo
    });
    
    const message = draft.getMessage();
    // if (starred) GmailApp.starMessage(message);  // Duplicating starred drafts duplicates the starred status.
    // if (important) GmailApp.markThreadImportant(message.getThread());   // Duplicating drafts marked as important duplicates the mark.
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////

// Helper function that generates draft duplication information for a draft
function getDraftDuplicationInfo(draftId, draftsToDuplicate) {
  const template = GmailApp.getDraft(draftId).getMessage(); 
  const starred = template.isStarred(), important = template.getThread().isImportant();
  const draftSubject = template.getSubject();

  let draftInfo = "draft";
  draftInfo += draftSubject.length === 0  ? " \"(no subject)\"" : ` "${draftSubject}"`; // Reflects draft with no subject

  // Reflects starred and important drafts
  if (starred && !important) draftInfo = `starred ${draftInfo}`;
  else if (!starred && important) draftInfo = `important ${draftInfo}`;
  else if (starred && important) draftInfo = `starred, important ${draftInfo}`;

  // For the draftToDuplicate object, the key is the draft id and the value is the number of copies the user selected for the draft.
  if (draftsToDuplicate[draftId] == 1) return `  - ${draftsToDuplicate[draftId]} copy of the ${draftInfo}\n`;
  return `  - ${draftsToDuplicate[draftId]} copies of the ${draftInfo}\n`;
}

function getNotificationContent(numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft) {
  if (numberOfDraftsDuplicated === 0) return "Duplication unsuccessful";
  else if (userDeletedAtLeastOneSelectedDraft) return "Duplication partially successful";
  return "Duplication successful";
}

function generateTextButton(text, style, functionName, parameters) {
  const button = CardService.newTextButton()
    .setText(text)
    .setTextButtonStyle(style);

  if (functionName) { 
    const action = CardService.newAction().setFunctionName(functionName);

    // The setParameters function only takes string keys and values for the parameters.
    if (parameters) action.setParameters(parameters);
    button.setOnClickAction(action); 
  }
  
  return button;
}

function generateActionResponse(navigation, notification) {
  if (notification) {
    return CardService.newActionResponseBuilder()
      .setNavigation(navigation)
      .setNotification(notification)
      .build();
  }

  return CardService.newActionResponseBuilder()
      .setNavigation(navigation)
      .build();
}
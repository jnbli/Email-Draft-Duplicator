function buildAddOn(e) {
  
  return HomeCard();
  
}

function SuccessCard(x,y) {
  
  var successParagraph = CardService.newTextParagraph(); 
  if (x == 1) {
    successParagraph.setText("Success! " + x + " copy of the draft \"" + y + "\" was made for you.");
  }
  else {
    successParagraph.setText("Success! " + x + " copies of the draft \"" + y + "\" were made for you.");
  }
      
  var backButton = CardService.newTextButton()
    .setText("Go back")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("HomeCard"));
  
  var congratsSection = CardService.newCardSection()
    .addWidget(successParagraph)
    .addWidget(backButton);
  
  var successCard = CardService.newCardBuilder()
    .setName("Success Card")
    .addSection(congratsSection)
    .build();
  
  return successCard;
}

function HomeCard() {
  
  var gmailDraft = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Select Gmail Draft")
    .setFieldName("draft_id");
  var drafts = GmailApp.getDrafts();
  if (drafts.length == 0) {
    gmailDraft.addItem("", "", false);
  }
  else {
    for (var i=0; i<drafts.length; i++) {
      gmailDraft.addItem(drafts[i].getMessage().getSubject(), drafts[i].getId(), false);
    }
  }
    
  
  var numberInput = CardService.newTextInput()
    .setFieldName("number_of_copies")
    .setTitle("Enter Number of Copies");
  
  var submitButton = CardService.newTextButton()
    .setText("Duplicate")
    .setOnClickAction(CardService.newAction()
                     .setFunctionName("handleForm"));
  
  var formSection = CardService.newCardSection()
    .addWidget(gmailDraft)
    .addWidget(numberInput)
    .addWidget(submitButton);
  
  var homeCard = CardService.newCardBuilder()
    .setName("Home Card")
    .addSection(formSection)
    .build();
  
  return homeCard;
  
}


function handleForm(e) {
  
  var n = e.formInputs.number_of_copies;
  var draftId = e.formInputs.draft_id;
  
  var hasDecimal = (n - Math.floor(n)) !== 0;
  var gtZero = (n > 0);
  
  var textParagraph = CardService.newTextParagraph();
  if (gtZero && !hasDecimal && draftId != "") {
    
    createCopies(n, draftId);
    var draftSubject = GmailApp.getDraft(draftId).getMessage().getSubject();
    
    return SuccessCard(n, draftSubject);
  }
  else {
    return HomeCard();
  }

}


function createCopies(n, draftId) {
  
  var template = GmailApp.getDraft(draftId).getMessage();
  
  var recipient = template.getTo();
  var subject = template.getSubject();
  var body = template.getBody();
  var attachments = template.getAttachments();
  var bcc = template.getBcc();
  var cc = template.getCc();
  var from = template.getFrom();
  var replyTo = template.getReplyTo();
  
  for (var i=0; i<n; i++) {
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
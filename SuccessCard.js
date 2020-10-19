// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(data = {}) {  
  try { return generateSuccessCard(data); } 
  catch (error) { return ErrorCard({ error }); }
}

function generateSuccessCard(data) {
  const { numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, homeCardData } = data;
  const { name } = successCard;

  if (numberOfDraftsDuplicated === 0) {  // No drafts were duplicated.
    return CardService.newCardBuilder()
      .setName(name)
      .setHeader(successCard.generateHeader(false))
      .addSection(successCard.generateInfoSection(false))
      .addSection(successCard.generateFooterSection(homeCardData))
      .build();
  } 

  if (userDeletedAtLeastOneSelectedDraft) {   // Have helpful additional section.
    return CardService.newCardBuilder()
      .setName(name)
      .setHeader(successCard.generateHeader(true, data))
      .addSection(successCard.generateCongratsSection(data))
      .addSection(successCard.generateInfoSection(true, data))
      .addSection(successCard.generateFooterSection(homeCardData))
      .build();
  } 

  return CardService.newCardBuilder()
    .setName(name)
    .setHeader(successCard.generateHeader(true, data))
    .addSection(successCard.generateCongratsSection(data))
    .addSection(successCard.generateFooterSection(homeCardData))
    .build();
}

const successCard = {
  name: "Success Card",

  generateHeader: function(draftsDuplicated, { numberOfDraftsDuplicated } = {}) {
    if (draftsDuplicated) { 
      return CardService.newCardHeader().setTitle(numberOfDraftsDuplicated === 1 ? "The Gmail draft has been duplicated." : "The Gmail drafts have been duplicated.");
    }

    // numberOfDraftsDuplicated === 0
    return CardService.newCardHeader().setTitle("No Gmail drafts have been duplicated.");
  },

  generateInfoSection: function(draftsDuplicated, { missingDraftInfo } = {}) {
    let infoParagraphContent = null, infoParagraph = null;
    if (draftsDuplicated) { 
      return CardService.newCardSection().addWidget(
        CardService.newTextParagraph().setText(this.generateInfoParagraphContent(true, missingDraftInfo))
      );
    } 

    // data.numberOfDraftsDuplicated === 0
    return CardService.newCardSection().addWidget(
      CardService.newTextParagraph().setText(this.generateInfoParagraphContent(false))
    );
  },

  generateCongratsSection: function(data) {
    return CardService.newCardSection().addWidget(CardService.newTextParagraph().setText(this.getSuccessParagraphContent(data)));
  },

  generateFooterSection: function(data) { return CardService.newCardSection().addWidget(this.generateFooterSectionButtonSet(data)); },

  getSuccessParagraphContent: function({ numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, homeCardData } = {}) {
    let successParagraphContent = `${userDeletedAtLeastOneSelectedDraft ? "At least one of the selected drafts has been duplicated." : "Success."} You have made:\n`;
    
    const { draftDuplicationInfoObj } = homeCardData;
    for (const draftId in draftDuplicationInfoObj) successParagraphContent += draftDuplicationInfoObj[draftId];
    
    successParagraphContent += `\n${numberOfDraftsDuplicated === 1 ? "Refresh the drafts panel to see the duplicated draft." : "Refresh the drafts panel to see the duplicated drafts."}`;

    return successParagraphContent;
  },

  generateInfoParagraphContent: function(draftsDuplicated, missingDraftInfo) {
    let infoParagraphContent = "";

    if (draftsDuplicated) {  
      infoParagraphContent += missingDraftInfo.length === 1 ? "Draft duplication that could not be made:\n" : "Draft duplications that could not be made:\n";
      missingDraftInfo.forEach(line => infoParagraphContent += line);
      infoParagraphContent += "\nYou may have deleted one or more drafts right before initiating the duplication. ";
      infoParagraphContent += "Although at least one of your selected drafts was duplicated, " 
      infoParagraphContent += "it is recommended that you avoid deleting any selected drafts until after the duplication has been completed. ";
      infoParagraphContent += "Thank you.";
    } else {  // data.numberOfDraftsDuplicated === 0
      infoParagraphContent += "You may have deleted one or more drafts right before initiating the duplication. ";
      infoParagraphContent += "For successful draft duplication, ";
      infoParagraphContent += "it is recommended that you avoid deleting any selected drafts until after the duplication has been completed. Thank you.";
    }
  
    return infoParagraphContent;
  },

  generateFooterSectionButtonSet: function(data) {
    const { setNumberOfDrafts } = data;

    // The function generateTextButton is defined in the Utilities file.  
    return CardService.newButtonSet()
      .addButton(generateTextButton("Start Over", CardService.TextButtonStyle.FILLED, 
        "goBackToStartCard", { "cardName": this.name, "cardData": JSON.stringify(data), "setNumberOfDrafts": setNumberOfDrafts.toString() }))
      .addButton(generateTextButton("Go Back", CardService.TextButtonStyle.TEXT, 
      "goBackToHomeCard", { "cardName": this.name, "cardData": JSON.stringify(data) }));
  }
};
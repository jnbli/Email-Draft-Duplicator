// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(data = {}) {  
  try { return generateSuccessCard(data); } 
  catch (error) { return ErrorCard({ error, cardName: CardNames.successCardName, cardData: JSON.stringify(data) }); }
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
  name: CardNames.successCardName,  // The CardNames object is located in the Constants file.

  generateHeader: function(draftsDuplicated, { numberOfDraftsDuplicated } = {}) {
    if (draftsDuplicated) { 
      const headerTitle = numberOfDraftsDuplicated === 1 ? "The Gmail draft has been duplicated." : "The Gmail drafts have been duplicated."; 
      return CardService.newCardHeader().setTitle(headerTitle);
    }

    // numberOfDraftsDuplicated === 0
    return CardService.newCardHeader().setTitle("No Gmail drafts have been duplicated.");
  },

  generateInfoSection: function(draftsDuplicated, { missingDraftInfo } = {}) {
    let infoParagraphContent = null, infoParagraph = null;
    if (draftsDuplicated) { 
      infoParagraphContent = this.generateInfoParagraphContent(true, missingDraftInfo);
      infoParagraph = CardService.newTextParagraph().setText(infoParagraphContent);
      return CardService.newCardSection().addWidget(infoParagraph);
    } 

    // data.numberOfDraftsDuplicated === 0
    infoParagraphContent = this.generateInfoParagraphContent(false);
    infoParagraph = CardService.newTextParagraph().setText(infoParagraphContent);
    return CardService.newCardSection().addWidget(infoParagraph);
  },

  generateCongratsSection: function(data) {
    const successParagraphContent = this.getSuccessParagraphContent(data);
    const successParagraph = CardService.newTextParagraph().setText(successParagraphContent)
    return CardService.newCardSection().addWidget(successParagraph);
  },

  generateFooterSection: function(data) { return CardService.newCardSection().addWidget(this.generateFooterSectionButtonSet(data)); },

  getSuccessParagraphContent: function({ numberOfDraftsDuplicated, userDeletedAtLeastOneSelectedDraft, homeCardData } = {}) {
    const status = userDeletedAtLeastOneSelectedDraft ? "At least one of your selected drafts has been duplicated." : "Success!";
    let successParagraphContent = `${status} You have made:\n`;
    
    const { draftDuplicationInfoObj } = homeCardData;
    for (const draftId in draftDuplicationInfoObj) successParagraphContent += draftDuplicationInfoObj[draftId];
    
    const concludingSentence = numberOfDraftsDuplicated === 1 ? "Refresh the drafts panel to see your duplicated draft." : "Refresh the drafts panel to see your duplicated drafts.";
    successParagraphContent += `\n${concludingSentence}`;

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
    } else { // data.numberOfDraftsDuplicated === 0
      infoParagraphContent += "You may have deleted one or more drafts right before initiating the duplication. ";
      infoParagraphContent += "For successful draft duplication, ";
      infoParagraphContent += "it is recommended that you avoid deleting any selected drafts until after the duplication has been completed. ";
      infoParagraphContent += "Select at least one new draft before trying again. Thank you.";
    }
  
    return infoParagraphContent;
  },

  generateFooterSectionButtonSet: function(data) {
    const { setNumberOfDrafts } = data;

    // The function generateTextButton is defined in the Utilities file.
    // Start card info is passed into the goBackToStartCard function callback.
    const startOverButton = generateTextButton("Start Over", CardService.TextButtonStyle.FILLED, 
    "goBackToStartCard", { "cardName": this.name, "cardData": JSON.stringify(data), "setNumberOfDrafts": setNumberOfDrafts.toString() });
    
    // The function generateTextButton is defined in the Utilities file.
    // Home card info is passed into the goBackToStartCard function callback.
    const backButton = generateTextButton("Go Back", CardService.TextButtonStyle.TEXT, 
    "goBackToHomeCard", { "cardName": this.name, "cardData": JSON.stringify(data) });
  
    return CardService.newButtonSet()
      .addButton(startOverButton)
      .addButton(backButton);
  }
};
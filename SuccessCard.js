// Card that displays when the user successfully duplicated draft(s)
function SuccessCard(data = {}) {  
  try {
    let successCard = null;
    if (data.numberOfDraftsDuplicated === 0) {  // No drafts were duplicated
      const header = CardService.newCardHeader().setTitle("No Gmail drafts have been duplicated.");

      let infoParagraphContent = generateInfoParagraphContent(false);

      const infoParagraph = CardService.newTextParagraph().setText(infoParagraphContent);
      const infoSection = CardService.newCardSection().addWidget(infoParagraph);

      successCard = CardService.newCardBuilder()
        .setName(CardNames.successCardName)
        .setHeader(header)
        .addSection(infoSection)
        .addSection(FooterSection(CardNames.successCardName))
        .build();
    } else {  // At least one draft was duplicated
      const headerTitle = data.numberOfDraftsDuplicated == 1 ? "The Gmail draft has been duplicated." : "The Gmail drafts have been duplicated."; 
      const header = CardService.newCardHeader().setTitle(headerTitle);
    
      const concludingSentence = data.numberOfDraftsDuplicated == 1 ? "Refresh the drafts panel to see your duplicated draft." : "Refresh the drafts panel to see your duplicated drafts.";
      
      const status = data.userDeletedAtLeastOneSelectedDraft ? "At least one of your selected drafts has been duplicated." : "Success!";
      let successParagraphContent = `${status} You have made:\n`;
      
      for (const draftId in data.draftDuplicationInfoObj) successParagraphContent += data.draftDuplicationInfoObj[draftId];
      successParagraphContent += `\n${concludingSentence}`;

      const successParagraph = CardService.newTextParagraph().setText(successParagraphContent);
      const congratsSection = CardService.newCardSection().addWidget(successParagraph);
      
      // Have helpful additional section
      if (data.userDeletedAtLeastOneSelectedDraft) {  
        let infoParagraphContent = generateInfoParagraphContent(true, data.missingDraftInfo);
        
        const infoParagraph = CardService.newTextParagraph().setText(infoParagraphContent);
        const infoSection = CardService.newCardSection().addWidget(infoParagraph);

        successCard = CardService.newCardBuilder()
          .setName(CardNames.successCardName)
          .setHeader(header)
          .addSection(congratsSection)
          .addSection(infoSection)
          .addSection(FooterSection(CardNames.successCardName))
          .build();
      } else {
        successCard = CardService.newCardBuilder()
          .setName(CardNames.successCardName)
          .setHeader(header)
          .addSection(congratsSection)
          .addSection(FooterSection(CardNames.successCardName))
          .build();
      }
    }
    
    return successCard;
  } catch (error) {
    return ErrorCard({ error: error });
  }
}

// Helper function specific to the success card that generates info paragraph content
function generateInfoParagraphContent(draftsDuplicated, missingDraftInfo) {
  let infoParagraphContent = "";

  if (!draftsDuplicated) {  // data.numberOfDraftsDuplicated === 0
    infoParagraphContent += "You may have deleted one or more drafts right before initiating the duplication. ";
    infoParagraphContent += "For successful draft duplication, ";
    infoParagraphContent += "it is recommended that you avoid deleting any selected drafts until after the duplication has been completed. ";
    infoParagraphContent += "Select at least one new draft before trying again. Thank you.";
  } else {
    infoParagraphContent += missingDraftInfo.length === 1 ? "Draft duplication that could not be made:\n" : "Draft duplications that could not be made:\n";
    missingDraftInfo.forEach(line => infoParagraphContent += line);
    infoParagraphContent += "\nYou may have deleted one or more drafts right before initiating the duplication. ";
    infoParagraphContent += "Although at least one of your selected drafts was duplicated, " 
    infoParagraphContent += "it is recommended that you avoid deleting any selected drafts until after the duplication has been completed. ";
    infoParagraphContent += "Thank you.";
  }

  return infoParagraphContent;
}
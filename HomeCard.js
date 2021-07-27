// Card that prompts the user to duplicate draft(s)
function HomeCard(data = {}) {
  try {
    const { setNumberOfDrafts } = data;
    const numberOfDrafts = setNumberOfDrafts > drafts.length ? drafts.length : setNumberOfDrafts;
    
    // The start card function will load the no drafts card if there are no drafts available for duplication.
    if (numberOfDrafts === 0) return StartCard(); 

    // The numberOfDrafts variable helps with the displayed draft number adjust to the user creating and/or deleting drafts
    return generateHomeCard(data, numberOfDrafts);
  } catch (error) { return ErrorCard({ error }); }
}

function generateHomeCard(data, numberOfDrafts) {
  const draftDuplicationTextParagraph = homeCard.getDraftDuplicationData(data, numberOfDrafts);
  const { iterationCount } = data, { name } = homeCard;
  
  if (iterationCount === 1 || iterationCount > numberOfDrafts) {
    return CardService.newCardBuilder()
      .setName(name)
      .setHeader(homeCard.generateHeader(data))
      .addSection(homeCard.generateFormSection(data, numberOfDrafts, draftDuplicationTextParagraph))
      .addSection(homeCard.generateFooterSection(data))
      .build();
  } 

  // Not on the first or last iteration
  return CardService.newCardBuilder()
    .setName(name)
    .setHeader(homeCard.generateHeader(data))
    .addSection(homeCard.generateDraftDuplicationInfoSection(draftDuplicationTextParagraph))
    .addSection(homeCard.generateFormSection(data, numberOfDrafts, draftDuplicationTextParagraph))
    .addSection(homeCard.generateFooterSection(data))
    .build();
}

const homeCard = {
  name: "Home Card",
  
  generateHeader: function({ setNumberOfDrafts } = {}) { return CardService.newCardHeader().setTitle(this.generateHeaderMessage(setNumberOfDrafts, drafts.length)); },
  
  generateDraftDuplicationInfoSection: function(draftDuplicationTextParagraph) { return CardService.newCardSection().addWidget(draftDuplicationTextParagraph); },
  
  generateFormSection: function(data, numberOfDrafts, draftDuplicationTextParagraph) {
    const formSection = CardService.newCardSection();
    const { iterationCount } = data;

    // Do not show the header for the selection inputs and selection inputs on the last iteration.
    if (iterationCount <= numberOfDrafts) {
      formSection.addWidget(CardService.newTextParagraph().setText(`Gmail Draft (${iterationCount}/${numberOfDrafts})`));

      const numberOfOptions = drafts.length - iterationCount + 1;
  
      formSection
        .addWidget(this.generateGmailDraftDropdown(data, 
          numberOfOptions === 1 ? `Select a Gmail Draft (${numberOfOptions} option remaining)` : `Select a Gmail Draft (${numberOfOptions} options remaining)`
        ))
        .addWidget(this.generateNumberOfCopiesDropdown(data));
    } else { formSection.addWidget(draftDuplicationTextParagraph); } // Have draft duplication data text paragraph in the form section for the last iteration.
  
    formSection.addWidget(this.generateFormSectionButtonSet(data, numberOfDrafts));
  
    return formSection;
  },
 
  generateFooterSection: function(data) { return CardService.newCardSection().addWidget(this.generateFooterSectionButtonSet(data)); },

  /* Helper function that gets draft duplication data for all drafts that the user has selected
  and returns text paragraph with that info */
  getDraftDuplicationData: function(data = {}, numberOfDrafts) {
    const { iterationCount, draftsToDuplicate } = data;
    
    const draftDuplicationInfoHeader = iterationCount > numberOfDrafts ? "You would like to make:" : "So far, you would like to make:";
  
    let draftDuplicationInfo = "";
    const draftDuplicationInfoObj = {};
    if (iterationCount > 1) { // No draft duplication info displayed on the first iteration
      for (const draftId in draftsToDuplicate) {
        // The getDraftDuplicationInfo function is defined in the Utilities file.
        const currDraftDuplicationInfo = getDraftDuplicationInfo(draftId, draftsToDuplicate);
        draftDuplicationInfo += currDraftDuplicationInfo;
  
        // Creating and assigning the draft duplication info object is only necessary on the last iteration. 
        if (iterationCount > numberOfDrafts) draftDuplicationInfoObj[draftId] = currDraftDuplicationInfo;
      }
    }
  
    // Creating and assigning the draft duplication info object is only necessary on the last iteration. 
    if (iterationCount > numberOfDrafts) data.draftDuplicationInfoObj = draftDuplicationInfoObj;
  
    return CardService.newTextParagraph().setText(`${draftDuplicationInfoHeader}\n${draftDuplicationInfo}`);
  },
  
  generateHeaderMessage: function(setNumberOfDrafts, numberOfDrafts) {
    if (setNumberOfDrafts == 1) return `You would like to duplicate ${setNumberOfDrafts} Gmail draft.`;
    else if (setNumberOfDrafts > numberOfDrafts) { 
      if (numberOfDrafts == 1) return `You would like to duplicate ${setNumberOfDrafts} Gmail drafts. There is only ${numberOfDrafts} draft available.`; 
      else { return `You would like to duplicate ${setNumberOfDrafts} Gmail drafts. There are only ${numberOfDrafts} drafts available.`; } 
    }
    else { return `You would like to duplicate ${setNumberOfDrafts} Gmail drafts.` }
  },
  
  generateGmailDraftDropdown: function(data, title) {
    const gmailDraftDropdown = CardService.newSelectionInput()
      .setFieldName("draft_id")
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle(title);

    // Fills in gmail draft dropdown
    this.generateGmailDraftDropdownItems(gmailDraftDropdown, data);

    return gmailDraftDropdown;
  },

  generateGmailDraftDropdownItems: function(gmailDraftDropdown, { draftIds, formInputs } = {}) {
    for (const draftId in draftIds) { 
      const draftMessage = GmailApp.getDraft(draftId).getMessage();
      let draftSubject = draftMessage.getSubject();
    
      // Handles drafts with empty subject
      if (draftSubject.length === 0) draftSubject = `(no subject)`;
    
      // Retains selected input data
      if (formInputs && draftId == formInputs.draft_id) gmailDraftDropdown.addItem(draftSubject, draftId, true);
      else { gmailDraftDropdown.addItem(draftSubject, draftId, false); }
    }
  },
  
  generateNumberOfCopiesDropdown: function(data) {     
    const numberOfCopiesDropdown = CardService.newSelectionInput()
      .setFieldName("number_of_copies")
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle(`Select Number of Copies (1-${maxDuplicatesPerDraft})`);
  
    // Fills in number of copies dropdown
    this.generateNumberOfCopiesDropdownItems(numberOfCopiesDropdown, data);
    
    return numberOfCopiesDropdown;
  },

  generateNumberOfCopiesDropdownItems: function(numberOfCopiesDropdown, { formInputs } = {}) {
    for (let num = 1; num <= maxDuplicatesPerDraft; num++) { 
      // Retains selected input data
      if (formInputs && num == formInputs.number_of_copies) numberOfCopiesDropdown.addItem(num.toString(), num.toString(), true);
      else { numberOfCopiesDropdown.addItem(num.toString(), num.toString(), false); }
    }
  },

  generateFormSectionButtonSet: function(data, numberOfDrafts) {
    const buttonSet = CardService.newButtonSet();
    const { iterationCount, setNumberOfDrafts } = data;

    // Only show the duplicate button on the last iteration.
    if (iterationCount > numberOfDrafts) {        
      // The function generateTextButton is defined in the Utilities file.
      buttonSet.addButton(generateTextButton(numberOfDrafts > 1 ? "Duplicate Drafts" : "Duplicate Draft", 
        CardService.TextButtonStyle.FILLED, "sendHomeCardFormData", { "cardName": this.name, "cardData" : JSON.stringify(data) }));
    } else {
      // The function generateTextButton is defined in the Utilities file.
      buttonSet.addButton(generateTextButton("Next", CardService.TextButtonStyle.FILLED, 
        "iterateHomeCard", { "cardName": this.name, "cardData" : JSON.stringify(data) }));
    }     

    // The function generateTextButton is defined in the Utilities file.                        
    buttonSet.addButton(generateTextButton("Reset", CardService.TextButtonStyle.TEXT, 
      "resetHomeCard", { "cardName": this.name, setNumberOfDrafts: setNumberOfDrafts.toString() }));
    return buttonSet;
  },

  generateFooterSectionButtonSet: function(data) {
    const { setNumberOfDrafts } = data;

    // The function generateTextButton is defined in the Utilities file.
    return CardService.newButtonSet()
      .addButton(generateTextButton("Go Back", CardService.TextButtonStyle.TEXT, 
        "goBackToStartCard", { "cardName": this.name, "cardData": JSON.stringify(data), "setNumberOfDrafts": setNumberOfDrafts.toString() }))
      .addButton(generateTextButton("Refresh", CardService.TextButtonStyle.FILLED, 
        "reloadCard", { "cardName": this.name, "cardData": JSON.stringify(data) }));
  }
};
// Card that prompts the user to duplicate draft(s)
function HomeCard(data = {}) {  
  try {
    // Helps the total draft number adjust to the user creating and/or deleting drafts
    const numberOfDrafts = data.setNumberOfDrafts > drafts.length ? drafts.length : data.setNumberOfDrafts;
  
    if (numberOfDrafts === 0) return StartCard();

    let headerMessage = "";
    if (data.setNumberOfDrafts == 1) headerMessage = `You would like to duplicate ${data.setNumberOfDrafts} Gmail draft.`;
    else if (data.setNumberOfDrafts > drafts.length) { 
      if (drafts.length == 1) headerMessage = `You would like to duplicate ${data.setNumberOfDrafts} Gmail drafts, but there is only ${drafts.length} draft available.`; 
      else { headerMessage = `You would like to duplicate ${data.setNumberOfDrafts} Gmail drafts, but there are only ${drafts.length} drafts available.`; } 
    }
    else { headerMessage = `You would like to duplicate ${data.setNumberOfDrafts} Gmail drafts.` }

    const header = CardService.newCardHeader().setTitle(headerMessage);
    
    const draftDuplicationInfoHeader = data.iterationCount > numberOfDrafts ? "You would like to make:" : "So far, you would like to make:";
    let draftDuplicationInfo = "";
    const draftDuplicationInfoObj = {};
    if (data.iterationCount > 1) {
      for (const draftId in data.draftsToDuplicate) {        
        // The generateDraftDuplicationInfo function is defined in the Utilities file.
        let currDraftDuplicationInfo = generateDraftDuplicationInfo(draftId, data.draftsToDuplicate);
        draftDuplicationInfo += currDraftDuplicationInfo;

        // The draft duplication info object is only used on the last iteration.
        if (data.iterationCount > numberOfDrafts) draftDuplicationInfoObj[draftId] = currDraftDuplicationInfo;
      }
    }

    // The draft duplication info object is only used on the last iteration.
    if (data.iterationCount > numberOfDrafts) data.draftDuplicationInfoObj = draftDuplicationInfoObj;

    let draftDuplicationInfoText = CardService.newTextParagraph().setText(`${draftDuplicationInfoHeader}\n${draftDuplicationInfo}`);

    const formSection = CardService.newCardSection();
    
    // Do not show the header for the selection inputs and selection inputs on the last possible iteration.
    if (data.iterationCount <= numberOfDrafts) {
      const headerForInput = CardService.newTextParagraph().setText(`Gmail Draft (${data.iterationCount}/${numberOfDrafts})`);
      formSection.addWidget(headerForInput);

      const numberOfOptions = drafts.length - data.iterationCount + 1;
      const gmailDraftDropdownTitle = numberOfOptions === 1 ? `Select a Gmail Draft (${numberOfOptions} option remaining)` : `Select a Gmail Draft (${numberOfOptions} options remaining)`;
      const gmailDraftDropdown = CardService.newSelectionInput()
        .setFieldName("draft_id")
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle(gmailDraftDropdownTitle);

      // Fill in gmail draft dropdown.
      for (const draftId in data.draftIds) {
        const draft = GmailApp.getDraft(draftId);
        const draftMessage = draft.getMessage();
        let draftSubject = draftMessage.getSubject();
      
        // Handle drafts with empty subject.
        if (draftSubject.length === 0) draftSubject = `(no subject) ${draftSubject}`;
      
        // Reflect starred drafts.
        if (draftMessage.isStarred()) draftSubject = `(starred) ${draftSubject}`;

        // Retain selected input data
        if (data.formInputs && draftId == data.formInputs.draft_id) gmailDraftDropdown.addItem(draftSubject, draftId, true);
        else { gmailDraftDropdown.addItem(draftSubject, draftId, false); }
      }
    
      const numberOfCopiesDropdown = CardService.newSelectionInput()
        .setFieldName("number_of_copies")
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle(`Select Number of Copies (1-${maxDuplicatesPerDraft})`);
      
      // Fill in number of copies dropdown.
      for (let num = 1; num <= maxDuplicatesPerDraft; num++) { 
        // Retain selected input data
        if (data.formInputs && num == data.formInputs.number_of_copies) numberOfCopiesDropdown.addItem(num.toString(), num.toString(), true);
        else { numberOfCopiesDropdown.addItem(num.toString(), num.toString(), false); }
      }
    
      formSection
        .addWidget(gmailDraftDropdown)
        .addWidget(numberOfCopiesDropdown);
    } else { formSection.addWidget(draftDuplicationInfoText); } // Have draft duplication info text in the form section for the last iteration.

    const buttonSet = CardService.newButtonSet();

    // Only show the duplicate button on the last possible iteration.
    if (data.iterationCount > numberOfDrafts) {  
      const duplicateButtonName = numberOfDrafts > 1 ? "Duplicate Drafts" : "Duplicate Draft"; 
      const duplicateButton = CardService.newTextButton()
        .setText(duplicateButtonName)
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(CardService.newAction()
                            .setFunctionName("sendHomeCardFormData")
                            // JSON.stringify() is used since setParameters() only takes string keys and values.
                            .setParameters({ "cardData" : JSON.stringify(data) }));
      buttonSet.addButton(duplicateButton);
    } else {
      const nextButton = CardService.newTextButton()
        .setText("Next")
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setOnClickAction(CardService.newAction()
                            .setFunctionName("iterateHomeCard")
                            // JSON.stringify() is used since setParameters() only takes string keys and values.
                            .setParameters({ "cardData" : JSON.stringify(data) }));
      buttonSet.addButton(nextButton);
    }     
    
    const resetButton = CardService.newTextButton()
      .setText("Reset")
      .setOnClickAction(CardService.newAction()
                          .setFunctionName("resetHomeCard")
                          .setParameters({ setNumberOfDrafts: JSON.stringify(data.setNumberOfDrafts) }));                              
    buttonSet.addButton(resetButton);

    formSection.addWidget(buttonSet);

    if (data.iterationCount === 1 || data.iterationCount > numberOfDrafts) {
      const homeCard = CardService.newCardBuilder()
        .setName(CardNames.homeCardName)
        .setHeader(header)
        .addSection(formSection)
        .addSection(FooterSection(CardNames.homeCardName, data))
        .build();
      
      return homeCard;  
    } 

    // Not on the first or last iteration
    const draftDuplicationInfoSection = CardService.newCardSection().addWidget(draftDuplicationInfoText);
    const homeCard = CardService.newCardBuilder()
      .setName(CardNames.homeCardName)
      .setHeader(header)
      .addSection(draftDuplicationInfoSection)
      .addSection(formSection)
      .addSection(FooterSection(CardNames.homeCardName, data))
      .build();
    
    return homeCard;  
  } catch (error) {
    return ErrorCard({ error: error });
  }
}
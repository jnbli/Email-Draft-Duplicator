// Card that prompts the user to duplicate draft(s)
// The additional error parameter is used by the number text input to show an error message if necessary.
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

    if (data.iterationCount <= numberOfDrafts) draftDuplicationInfo += "\n";
    const draftDuplicationInfoText = CardService.newTextParagraph().setText(`${draftDuplicationInfoHeader}\n${draftDuplicationInfo}`);

    const headerForInput = CardService.newTextParagraph().setText(`Gmail Draft (${data.iterationCount}/${numberOfDrafts})`);

    const formSection = CardService.newCardSection();
    if (data.iterationCount > 1) formSection.addWidget(draftDuplicationInfoText)
    
    // Do not show the header for the selection inputs and selection inputs on the last possible iteration.
    if (data.iterationCount <= numberOfDrafts) {
      formSection.addWidget(headerForInput);

      const gmailDraftDropdown = CardService.newSelectionInput()
        .setFieldName("draft_id")
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Select a Gmail Draft");

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
        .setTitle("Select Number of Copies");
      
      // Fill in number of copies dropdown.
      for (let num = 1; num <= maxDuplicatesPerDraft; num++) { 
        // Retain selected input data
        if (data.formInputs && num == data.formInputs.number_of_copies) numberOfCopiesDropdown.addItem(num.toString(), num.toString(), true);
        else { numberOfCopiesDropdown.addItem(num.toString(), num.toString(), false); }
      }
    
      formSection
        .addWidget(gmailDraftDropdown)
        .addWidget(numberOfCopiesDropdown);
    }

    const buttonSet = CardService.newButtonSet();

    // Only show the duplicate button on the last possible iteration.
    if (data.iterationCount > numberOfDrafts) {  
      const duplicateButtonName = numberOfDrafts > 1 ? "Duplicate Drafts" : "Duplicate Draft"; 
      const duplicateButton = CardService.newTextButton()
        .setText(duplicateButtonName)
        .setOnClickAction(CardService.newAction()
                            .setFunctionName("sendHomeCardFormData")
                            // JSON.stringify() is used since setParameters() only takes string keys and values.
                            .setParameters({ "cardData" : JSON.stringify(data) }));
      buttonSet.addButton(duplicateButton);
    } else {
      const nextButton = CardService.newTextButton()
        .setText("Next")
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

    const homeCard = CardService.newCardBuilder()
      .setName(CardNames.homeCardName)
      .setHeader(header)
      .addSection(formSection)
      .addSection(FooterSection(CardNames.homeCardName, data))
      .build();
    
    return homeCard;  
  } catch (error) {
    return ErrorCard({ error: error });
  }
}
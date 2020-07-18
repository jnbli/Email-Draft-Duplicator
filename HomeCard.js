// Card that prompts the user to duplicate draft(s)
// The additional error parameter is used by the number text input to show an error message if necessary.
function HomeCard(data = {}) {  
  try {
    data.numberOfDrafts = data.numberOfDrafts > drafts.length ? drafts.length : data.numberOfDrafts;
    
    if (data.numberOfDrafts === 0) return StartCard({ numberOfDrafts: data.draftIds.numberOfDrafts });

    const headerMessage = data.numberOfDrafts == 1 ? "You would like to duplicate 1 Gmail draft." : `You would like to duplicate ${data.numberOfDrafts} Gmail drafts.`;
    const header = CardService.newCardHeader().setTitle(headerMessage);
    
    const draftDuplicationInfoHeader = data.iterationCount > data.numberOfDrafts ? "You would like to make:" : "So far, you would like to make:";
    let draftDuplicationInfo = "";
    if (data.iterationCount > 1) {
      data.draftsToDuplicate.forEach(draftToDuplicate => {
        const template = GmailApp.getDraft(draftToDuplicate.id).getMessage(); // So that the referenced draft is up to date when this card is refreshed
        const draftInfo = template.isStarred() ? "starred draft" : "draft";  // Reflect starred draft.
        const draftSubject = template.getSubject();
        const draftSubjectPortion = draftSubject.length === 0 ? "\"(no subject)\"" : `"${draftSubject}"`; // Reflect draft with no subject.
        
        if (draftToDuplicate.numberOfCopies == 1) draftDuplicationInfo += `  - ${draftToDuplicate.numberOfCopies} copy of the ${draftInfo} ${draftSubjectPortion}\n`;
        else { draftDuplicationInfo += `  - ${draftToDuplicate.numberOfCopies} copies of the ${draftInfo} ${draftSubjectPortion}\n`; }
      });
    }

    if (data.iterationCount <= data.numberOfDrafts) draftDuplicationInfo += "\n";
    const draftDuplicationInfoText = CardService.newTextParagraph().setText(`${draftDuplicationInfoHeader}\n${draftDuplicationInfo}`);

    const headerForInput = CardService.newTextParagraph().setText(`Gmail Draft (${data.iterationCount}/${data.numberOfDrafts})`);

    const formSection = CardService.newCardSection();
    if (data.iterationCount > 1) formSection.addWidget(draftDuplicationInfoText)
    
    // Do not show the header for the selection inputs and selection inputs on the last iteration
    if (data.iterationCount <= data.numberOfDrafts) {
      formSection.addWidget(headerForInput);

      const gmailDraftDropdown = CardService.newSelectionInput()
        .setFieldName("draft_id")
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Select a Gmail Draft");

      // Fill in gmail draft dropdown
      for (const draftId in data.draftIds) {
        const draft = GmailApp.getDraft(draftId);
        const draftMessage = draft.getMessage();
        let draftSubject = draftMessage.getSubject();
      
        // Handle drafts with empty subject.
        if (draftSubject.length === 0) draftSubject = `(no subject) ${draftSubject}`;
      
        // Reflect starred drafts.
        if (draftMessage.isStarred()) draftSubject = `(starred) ${draftSubject}`;

        if (data.formInputs && draftId == data.formInputs.draft_id) gmailDraftDropdown.addItem(draftSubject, draftId, true);
        else { gmailDraftDropdown.addItem(draftSubject, draftId, false); }
      }
    
      const numberOfCopiesDropdown = CardService.newSelectionInput()
        .setFieldName("number_of_copies")
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("Select Number of Copies");
      
      // Fill in number of copies dropdown
      for (let num = 1; num <= maxDuplicatesPerDraft; num++) { 
        if (data.formInputs && num == data.formInputs.number_of_copies) numberOfCopiesDropdown.addItem(num.toString(), num.toString(), true);
        else { numberOfCopiesDropdown.addItem(num.toString(), num.toString(), false); }
      }
    
      formSection
        .addWidget(gmailDraftDropdown)
        .addWidget(numberOfCopiesDropdown);
    }

    const buttonSet = CardService.newButtonSet();

    // Only show the duplicate button once the user is done entering duplication data
    if (data.iterationCount > data.numberOfDrafts) {  
      const duplicateButtonName = data.numberOfDrafts > 1 ? "Duplicate Drafts" : "Duplicate Draft"; 
      const duplicateButton = CardService.newTextButton()
        .setText(duplicateButtonName)
        .setOnClickAction(CardService.newAction()
                            .setFunctionName("sendHomeCardFormData")
                            // JSON.stringify() is used since setParameters() only takes string keys and values.
                            .setParameters({ "cardData" : JSON.stringify(data), "draftDuplicationInfo": draftDuplicationInfo }));
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
                          .setParameters({ numberOfDrafts: JSON.stringify(data.numberOfDrafts) }));

    const backButton = CardService.newTextButton()
      .setText("Go Back")
      .setOnClickAction(CardService.newAction()
                          .setFunctionName("goBackToPreviousCard")); 
                                  
    buttonSet
      .addButton(resetButton)
      .addButton(backButton);

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
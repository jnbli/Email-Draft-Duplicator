// Card that prompts the user to specify how many drafts to duplicate
function StartCard(data = {}) {
  try {
    let startCard = null;

    // If the user currently has no Gmail drafts
    if (drafts.length == 0) {
      const header = CardService.newCardHeader().setTitle("You have no Gmail drafts.");
      
      const message = CardService.newTextParagraph().setText("You must have at least one Gmail draft to duplicate draft(s).");
      const mainSection = CardService.newCardSection().addWidget(message);
      
      startCard = CardService.newCardBuilder()
        .setName(CardNames.startCardName)
        .setHeader(header)
        .addSection(mainSection)
        .addSection(FooterSection(CardNames.startCardName, data))
        .build();
    } else { // If the user currently has at least 1 Gmail draft(s)
      //    const headerMessage = drafts.length === 1 ? "You have 1 Gmail draft." : `You have ${drafts.length} Gmail drafts.`; // Commented out since the add-on has a maximum for the number of drafts the user can duplicate at once for performance.
      const header = CardService.newCardHeader().setTitle("Let's start duplicating your Gmail drafts.");
      
      const maximumNumberOfDrafts = drafts.length > maxDraftsAtOnce ? maxDraftsAtOnce : drafts.length;
      const numberOfDraftsDropdownTitle = maximumNumberOfDrafts > 1 ? `Select Number of Gmail Drafts to Duplicate (1-${maximumNumberOfDrafts})` : `Select Number of Gmail Drafts to Duplicate (${maximumNumberOfDrafts})`;
      let numberOfDraftsDropdown = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle(numberOfDraftsDropdownTitle)
        .setFieldName("number_of_drafts");
      
      // Fill in number of drafts input dropdown
      
      for (let num = 1; num <= maximumNumberOfDrafts; num++) { 
        if (data.formInputs && num == data.formInputs.number_of_drafts) numberOfDraftsDropdown.addItem(num.toString(), num.toString(), true);
        else { numberOfDraftsDropdown.addItem(num.toString(), num.toString(), false); }
      }
      
      const nextButton = CardService.newTextButton()
        .setText("Next")
        .setOnClickAction(CardService.newAction()
                        .setFunctionName("handleStartCardForm"));
      
      const formSection = CardService.newCardSection()
        .addWidget(numberOfDraftsDropdown)
        .addWidget(nextButton);
      
      startCard = CardService.newCardBuilder()
        .setName(CardNames.startCardName)
        .setHeader(header)
        .addSection(formSection)
        .addSection(FooterSection(CardNames.startCardName, data))
        .build();
    }
    
    return startCard;
  } catch (error) {
    return ErrorCard({ error: error });
  }
}
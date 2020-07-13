// Card that prompts the user to specify how many drafts to duplicate
// The additional error parameter is used by the number text input to show an error message if necessary.
function StartCard(data = {}) {
  let startCard = null;
  
  // If the user currently has no Gmail drafts
  if (drafts.length == 0) {
    const header = CardService.newCardHeader().setTitle("You have no Gmail drafts.");
    
    const message = CardService.newTextParagraph().setText("You must have at least one Gmail draft to duplicate draft(s).");
    const mainSection = CardService.newCardSection().addWidget(message);
    
    startCard = CardService.newCardBuilder()
      .setName("Home Card")
      .setHeader(header)
      .addSection(mainSection)
      .build();
  } else { // If the user currently has at least 1 Gmail draft(s)
    const headerMessage = drafts.length === 1 ? "You have 1 Gmail draft." : `You have ${drafts.length} Gmail drafts.`;
    const header = CardService.newCardHeader().setTitle(headerMessage);
    
    let numberOfDraftsDropdown = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle("Select Number of Gmail Drafts to Duplicate")
      .setFieldName("number_of_drafts");
    
    // Fill in number of drafts input dropdown
    for (let num = 1; num <= drafts.length; num++) numberOfDraftsDropdown.addItem(num.toString(), num.toString(), false);
    
    const nextButton = CardService.newTextButton()
    .setText("Next")
    .setOnClickAction(CardService.newAction()
                      .setFunctionName("handleStartCardForm"));
    
    const formSection = CardService.newCardSection()
      .addWidget(numberOfDraftsDropdown)
      .addWidget(nextButton);
    
    startCard = CardService.newCardBuilder()
      .setName("Start Card")
      .setHeader(header)
      .addSection(formSection)
      .build();
  }
  
  return startCard;
}
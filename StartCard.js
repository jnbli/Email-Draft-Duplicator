// Card that prompts the user to specify how many drafts to duplicate
function StartCard(data = {}) {
  const { name } = startCard;
  try { 
    // If the user currently has no Gmail drafts
    if (drafts.length == 0) return NoDraftsCard();
    return generateStartCard(data); 
  } catch (error) { return ErrorCard({ error, cardName: name, cardData: JSON.stringify(data) }); }
}

function generateStartCard(data) {
  const { name } = startCard;
  
  // If the user currently has at least 1 Gmail draft      
  return CardService.newCardBuilder()
    .setName(name)
    .setHeader(startCard.generateHeader())
    .addSection(startCard.generateFormSection(data))
    .addSection(startCard.generateFooterSection(data))
    .build();
}

const startCard = {
  name: CardNames.startCardName,  // The CardNames object is located in the Constants file.
  
  generateHeader: function() { return CardService.newCardHeader().setTitle("Let's start duplicating your Gmail drafts."); },

  // Helper function that generates the main section for the case the user currently has no drafts
  generateMainSection: function() {
    const message = CardService.newTextParagraph().setText("You must have at least one Gmail draft to duplicate draft(s).");
    return CardService.newCardSection().addWidget(message);
  },

  // Helper function that generates the form section for the case the user currently has at least 1 Gmail draft(s)
  generateFormSection: function(data) {
    const maxNumberOfDrafts = drafts.length > maxDraftsAtOnce ? maxDraftsAtOnce : drafts.length;
    const numberOfDraftsDropdownTitle = maxNumberOfDrafts > 1 ? `Select Number of Gmail Drafts to Duplicate (1-${maxNumberOfDrafts})` : `Select Number of Gmail Drafts to Duplicate (${maxNumberOfDrafts})`;
    
    const numberOfDraftsDropdown = this.generateNumberOfDraftsDropdown(data, maxNumberOfDrafts, numberOfDraftsDropdownTitle);
    
    // The function generateTextButton is defined in the Utilities file.
    const nextButton = generateTextButton("Next", CardService.TextButtonStyle.FILLED, 
    "handleStartCardForm", { "cardName": this.name, "cardData": JSON.stringify(data) });

    return CardService.newCardSection()
      .addWidget(numberOfDraftsDropdown)
      .addWidget(nextButton);
  },
  
  generateFooterSection: function(data) {
    // The function generateTextButton is defined in the Utilities file.
    const refreshButton = generateTextButton("Refresh", CardService.TextButtonStyle.TEXT, 
    "reloadCard", { "cardName": this.name, "cardData": JSON.stringify(data) });
    return CardService.newCardSection()
      .addWidget(refreshButton);
  },
  
  generateNumberOfDraftsDropdown: function(data, maxNumberOfDrafts, numberOfDraftsDropdownTitle) {
    const numberOfDraftsDropdown = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.DROPDOWN)
      .setTitle(numberOfDraftsDropdownTitle)
      .setFieldName("number_of_drafts");

    // Fill in number of drafts dropdown.
    this.generateNumberOfDraftsDropdownItems(numberOfDraftsDropdown, data, maxNumberOfDrafts);

    return numberOfDraftsDropdown;
  },
  
  generateNumberOfDraftsDropdownItems: function(numberOfDraftsDropdown, { formInputs, setNumberOfDrafts } = {}, maxNumberOfDrafts) {
    for (let num = 1; num <= maxNumberOfDrafts; num++) { 
      if ((formInputs && num == formInputs.number_of_drafts) || (setNumberOfDrafts && num == setNumberOfDrafts)) { 
        numberOfDraftsDropdown.addItem(num.toString(), num.toString(), true);
      } else { numberOfDraftsDropdown.addItem(num.toString(), num.toString(), false); }
    }
  },
};
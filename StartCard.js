// Card that prompts the user to specify how many drafts to duplicate
function StartCard(data = {}) {
  try { 
    // If the user currently has no Gmail drafts
    if (drafts.length === 0) return NoDraftsCard();
    return generateStartCard(data); 
  } catch (error) { return ErrorCard({ error }); }
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
  name: "Start Card",
  
  generateHeader: function() { return CardService.newCardHeader().setTitle("Let's start duplicating your Gmail drafts."); },

  // Helper function that generates the form section for the case the user currently has at least 1 Gmail draft(s)
  generateFormSection: function(data) {
    const maxNumberOfDrafts = drafts.length > maxDraftsAtOnce ? maxDraftsAtOnce : drafts.length;
    
    // The function generateTextButton is defined in the Utilities file.
    return CardService.newCardSection()
      .addWidget(this.generateNumberOfDraftsDropdown(data, maxNumberOfDrafts, 
        maxNumberOfDrafts > 1 ? `Select Number of Gmail Drafts to Duplicate (1-${maxNumberOfDrafts})` : 
                                `Select Number of Gmail Drafts to Duplicate (${maxNumberOfDrafts})`))
      .addWidget(generateTextButton("Next", CardService.TextButtonStyle.FILLED, 
        "handleStartCardForm", { "cardName": this.name, "cardData": JSON.stringify(data) }));
  },
  
  generateFooterSection: function(data) {
    // The function generateTextButton is defined in the Utilities file.
    return CardService.newCardSection().addWidget(generateTextButton("Refresh", CardService.TextButtonStyle.TEXT, 
      "reloadCard", { "cardName": this.name, "cardData": JSON.stringify(data) }));
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
    let selectedNum = 1;  
    if (formInputs && formInputs.number_of_drafts) selectedNum = Number(formInputs.number_of_drafts);
    else if (setNumberOfDrafts) selectedNum = setNumberOfDrafts;

    for (let num = 1; num <= maxNumberOfDrafts; num++) { 
      if (num === selectedNum) numberOfDraftsDropdown.addItem(num.toString(), num.toString(), true);
      else { numberOfDraftsDropdown.addItem(num.toString(), num.toString(), false); }
    }
  },
};
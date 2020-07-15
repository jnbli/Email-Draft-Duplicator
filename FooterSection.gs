// Generates a footer section to be used in card(s)
function FooterSection() {
  const refreshButton = CardService.newTextButton()
    .setText("Refresh")
    .setOnClickAction(CardService.newAction()
                       .setFunctionName("reloadAddOn"));

  const footerButtonSet = CardService.newButtonSet()
    .addButton(refreshButton);
  
  // Card service's fixed footer causes display glitch with selection input, so the footer is created as a section instead.
  return CardService.newCardSection().addWidget(footerButtonSet);
}
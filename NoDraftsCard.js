// Card that tells the user that he/she has no drafts
function NoDraftsCard() {
    try { return generateNoDraftsCard(); }
    catch (error) { return ErrorCard({ error }); }
}

function generateNoDraftsCard() {
    const { name } = noDraftsCard;

    if (drafts.length === 0) {
        return CardService.newCardBuilder()
            .setName(name)
            .setHeader(noDraftsCard.generateHeader())
            .addSection(noDraftsCard.generateFooterSection())
            .build();
    } else { return StartCard(); } 
}

const noDraftsCard = {
    name: CardNames.noDraftsCardName,

    generateHeader: function() { return CardService.newCardHeader().setTitle("You have no Gmail drafts."); },

    generateFooterSection: function() {
        // The function generateTextButton is defined in the Utilities file.
        const refreshButton = generateTextButton("Refresh", CardService.TextButtonStyle.FILLED, 
         "reloadCard", { "cardName": this.name, "cardData": JSON.stringify({}) });
        return CardService.newCardSection()
            .addWidget(refreshButton);
    }
};
// Card that tells the user that he/she has no drafts
// Data object is just there for now (may be useful for future updates).
function NoDraftsCard(data = {}) {
    try { return generateNoDraftsCard(data); }
    catch (error) { return ErrorCard({ error, cardName: CardNames.noDraftsCardName, cardData: data }); }
}

function generateNoDraftsCard(data) {
    const { name } = noDraftsCard;

    if (drafts.length === 0) {
        return CardService.newCardBuilder()
            .setName(name)
            .setHeader(noDraftsCard.generateHeader())
            .addSection(noDraftsCard.generateFooterSection(data))
            .build();
    } else { return StartCard(); }  // Go to the root card.
}

const noDraftsCard = {
    name: CardNames.noDraftsCardName,

    generateHeader: function() { return CardService.newCardHeader().setTitle("You have no Gmail drafts."); },

    generateFooterSection: function(data) {
        // The function generateTextButton is defined in the Utilities file.
        const refreshButton = generateTextButton("Refresh", CardService.TextButtonStyle.FILLED, 
         "reloadCard", { "cardName": this.name, "cardData": JSON.stringify(data) });
        return CardService.newCardSection()
            .addWidget(refreshButton);
    }
};
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
    name: "No Drafts Card",

    generateHeader: function() { return CardService.newCardHeader().setTitle("You have no Gmail drafts."); },

    generateFooterSection: function() {
        // The function generateTextButton is defined in the Utilities file.
        return CardService.newCardSection().addWidget(generateTextButton("Refresh", CardService.TextButtonStyle.FILLED, 
            "reloadCard", { "cardName": this.name, "cardData": JSON.stringify({}) }));
    }
};
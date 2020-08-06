// Card that asks the user if he/she already knows which drafts to duplicate.
function IntroCard(data = {}) {
    try { return generateIntroCard(); }
    catch (error) { return ErrorCard({ error }); }
}

function generateIntroCard() {
    const { name } = introCard;

}

const introCard = {
    name: CardNames.introCardName,  // The CardNames object is located in the Constants file.

};
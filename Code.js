const drafts = GmailApp.getDrafts();

const maxDraftsAtOnce = 10;
const maxDuplicatesPerDraft = 10;

// Invoked on homepage and contextual triggers
function buildAddOn() { return StartCard(); }
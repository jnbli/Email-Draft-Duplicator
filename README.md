<p align="center">
  <img src="https://raw.githubusercontent.com/jnbli/Gmail-Draft-Duplicator/master/Logo.png" alt="Gmail Draft Duplicator Logo" width="200" height="200">
</p>

# Gmail Draft Duplicator
This is a Gmail add-on that you can use to duplicate email drafts in Gmail. All releases can be found at the base repository [here](https://github.com/jnbli/Gmail-Draft-Duplicator/releases).

## Installation Instructions and How It Works
See this [video](https://www.youtube.com/watch?v=o3JVWLKUrYs).

## TODOs
### Feature(s)
- [X] User can duplicate drafts (given that the user has at least 1 draft) without having to click on an email if this add-on is used on non-mobile versions of Gmail.
- [X] If a starred draft is duplicated, the starred status transfers over to the duplicates.
- [X] User can duplicate more than one draft at once.
- [X] User can refresh certain cards via a button on the footer. This is useful for ensuring that those cards are processing and displaying up-to-date data.
- [ ] User cannot select the same draft if duplicating multiple drafts.
- [ ] Input data for the card the user is currently on persists when the card is loaded again in any way (either through a refresh or navigation).

### UI
- [X] Add header to cards.
- [X] If there are no drafts available, add-on displays a message instead of the usual UI elements.
- [X] UI reflects starred drafts.
- [X] UI better handles drafts with no subject.
- [X] Suggestions reflect maximum number of copies user can make for a draft.
- [X] Create starting card asking the user how many drafts to duplicate.
- [X] Change number inputs to dropdown inputs, with each numerical choice a dropdown item.
- [X] Home card allows user to select number of duplicates to make for multiple drafts.
- [X] Success card reflects duplication of multiple drafts.
- [X] Add footer with a button that allows the user to refresh the card on certain cards.
- [X] User can also refresh the start card without having any drafts.
- [X] Add back button to the success card.
- [ ] Add notification(s).
- [ ] Add error card.
- [ ] Have home card list draft selection and duplication frequency for one draft at a time instead of list for all drafts.

### Performance Improvement(s) and Optimization(s)
- [X] Implement maximum allowed number of duplicates for a draft to minimize the amount of time it takes to create the duplicates.
- [X] Implement maximum allowed number of drafts to duplicate at once to minimize the amount of time it takes to load the home card.

### Code Refactor and Fixing Bug(s)
- [X] Use modern JavaScript syntax.
- [X] Refactor code into separate files and comment code.
- [X] Cards take in data object for use by UI element(s).
- [X] Refactor with card navigation.
- [X] Use a separate file to store global constants.
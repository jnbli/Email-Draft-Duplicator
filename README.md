<p align="center">
  <img src="https://raw.githubusercontent.com/jnbli/Gmail-Draft-Duplicator/master/Logo.png" alt="Gmail Draft Duplicator Logo" width="200" height="200">
</p>

# Gmail Draft Duplicator
This is a Gmail add-on that you can use to duplicate email drafts in Gmail.

## Installation Instructions and How It Works:
See this [video](https://www.youtube.com/watch?v=o3JVWLKUrYs).

## TODOs:
### General
- [ ] Tag and release version `1.0.0` of this add-on on GitHub. 
- [ ] After completing more TODOs after releasing version `1.0.0` of this add-on, tag and release version `1.0.1` of this add-on.

### Feature(s)
- [X] User can duplicate drafts (given that the user has at least 1 draft) without having to click on an email if this add-on is used on non-mobile versions of Gmail.
- [X] If a starred draft is duplicated, the starred status transfers over to the duplicates.
- [ ] User can duplicate more than one draft at once.

### UI
- [X] `Number of Copies` input displays an error message to the user if the input is invalid.
- [X] `Number of Copies` input displays suggestions when clicked.
- [X] Added header to cards.
- [X] If there are no drafts available, add-on displays a message instead of the usual UI elements.
- [X] UI reflects starred drafts.
- [X] UI better handles drafts with no subject.

### Performance Improvement(s) and Optimization(s)
- [ ] Cache list of Gmail drafts and load the cached list for the `Select Gmail Draft` dropdown appropriately.

### Code Refactor
- [X] Use modern JavaScript syntax.
- [X] Refactor code into separate files and comment code.
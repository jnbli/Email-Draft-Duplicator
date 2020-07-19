<p align="center">
  <img src="https://raw.githubusercontent.com/jnbli/Gmail-Draft-Duplicator/master/Logo.png" alt="Gmail Draft Duplicator Logo" width="200" height="200">
</p>

# Gmail Draft Duplicator
This is a Gmail add-on that you can use to duplicate email drafts in Gmail. All releases can be found at the base repository [here](https://github.com/jnbli/Gmail-Draft-Duplicator/releases).

## Installation Instructions
<<<<<<< HEAD
Until we can get the Gmail Draft Duplicator published on G-suite (if we do, then you could get this Gmail add-on the same way you would get any other Gmail add-on), you can use this add-on as a **developer add-on**. To do so, you can follow the instructions in this [video](https://www.youtube.com/watch?v=o3JVWLKUrYs) (which also describes how this add-on functions) or the steps below:
=======
Until we can get the Gmail Draft Duplicator published on G-suite (if we do, then you could get this Gmail add-on the same way you would get any other Gmail add-on), you can use this add-on as a **developer add-on**. To do so, you can follow the instructions in this [video](https://www.youtube.com/watch?v=o3JVWLKUrYs) (which also describes how this add-on functions or the steps below:
>>>>>>> 7acfce1f3d030b41d6a6e848b01676be56326dd4
1) Create a new Google Apps Script project.
2) Copy and paste the contents of `Code.js` from this GitHub repository to `Code.gs` in the Google Apps Script project.
3) Copy and paste the contents of `appsscript.json` from this GitHub repository to `appsscript.json` in the Google Apps Script project. If the `appscript.json` file is not visible, ensure that manifest files are shown via `View` &rarr; `Show manifest file`.
4) Download clasp. 
```sh
$ npm install -g @google/clasp
```
5) Turn on the Google Apps Script API [here](https://script.google.com/home/usersettings).
6) Log into Google via clasp.
```sh
$ clasp login
```
7) Clone this GitHub repository.
<<<<<<< HEAD
8) Head over to the folder container the cloned repository and remove the `.clasp.json` file.
=======
8) Head over to the folder container the cloned repository and remove the `.clasp.json`.
>>>>>>> 7acfce1f3d030b41d6a6e848b01676be56326dd4
9) Clone the Google Apps Script project you just created with clasp. 
```sh
$ clasp clone <google-apps-script-project-url>
```
10) Push the code cloned from this GitHub repository onto the Google Apps Script project.
```sh
$ clasp push
```
11) Refresh the Google Apps Script project. Click on `Publish` &rarr; `Deploy from manifest...` &rarr; `Install add-on`.

12) Now that you have installed the **development edition** of the Gmail Draft Duplicator:
<<<<<<< HEAD
* **To use this add-on in the web version of Gmail**, open up the side panel and click on the icon below the other ones. 
* **To use this add-on in the Gmail mobile app**, tap on any messages, scroll down to the bottom, and tap on the icon within the `Available add-ons` section.
=======
* To use this add-on in the web version of Gmail, open up the side panel and click on the icon below the other ones. 
* To use this add-on in the Gmail mobile app, tap on any messages, scroll down to the bottom, and tap on the icon within the `Available add-ons` section.
>>>>>>> 7acfce1f3d030b41d6a6e848b01676be56326dd4

## TODOs
### Feature(s)
- [X] User can duplicate drafts (given that the user has at least 1 draft) without having to click on an email if this add-on is used on non-mobile versions of Gmail.
- [X] If a starred draft is duplicated, the starred status transfers over to the duplicates.
- [X] User can duplicate more than one draft at once.
- [X] User can refresh certain cards via a button on the footer. This is useful for ensuring that those cards are processing and displaying up-to-date data.
- [X] User can go back and forth between cards via button(s) on certain cards.
- [X] User cannot select the same draft if duplicating multiple drafts.
- [X] Input data for the card the user is currently on does not change when the card is reloaded (except for after each iteration of the home card).
- [X] Success card content is dynamic (for example, if the user modified and/or deleted one or more selected draft(s) before duplication, the update is reflected).

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
- [X] Add back button to the home card.
- [X] Add back button to the success card.
- [X] Add successful duplication notification.
- [X] Add error card.
- [X] Make home card dynamic.
- [X] Add reset button to home card. 
- [X] Have a footer for the success and error cards and redistribute button(s) in the footer for the home and success cards.
- [X] Selection input titles display number of available choices.
- [X] Make some of the buttons filled with a background.
- [X] When present, home card draft duplication info is in its own section except for the last iteration.

### Performance Improvement(s) and Optimization(s)
- [X] Implement maximum allowed number of duplicates for a draft to minimize the amount of time it takes to create the duplicates.
- [X] Implement maximum allowed number of drafts to duplicate at once.

### Code Refactor and Fixing Bug(s)
- [X] Use modern JavaScript syntax.
- [X] Refactor code into separate files and comment code.
- [X] Cards take in data object for use by UI element(s).
- [X] Refactor with card navigation.
- [X] Use a separate file to store global constants.
- [X] Fix bug with the home card that occurs if the user removes a draft that was already selected and clicks/taps the refresh button.
- [X] Fix unadaptive total number of drafts in the home card.
- [X] Prevent runtime error that occurs if the user tries to duplicate selected draft(s) after deleting them without refreshing the home card.
- [X] Fix bug with the home card that occurs if the user removes a draft that was already selected and clicks/taps the next button.
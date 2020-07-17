<p align="center">
  <img src="https://raw.githubusercontent.com/jnbli/Gmail-Draft-Duplicator/master/Logo.png" alt="Gmail Draft Duplicator Logo" width="200" height="200">
</p>

# Gmail Draft Duplicator
This is a Gmail add-on that you can use to duplicate email drafts in Gmail. All releases can be found at the base repository [here](https://github.com/jnbli/Gmail-Draft-Duplicator/releases).

## Installation and Usage Instructions
Until we can get this add-on published on G-suite (if we do, then you could get this Gmail add-on the same way you would get any other Gmail add-on), you can use this add-on as a **developer add-on**. To do so, follow instructions in this [video](https://www.youtube.com/watch?v=o3JVWLKUrYs) (which also describes how this add-on functions). Alternatively:

### For Gmail In the Browser
1) Get the [Google Apps Script GitHub Assistant](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo) chrome extension.
2) Create a new Google Apps Script project on your Google Drive and open it. It is recommended to name this project Gmail Draft Duplicator. 
3) Fork this repo.
4) Next to the `Select function` dropdown, select the forked repo in the `Repo` dropdown.
5) Ensure that the `master` branch is selected in the `Branch` dropdown.
6) Click on the button with the arrow icon pointing down. This opens up a window showing all the diffs.
7) Scroll down to the bottom of the window and click on `Pull`. 
8) Ensure that the option to show the manifest file is toggled on. Copy and paste the contents of the `appsscript.json` file from this repo to the one in the Google Apps Script project.
9) Click on `Publish`, then `Deploy from manifest...`, then `Install add-on` with the deployment that is listed in the `Deployments` window. 
10) Open up Gmail. Click on `Show side panel` if you have not already done so. Then, look for the icon that you see on the beginning of this README on the side panel. Click on it.
11) If prompted, click on the `Authorize Access` button, which opens up a window. In that window, sign in with your Google Account, click on `Advanced`, then the `Go to` option, then `Allow`. 

### For Gmail Mobile App
Follow through **steps 1-10**. Then, open up the Gmail app on a mobile device, scroll down to the bottom of an email, look for the `Available add-ons` bottom menu, and tap on the icon that you see on the beginning of this README. If you have not already given this add-on authorization access, follow **step 11**.

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
- [X] Add back button to the home card.
- [X] Add back button to the success card.
- [X] Add successful duplication notification.
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

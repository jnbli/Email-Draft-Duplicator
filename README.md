<p align="center">
  <img src="https://raw.githubusercontent.com/jnbli/Gmail-Draft-Duplicator/master/Logo.png" alt="Gmail Draft Duplicator Logo" width="200" height="200">
</p>

# Gmail Draft Duplicator
This is a Gmail add-on that you can use to duplicate email drafts in Gmail. All releases can be found at the base repository [here](https://github.com/jnbli/Gmail-Draft-Duplicator/releases).

## Installation Instructions
Until the Gmail Draft Duplicator is on G-suite (if it is, then you could get this Gmail add-on the same way you would get any other Gmail add-on), you can use this add-on as a **developer add-on**. To do so, you can follow the instructions in this [video](https://www.youtube.com/watch?v=o3JVWLKUrYs) (which also describes how this add-on functions) or the steps below:

1. Create a new Google Apps Script project.
2. Copy and paste the contents of `Code.js` from this GitHub repository to `Code.gs` in the Google Apps Script project. The `Code.gs` file should have been automatically created from step 1. Treat `.js` files as `.gs` files in the Google Apps Script project.
3. If you do not see the `appsscript.json` file, click on `View` &rarr; `Show manifest file`. The `manifest file` for Apps Script projects is the `appsscript.json` file.
4. Copy and paste the contents of `appsscript.json` from this GitHub repository to `appsscript.json` in the Google Apps Script project. 
5. Download clasp with npm. See npm installation instructions [here](https://www.npmjs.com/get-npm) if you do not already have npm installed.
```sh
npm install -g @google/clasp
```
6. Turn on the Google Apps Script API [here](https://script.google.com/home/usersettings).
7. Log into Google via clasp.
```sh
clasp login
```
8. Clone this GitHub repository and go into the folder with the clone.
9. Using clasp, clone the Google Apps Script project you just created into the created folder containing the cloned GitHub repository. 
```sh
clasp clone <google-apps-script-project-url>
```
10. Using clasp, push the code cloned from this GitHub repository onto the Google Apps Script project. 
```sh
clasp push
```
11. Refresh the Google Apps Script project. Click on `Publish` &rarr; `Deploy from manifest...` to start the deployment process. 
12. If you would prefer to use a new deployment rather than using the "Latest Version" deployment, click on `Create`, enter in a name of your choice for the `Deployment name` option, ensure that `appsscript` is selected for the `Manifest` option, and click on `Save`. 
13. Choose a deployment and click on `Install add-on`. 
14. Now that you have installed the **development edition** of the Gmail Draft Duplicator:
* **To use this add-on in the web version of Gmail**, open up the side panel and click on the icon below the other ones. 
* **To use this add-on in the Gmail mobile app**, tap on a message, scroll down to the bottom, and tap on the icon within the `Available add-ons` section.
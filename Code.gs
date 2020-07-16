// Could not find a way to split this off into a separate file and have this file reference this class
// Purpose is to cache the various UI elements of this add-on
//class AppCache {
//  constructor() {    
//    // Serves as the cache
//    this.UIObjects = {
//      "headerObject": null,
//      "messageObject": null,
//      "gmailDraftDropdown": null,
//      "numberInput": null,
//      "submitButton": null,
//      "backButton": null
//    };
//    Logger.log("App cache constructed.");
//  }
//  
//  getUIObject(objectName) {
//    // Object already in the cache
//    let object = this.UIObjects[objectName];
//    Logger.log(this.UIObjects);
//    if (object) { Logger.log("Retrieved from cache."); return object; }
//    
//    // Object not in the cache already
//    object = this.generateUIObject(objectName);
//    this.UIObjects[objectName] = object;
//    Logger.log("Not in cache already, generated.");
//    Logger.log(this.UIObjects);
//    return object;
//  }
//  
//  generateUIObject(objectName) {
//    let UIObject = null;
//    switch(objectName) {
//      case "headerObject":
//        UIObject = CardService.newCardHeader();
//        break;
//      
//      case "messageObject":
//        UIObject = CardService.newTextParagraph();
//        break;
//        
//      case "gmailDraftDropdown":
//        UIObject = CardService.newSelectionInput()
//          .setType(CardService.SelectionInputType.DROPDOWN)
//          .setTitle("Select Gmail Draft")
//          .setFieldName("draft_id");
//        break;
//        
//      case "numberInput":
//        UIObject = CardService.newTextInput()
//          .setFieldName("number_of_copies")  // Used by handleForm.gs for the number of times to duplicate the draft
//          .setTitle("Enter number of copies.");
//  
//        // Suggestions to help the user enter in valid input
//        const numNumbers = 10;
//        let suggestions = CardService.newSuggestions();
//        for (let num = 1; num <= numNumbers; num++) suggestions.addSuggestion(num.toString());
//        UIObject.setSuggestions(suggestions);
//        
//        break;
//        
//      case "submitButton":
//        UIObject = CardService.newTextButton()
//          .setText("Duplicate")
//          .setOnClickAction(CardService.newAction()
//                          .setFunctionName("handleForm"))
//        
//        break;
//        
//      case "backButton":
//        UIObject = CardService.newTextButton()
//          .setText("Go back")
//          .setOnClickAction(CardService.newAction()
//                            .setFunctionName("HomeCard")
//                            .setParameters({ err: "" }));
//        
//        break;
//        
//      default:
//        return null;
//    }
//    
//    return UIObject;
//  }  
//}
//
// let appCache = new AppCache();  

const drafts = GmailApp.getDrafts();

// Starting point of this add-on
// Invoked on homepage and contextual and trigger
function buildAddOn() {
  return StartCard();
}
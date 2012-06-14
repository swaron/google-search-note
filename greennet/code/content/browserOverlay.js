/**
 * GreenNetHelper namespace.
 */
if ("undefined" == typeof(GreenNetHelper)) {
  var GreenNetHelper = {};
};

/**
 * Controls the browser overlay for the Hello World extension.
 */
GreenNetHelper.BrowserOverlay = {
  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("greennethelper-string-bundle");
    let message = stringBundle.getString("greennethelper.greeting.label");

    window.alert(message);
  }
};

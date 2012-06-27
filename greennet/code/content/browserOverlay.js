/**
 * GreenNetHelper namespace.
 */
if ("undefined" == typeof(GreenNetHelper)) {
  var GreenNetHelper = {};
};
if ("undefined" == typeof(XULSchoolChrome)) {
	var XULSchoolChrome = {};
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

XULSchoolChrome.GreetingDialog = {
		greetingShort : function(e){
			window.alert("greeting from short");
		},
		greetingMedium:function(){
			alert("greeting from medium");
		},
		greetingLong:function(){
			window.alert("greeting from long");
		},
		greetingCustom:function(){
			window.alert("greeting from custom");
		}
}

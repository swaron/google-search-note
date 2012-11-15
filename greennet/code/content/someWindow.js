
if ("undefined" == typeof(Cc)) {
	var Cc = Components.classes;
	var Ci = Components.interfaces;
}else{
}

Components.utils.import("resource://greennethelper/Global.js");

XULSchoolChrome.GreetingDialog = {
		greetingShort : function(e){
			window.alert("greeting from short");
		},
		greetingMedium:function(){
			var user1 = new GreenNet_Global.User('name1','url1');
			var user2 = new GreenNet_Global.User('name2','url2');
			alert("greeting from medium,user name: " + user1.getName());
		},
		greetingLong:function(){
			window.alert("greeting from long");
		},
		greetingCustom:function(){
			window.alert("greeting from custom");
		}
}

//Application.getExtensions(function (extensions) {  
//    let extension = extensions.get(YOUR_EXTENSION_ID);  
//    if (extension.firstRun) {  
//      window.alert("this is the first run."); 
//    }  
//})

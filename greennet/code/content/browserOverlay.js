/**
 * GreenNetHelper namespace.
 */
if ("undefined" == typeof(GreenNetHelper)) {
	var GreenNetHelper = {};
};

Components.utils.import("resource://greennethelper/Global.js");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");
/**
 * Controls the browser overlay for the Hello World extension.
 */
GreenNetHelper.BrowserOverlay = {
	init : function() {
		var observerService = Components.classes["@mozilla.org/observer-service;1"]
				.getService(Components.interfaces.nsIObserverService);
	},
	/**
	 * Says 'Hello' to the user.
	 */
	sayHello : function(aEvent) {
		var stringBundle = document.getElementById("greennethelper-string-bundle");
		var message = stringBundle.getString("greennethelper.greeting.label");
		window.openDialog('chrome://greennethelper/content/options.xul', "Preference of Green Net Helper",
				'chrome,titlebar,toolbar,centerscreen,dialog=yes')
		// window.open('chrome://greennethelper/content/someWindow.xul','some-window','chrome,centerscreen');
	},
	echo : function(aevent) {
		var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
		prompts.alert(window, "Alert Title", "Popup Count: " + GreenNet_Global.openCount);
		GreenNet_Global.openCount++;
	}
};

GreenNetHelper.HttpReqObserver = function () {
	this.register();
};
(function(){
	 var getWindowForRequest = function(request) {
		if (request instanceof Components.interfaces.nsIRequest) {
			try {
				if (request.notificationCallbacks) {
					return request.notificationCallbacks.getInterface(Components.interfaces.nsILoadContext).associatedWindow;
				}
			} catch (e) {
			}
			try {
				if (request.loadGroup && request.loadGroup.notificationCallbacks) {
					return request.loadGroup.notificationCallbacks.getInterface(Components.interfaces.nsILoadContext).associatedWindow;
				}
			} catch (e) {
			}
		}
		return null;
	};
	var getQueryVariable = function (query,variable) {
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == variable) {
				return decodeURIComponent(pair[1]);
			}
		}
		return null;
	};
GreenNetHelper.HttpReqObserver.prototype = {
		observe : function(aSubject, aTopic, aData) {
			if ("http-on-modify-request" == aTopic) {
				var httpChannel = aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
				if(httpChannel == null){
					return;
				}
				var uri = httpChannel.URI;
				var host = uri.host;
				if(host.indexOf('google.com') == -1){
					//not google site, ignore 
					return;
				}
//				var win = getWindowForRequest(aSubject);
				var path = uri.path;
				if(path.indexOf('/search?') == 0){
					//this is a search action, change http to https. todo:filter keywords?
					if(uri.schemeIs('http')){
						uri.scheme = 'https';
					}
				}else if(path.indexOf('/url?') == 0){
					var query = path.substr(5);
					var url= getQueryVariable(query,'url');
					if(url !=null && url.length > 3){
						var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
						var newUri = ioService.newURI(url, "utf-8", null);
						if(newUri.schemeIs(uri.scheme)){
							uri.spec = url;
						}else{
							uri.spec = url;
							uri.scheme = newUri.scheme;
						}
					}
				}
			}
		},
		register : function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"]
					.getService(Components.interfaces.nsIObserverService);
			observerService.addObserver(this, "http-on-modify-request", false);
		},
		unregister : function() {
			var observerService = Components.classes["@mozilla.org/observer-service;1"]
					.getService(Components.interfaces.nsIObserverService);
			observerService.removeObserver(this, "http-on-modify-request");
		}
};

})();

if(GreenNet_Global.httpReqObserver == null){
	GreenNet_Global.httpReqObserver = new GreenNetHelper.HttpReqObserver();
}

window.addEventListener("load", function() {
	
}, false);
window.addEventListener("unload", function() {
}, false);

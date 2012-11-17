Components.utils.import("resource://greennethelper/Global.js");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");

(function() {

	function resolveUri(uri){
		var host = uri.host;
		if (host.indexOf('google.com') == -1) {
			// not google site, ignore
			return uri;
		}
		var path = uri.path;
		if (path.length < 2 || path.indexOf('/?') == 0) {
			//home page, not redirect to https now
//			if (uri.schemeIs('http')) {
//				uri.scheme = 'https';
//			}
		} else if (path.indexOf('/search?') == 0) {
			// this is a search action, change http to https. todo:filter keywords?
			if (uri.schemeIs('http')) {
				var newUri = uri.clone();
				newUri.scheme = 'https';
				return newUri;
			}
		} else if (path.indexOf('/url?') == 0) {
			if (uri.schemeIs('http')) {
				var newUri = uri.clone();
				newUri.scheme = 'https';
				return newUri;
			}
//			var query = path.substr(5);
//			var url = getQueryVariable(query, 'url');
//			if (url != null && url.length > 3) {
//				var ioService = Components.classes["@mozilla.org/network/io-service;1"]
//						.getService(Components.interfaces.nsIIOService);
//				var newUri = ioService.newURI(url, "utf-8", null);
//				return newUri;
//			}
		}
		return uri;
	}
	var Gnh = GreenNetHelper;
	var TabListener = function(){
	};
	const nsIWebProgressListener = Components.interfaces.nsIWebProgressListener;
	TabListener.prototype = {
		onLocationChange : function(aBrowser /* nsIDOMXULElement */, aWebProgress /* nsIWebProgress */,
				aRequest /* nsIRequest */, aLocation /* nsIURI */
		) {
//			alert('on location change.' +aLocation.spec);
		},
		onProgressChange:function(aBrowser /* nsIDOMXULElement */, aWebProgress /* nsIWebProgress */,
				aRequest /* nsIRequest */){
//			alert('on Progress Change. ' +aRequest.name);
		},
		onSecurityChange:function(aBrowser /* nsIDOMXULElement */, aWebProgress /* nsIWebProgress */,
				aRequest /* nsIRequest */){
			//alert('on Security Change.');
		},
		onStateChange:function(aBrowser /* nsIDOMXULElement */, aWebProgress /* nsIWebProgress */,
				aRequest /* nsIRequest */,aStateFlags){
			if (aStateFlags & nsIWebProgressListener.STATE_IS_DOCUMENT
	                    && aStateFlags & nsIWebProgressListener.STATE_START) {
	            var httpChannel = aRequest.QueryInterface(Components.interfaces.nsIHttpChannel);
	            if(httpChannel == null){
	            	return;
	            }
	            var uri = httpChannel.URI;      	
	            try {
	            	alert("testing " + uri.spec);
	                var resultUri = resolveUri(uri);
	                if (resultUri != uri && resultUri.spec != uri.spec) {
	                    if(resultUri == resolveUri(resultUri)){
		                    aRequest.cancel(Components.results.NS_BINDING_REDIRECTED);
	                    	//make sure the resolved uri will not be resolved to another.
	                    	//if this case happend, loop will occur.
		                    aWebProgress.DOMWindow.location.href = resultUri.spec;
	                    }else{
	                    	alert("there is a bug in resolve uri function.")
	                    }
	                }
	            }
	            catch(ex) {
	            	alert("error on redirect:" +aRequest.name + '\n'+ ex);
	            }
	        }
		},
		onStatusChange:function(aBrowser /* nsIDOMXULElement */, aWebProgress /* nsIWebProgress */,
				aRequest /* nsIRequest */,aStatus,aMessage){
//			alert('on status Change. message: ' + aMessage);
		},
		onRefreshAttempted:function(aBrowser /* nsIDOMXULElement */, aWebProgress /* nsIWebProgress */,
				aRefreshURI /* nsIURI */){
//			alert('on Refresh Change. to new uri: ' + aRefreshURI);
		},
		QueryInterface: function (aIID) {
	        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
	                aIID.equals(Components.interfaces.nsIWebProgressListener2) ||
	                aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
	                aIID.equals(Components.interfaces.nsISupports)) {
	            return this;
	        }
	        else {
	            return null;
	        }
    	}
	};
	
	GreenNetHelper.TabProgressListener = TabListener;

	GreenNetHelper.HttpReqObserver = function() {
		this.register();
	};
	
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
	var getQueryVariable = function(query, variable) {
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
				if (httpChannel == null) {
					return;
				}
				var uri = httpChannel.URI;
				var host = uri.host;
				if (host.indexOf('google.com') == -1) {
					// not google site, ignore
					return;
				}
				var win = getWindowForRequest(aSubject);
				var path = uri.path;
				if (path.length < 2 || path.indexOf('/?') == 0) {
					//home page
//					if (uri.schemeIs('http')) {
//						uri.scheme = 'https';
//					}
				} else if (path.indexOf('/search?') == 0) {
					// this is a search action, change http to https. todo:filter keywords?
					if (uri.schemeIs('http')) {
						var newUri = uri.clone();
						newUri.scheme = 'https';
					}
				} else if (path.indexOf('/url?') == 0) {
					if (uri.schemeIs('http')) {
						var newUri = uri.clone();
						newUri.scheme = 'https';
					}
//					var query = path.substr(5);
//					var url = getQueryVariable(query, 'url');
//					if (url != null && url.length > 3) {
//						var ioService = Components.classes["@mozilla.org/network/io-service;1"]
//								.getService(Components.interfaces.nsIIOService);
//						var newUri = ioService.newURI(url, "utf-8", null);
//						if (newUri.schemeIs(uri.scheme)) {
//							uri.spec = url;
//						} else {
//							uri.spec = url;
//							uri.scheme = newUri.scheme;
//						}
//					}
				}else{
					return;
				}
				//var result = replaceChannel(httpChannel, uri);
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

if (GreenNet_Global.httpReqObserver == null) {
//	GreenNet_Global.httpReqObserver = new GreenNetHelper.HttpReqObserver();
}

var listener = new GreenNetHelper.TabProgressListener();
window.addEventListener("load", function() {
	gBrowser.addTabsProgressListener(listener);
}, false);
window.addEventListener("unload", function() {
	gBrowser.removeTabsProgressListener(listener);
}, false);

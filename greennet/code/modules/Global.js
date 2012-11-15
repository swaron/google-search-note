var EXPORTED_SYMBOLS = ["GreenNet_Global"];

// const { classes: Cc, interfaces: Ci } = Components;

/**
 * 〈ModuleNamespace〉 namespace.
 */
var GreenNet_Global = {
	httpReqObserver:null,
	openCount : 0
};

(function() {
	var User = function(name, url) {
		this.name = name;
		this.url = url;
	}
	User.prototype = {
		name : null,
		url : null,
		getName : function() {
			return this.name;
		},
		getUrl : function() {
			return this.url;
		}
	}
	GreenNet_Global.User = User;
})();
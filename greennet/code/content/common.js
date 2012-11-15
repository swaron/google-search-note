Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");

if ("undefined" == typeof(GreenNetHelper)) {
  var GreenNetHelper = {};
};
if ("undefined" == typeof(Cc)) {
	var Cc = Components.classes;
	var Ci = Components.interfaces;
}

function xpcom_generateQI(iids) {
  iids.push(CI.nsISupports);
  return function QueryInterface(iid) {
	for (let i = 0, len = iids.length; i < len; i++)
	  if (iids[i].equals(iid)) return this;
	throw Components.results.NS_ERROR_NO_INTERFACE;
  }
}
GreenNetHelper.apply = function(obj, extObj) {
    if (arguments.length > 2) {
        for (var a = 1; a < arguments.length; a++) {
        	GreenNetHelper.apply(obj, arguments[a]);
        }
    } else {
    	if(extObj != null){
    		for (var i in extObj) {
    			obj[i] = extObj[i];
    		}
    	}
    }
    return obj;
};

GreenNetHelper.apply(GreenNetHelper, {
	getLocalDirectory : function() {
		var localDir = FileUtils.getDir("ProfD", ["GreenNetHelper"], true);
		if(!localDir.exists() || !localDir.isDirectory()){
			Components.utils.reportError("common.js:error unreadable directory  " +localDir.path);
		}
		return localDir;
	},
	loadJsonFile : function(filename,callback){
		if(typeof(callback) != 'function' ){
			return;
		}
		var localDir = GreenNetHelper.getLocalDirectory(); 
		var file = FileUtils.getFile("ProfD", ["GreenNetHelper",filename]);
		if(!file.exists()){
			file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);
			return;
		}
		var channel = NetUtil.newChannel(file);
		channel.contentType = "application/json";
		var config = {
			lastUpdate: null,
			version : null,
			sites : [],
			keywords : []
		};
		NetUtil.asyncFetch(channel, function(inputStream, status) {
			if (!Components.isSuccessCode(status)) {
				// Handle error!
				return;
			}
			// The file data is contained within inputStream.
			// You can read it into a string with
			var data = NetUtil.readInputStreamToString(inputStream,inputStream.available(),{
				charset:'utf-8'
			});
			try{
				var content = JSON.parse(data);
				//GreenNetHelper.apply(config,content);
				callback(content);
			}catch(e){
				Components.utils.reportError("common.js:error on read json data.");
			}
		});
	},
	saveJsonFile : function(filename,content){
		var file = FileUtils.getFile("ProfD", ["GreenNetHelper",filename]);
		if(!file.exists()){
			file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);
		}
		content.lastUpdate = Date.now();
		var data = JSON.stringify(content);
	  	var ostream = FileUtils.openSafeFileOutputStream(file);
	  	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	  	converter.charset = 'utf-8';
	  	var istream = converter.convertToInputStream(data);
	  	NetUtil.asyncCopy(istream,ostream,function(status){
	  		if (!Components.isSuccessCode(status)) {
	  			alert("falied to save json file.");
		    	// Handle error!
		    	return;
			}
	  	});
	}
});
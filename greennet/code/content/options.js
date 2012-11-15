Components.utils.import("resource://greennethelper/Global.js");
Components.utils.import("resource://gre/modules/FileUtils.jsm");
Components.utils.import("resource://gre/modules/NetUtil.jsm");

/**
 * GreenNetHelper namespace.
 */
if ("undefined" == typeof(GreenNetHelper)) {
  var GreenNetHelper = {};
};

if ("undefined" == typeof(Cc)) {
	var Cc = Components.classes;
	var Ci = Components.interfaces;
}else{
}

window.addEventListener("load",function(){
	var viewSite = document.getElementById('viewSiteBtn');
	if(viewSite){
		viewSite.addEventListener('command',function(){
			GreenNetHelper.loadJsonFile("blacklist.json",function(content){
				var title = "网站列表";
				window.openDialog('chrome://greennethelper/content/contentList.xul',"view-list-window",'chrome,centerscreen,dialog=no',title,content.sites);
			});
		});
	}else{
		alert("view site button not present yet.");
	}
	var viewKeyword = document.getElementById('viewKeywordBtn');
	if(viewKeyword){
		viewKeyword.addEventListener('command',function(){
			GreenNetHelper.loadJsonFile("blacklist.json",function(content){
				var title = "关键字列表";
				window.openDialog('chrome://greennethelper/content/contentList.xul',"view-list-window",'chrome,titlebar,toolbar,centerscreen,dialog=yes',title,content.keywords,", ");
			});
		});
	}else{
		alert("view keyword button not present yet.");
	}
	var manageCustom = document.getElementById('manageCustomBtn');
	if(manageCustom){
		manageCustom.addEventListener('command',function(){
			window.openDialog('chrome://greennethelper/content/manageCustomKeywords.xul',"view-list-window",'chrome,titlebar,toolbar,centerscreen,dialog=no');
		});
	}else{
		alert("manage custom button not present yet.");
	}
	
	
	GreenNetHelper.loadJsonFile("blacklist.json",function(content){
		var titleDom = document.getElementById("keyword-panel-title");
		titleDom.label = "关键字库，版本:"+ (content.version||"unknown");
	});
},false);

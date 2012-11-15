var CustomDialog ={
	onDialogAccept:function(){
		var dom = document.getElementById('content');
		if(dom.originalValue == dom.value){
			return true;
		}
		var content = dom.value;
		var tmp = content.split(",");
		var list = [];
		for ( var i = 0; i < tmp.length; i++) {
			var key = tmp[i].trim();
			if(key.length != 0){
				list.push(key);
			}
		}
		var result = {
			lastUpdate:Date.now(),
			keywords:list
		};
		GreenNetHelper.saveJsonFile('custom.json',result);
		return true;
	}
}

window.addEventListener("load", function() {
	GreenNetHelper.loadJsonFile("custom.json",function(content){
//		Components.utils.reportError("init() called");
		var contentDom = document.getElementById('content');
		contentDom.value = content.keywords.join(", ");
		contentDom.originalValue = contentDom.value; 
	});
});

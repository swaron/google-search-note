window.addEventListener("load", function() {
	var title = window.arguments[0];
	var list = window.arguments[1];
	var sepChar = window.arguments[2];
	if(typeof(sepChar) == "undefined"){
		sepChar = "\n";
	}
	var titleDom = document.getElementById('title');
	titleDom.textContent = title;
	var contentDom = document.getElementById('content');
	contentDom.value = list.join(sepChar)
});

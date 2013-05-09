
(function(doc){
	
	window.Modernizr = {};
	
	var docElement = doc.documentElement;
	
	if(isReadySVG()) {
			
		docElement.className += ' svg'; 
		window.Modernizr.svg = true;
		
	} else {
		
		docElement.className += ' no-svg';
		window.Modernizr.svg = false;
		
	}
	
	function isReadySVG() {
		return !!document.createElementNS && !!document.createElementNS( "http://www.w3.org/2000/svg", "svg").createSVGRect;
	}
	
})(this.document);


if (!Modernizr.svg || isOldFirefox()){
	
	window.onload = function(){
		var getFirefoxUrl = document.getElementById("getfirefoxpage").href;
		//alert(getFirefoxUrl);
	
		if(getFirefoxUrl != location.href) {
			location.href = getFirefoxUrl;
		}
	}
	
}

function isOldFirefox() {
	
	//ブラウザ種類とバージョン取得
	var isFirefox = (navigator.userAgent.indexOf("Firefox") > 0)? navigator.userAgent.indexOf("Firefox")+8 : (navigator.userAgent.indexOf("Minefield/") > 0)? navigator.userAgent.indexOf("Minefield")+10 : false;
	var browserVar = navigator.userAgent.substr(isFirefox, 3);
		
	//Firefox 3.6以下だったらtrue
	if(isFirefox) {
	
		if(browserVar < 3.6) {
			
			var html = document.getElementsByTagName("html")[0];
			html.className = html.className+" update-firefox";
						
			return true;
			
		} else {
			return false;
		}
		
	}
	
	return false;
	
}

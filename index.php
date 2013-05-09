<?php

	//デフォルトは英語
	$lang = "en";

	//言語取得
	$UserLanguage = split(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
	$UserFirstLanguage = $UserLanguage[0];
	
	//言語振り分け
	if(isset($UserFirstLanguage)) {
		if(ereg('ja', $UserFirstLanguage)) {
			$lang = "ja"; //日本語
		}
	}
	
	//Firefoxかどうか判別
	$l_browser = $_SERVER["HTTP_USER_AGENT"];
	// 小文字に変更
	$l_browser = strtolower($l_browser);
	
	//browser判定(ieの場合)
/*	if(strpos($l_browser,"msie") == false ){
		$page = "index.html";
	} else {
		$page = "getfirefox.html";	
	}
*/

	$page = "index.html";
	
	//URL振り分け
	header("location: http://".$_SERVER["SERVER_NAME"]."/".$lang."/".$page);

?>

<?php

	require_once('../../config.php');
	
	if(!isset($_POST["svg"])) {
	 
		return;
	 
	}
	
	//svgファイル
	$svg = $_POST['svg'];

	if (get_magic_quotes_gpc()) {
		$svg = stripslashes($svg);
	}
	
	//libxmlエラーを無効に
	libxml_use_internal_errors(true);
	
	$result = 1;
	$png_enc = "";
	$md5 = "";
	$elapsed = 0;
	$convert = "";
	$start = getmicrotime();
	
	//xml文書であればコンバート処理を行う
	if(simplexml_load_string($svg)) {
	
		$dir = realpath("../../tmp/");
		$persona_dir = realpath("../../personas/");
		$_log = realpath("./log/err.log"); 
		
		$_dpi = 72;
		
		$_width = intval($_POST["width"]);
		$_height = intval($_POST["height"]);
		
		$md5 = md5($_POST["svg"].$_width.$_height);
		$tmpSVG = "${dir}/${md5}.svg";
		$tmpPNG = "${dir}/${md5}.png";
		$tmpLog = "${dir}/${md5}.log";
		
		
		if($_POST['type'] == "mobile") {
			//携帯の場合
			$tmpJPEG = "${dir}/${md5}.jpg";
			
		} else if ($_POST['type'] == "personas") {
			//ペルソナの場合
			
						
			//頭二文字をディレクトリ名に
			$persona_split_dir = substr($md5,0,2);
			$parsona_split_file = substr($md5,2,strlen($md5));
			$persona_split_path = $persona_split_dir."/".$parsona_split_file;
			$persona_split_real_path = $persona_dir."/".$persona_split_path;
			
			//ディレクトリ作成
			$persona_subdir = $persona_dir."/".$persona_split_dir;
			if(! file_exists($persona_subdir)) {
				mkdir($persona_subdir, 0775, true);
			}
			
			//各種ファイルパスを設定
			$tmpSVGPersonas = "${dir}/${md5}_personas.svg";
			$tmpPNGPersonas = "${dir}/${md5}_personas.png";
			$personasHeader = "${persona_split_real_path}_header.png";
			$personasFooter = "${persona_split_real_path}_footer.png";
			$personasPreview = "${persona_split_real_path}_preview.png";
			$personasIcon = "${persona_split_real_path}_icon.png";
		
		}
		
		if(file_exists($tmpPNG) && false) {
			$result = 0;
		} else {

			$fp = fopen($tmpSVG,"w");
			fputs($fp,$svg);
			fclose($fp);
			
			//ペルソナ用svgファイル書き出し
			if($_POST['type'] == "personas") {
				
				$personasSVG = $_POST['personasSVG'];
	
				if (get_magic_quotes_gpc()) {
					$personasSVG = stripslashes($personasSVG);
				}
	
				$fp = fopen($tmpSVGPersonas,"w");
				fputs($fp,$personasSVG);
				fclose($fp);
				
			}
					
			//コンバート処理
			if($_width > $_height) {
				$_width_height = "'-w ${_width}'";
			} else {
				$_width_height = "'-h ${_height}'";
			}
			
			$convert = INKSCAPE_PATH . " -z ${tmpSVG} ${_width_height} -e ${tmpPNG} 1>/dev/null";// 2> {$tmpLog}";
			

			if($_POST['type'] == "mobile") {
				//携帯の場合
				$convert .= " && /usr/local/bin/convert ${tmpPNG} ${tmpJPEG} 1>/dev/null";// 2>> {$tmpLog}";
				$convert .= " && rm ${tmpPNG}";
				
			} else if($_POST['type'] == "personas") {
				//ペルソナの場合				
				$convert .= " && " . INKSCAPE_PATH . " -z ${tmpSVGPersonas} -w 3000 -e ${tmpPNGPersonas} 1>/dev/null 2>> {$tmpLog}";
				$convert .= " && /usr/local/bin/convert -gravity NorthEast -crop 3000x200+0+0 ${tmpPNGPersonas} ${personasHeader} 1>/dev/null";//  2> {$tmpLog}";
				$convert .= " && /usr/local/bin/convert -gravity SouthWest -crop 3000x100+0+0 ${tmpPNGPersonas} ${personasFooter} 1>/dev/null";//  2> {$tmpLog}";
				//$convert .= "&& /usr/local/bin/convert -gravity NorthEast -crop 597x200+0+0 -geometry 200x67 ${tmpPNGPersonas} ${personasPreview} 1>/dev/null 2> {$tmpLog}";
				$convert .= " && /usr/local/bin/convert -geometry 400x400 ${tmpPNG} ${personasPreview} 1>/dev/null";//  2> {$tmpLog}";
				$convert .= " && /usr/local/bin/convert -gravity NorthEast -crop 200x200+0+0 -geometry 32x32 ${tmpPNGPersonas} ${personasIcon} 1>/dev/null";//  2> {$tmpLog}";
				
			}

			//$sh_dir=realpath("./");
			//$convert = "${sh_dir}/convert.sh ${dir} ${md5} ${_width_height}";
			system($convert, $result);			
			
			//エラーが発生していたらログを残す
			if($result != 0) {
				$_date = date(DATE_RFC822);
				system("echo '--' >> {$_log} && echo '{$_date}' >> {$_log} && echo '$convert' >> {$_log} && cat {$tmpLog} >> {$_log}");
			}
			
			//エラーログ削除
			if(file_exists($tmpLog)) {
				unlink($tmpLog);
			}
			
			//一時ファイル削除
			/*if(file_exists($tmpSVG)) {
				unlink($tmpSVG);
			}
			if(file_exists($tmpSVGPersonas)) {
				unlink($tmpSVGPersonas);
			}
			if(file_exists($tmpPNGPersonas)) {
				unlink($tmpPNGPersonas);
			}*/
				
		}
	}
	
	$elapsed = getmicrotime() - $start;
/*
<response>
	<result><![CDATA[<?php echo $result; ?>]]></result>
	<PNG><![CDATA[<?php echo $png_enc; ?>]]></png>
	<md5><![CDATA[<?php echo $md5; ?>]]></md5>
	<elapsed><![CDATA[<?php echo $elapsed; ?>]]></elapsed>
	<type><![CDATA[<?php echo $_POST["type"]; ?>]]></type>
</response>*/

	header("Content-Type: application/json");
?>
{
<?php if($_POST['type'] == "personas"): ?>
	"personasSplitPath" : "<?php echo $persona_split_path;?>",
<?php endif; ?>
	"result": "<?php echo $result; ?>",
	"md5": "<?php echo $md5; ?>",
	"elapsed": "<?php echo $elapsed; ?>",
	"type": "<?php echo $_POST['type'];?>"
}

<?php

	function getmicrotime() {
		list($usec, $sec) = explode(" ", microtime());
		return ((float)$sec + (float)$usec); 
	}

?>








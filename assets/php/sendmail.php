<?php

require_once("../../config.php");
require_once("./pear/PEAR/Mail.php");
require_once("./pear/PEAR/Mail/mime.php");

// spam check
$isSpam = false;
if (SPAM_CHECK) {
	require_once(SPAM_CHECK_PHP);
	$spamCheker = SPAM_CHECK_FUNCTION;
	$isSpam = $spamCheker($_SERVER["REMOTE_ADDR"]);
}

//言語設定
$internal = 'utf-8';
$input    = 'utf-8';
$targetEncode   = ($_POST['lang'] == 'ja')? 'iso-2022-jp' : 'utf-8';

mb_language($_POST['lang']);
mb_internal_encoding($internal);


$to = $_POST['mail'];
$fileName = getImageFilePath($_POST['filename']);
$langXML = getLangXML($_POST['lang'], $HTTP_SERVER_VARS['PHP_SELF']);
	
$isMailaddress = isMailaddress($_POST['mail']);

if($isSpam == false && $isMailaddress && $fileName && $langXML) {
	//メールタイトル
	$subject = $langXML->subject[0];
	$subject = mb_convert_encoding($subject,$input,mb_detect_encoding($subject));
	
	//メール本文
	$body = $langXML->body[0];;
	
	//メールオブジェクト作成
	$mailObject = Mail::factory("mail");
	
	$recipients = $to;
	$headers = array(
	  "To" => $recipients,
	  "From" => FROM_ADDRESS,
	  "Subject" => mb_encode_mimeheader($subject, $targetEncode, "B")
	);
	$body = mb_convert_encoding($body, $targetEncode, "UTF-8");
	
	
	//添付ファイルオブジェクト作成
	$mimeObject = new Mail_Mime("\n");
	$mimeObject -> setTxtBody($body);
	$mimeObject -> addAttachment($fileName, "image/jpeg");
	
	$bodyParam = array(
	  "head_charset" => $targetEncode,
	  "text_charset" => $targetEncode
	);
	
	$body = $mimeObject -> get($bodyParam);
	$headers = $mimeObject -> headers($headers);
	
	//送信
	$result = $mailObject -> send($recipients, $headers, $body);
	$text = ($result)? $langXML->success[0] : $langXML->error[0];
	
	
	
} else {
	
	$result = "0";
	$text = ($isSpam)? "too many access." : $langXML->mailerror[0];
	
}

?>
{
	"result": "<?php echo $result; ?>",
	"text": "<?php echo $text; ?>"
}
<?php


//正しいメールアドレスかチェック
function isMailaddress($mailaddress) {
    if (preg_match('/^([a-z0-9_]|\-|\.|\+)+@(([a-z0-9_]|\-)+\.)+[a-z]{2,6}$/i', $mailaddress)) {
        return true;
    } else {
	    return false;
    }
}

//jpgのファイルパスを取得
function getImageFilePath($fileName) {

	//画像ディレクトリのファイルパス
	$imgDir = "../../tmp/";
	
	//ファイル名のみ取得してファイルパスを生成
	$fileName = (basename($fileName) != "")? $imgDir.basename($fileName).".jpg" : "";

	return (is_file($fileName))? $fileName : false;

}

//言語用のxmlファイルを読み込み
function getLangXML($lang, $php_self) {
	
	$file = basename($lang);
	$dir = (ereg("/CMS/",$php_self))? "../../../" : "../../";
	$filePath = $dir.$file.".html";

	return (is_file($filePath))? simplexml_load_file($filePath) : false;
	
}

?>

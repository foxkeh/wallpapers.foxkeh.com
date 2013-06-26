「フォクすけの壁紙メーカー」について
=====================
「フォクすけの壁紙メーカー」は、「SVG」という Web 標準技術を使って、モダンブラウザ上で「フォクすけ」の壁紙を簡単に作れるツールです。
画像、背景などの素材を選んで、大きさやレイアウトをあなたの好みに合わせてカスタマイズできます！

<img src="http://wallpapers.foxkeh.com/assets/images/site/use_wallpaper4.png" alt="" />


機能一覧
-----
* パソコンのデスクトップ壁紙
  * カレンダーの表示／非表示の指定が可能。
  * カレンダーのタイプを、日本用（日曜始まり／祝日対応）とグローバル用 (月曜始まり）の２種類から選択可能。
* 携帯電話の待ち受け画面
* Firefox の Personas テーマ (ウィンドウデザイン) 


動作環境
------
* PHP 5.3.x 以上
* Inkscape 0.48 以上 （SVGファイルをPNGにコンバートするのに利用）


設置方法
------
1. 「フォクすけの壁紙メーカー」の <a href="https://github.com/foxkeh/wallpapers.foxkeh.com.git">Git リポジトリ</a>を取得。
2. リポジトリ直下にある `config.sample.php` ファイルを `config.php` にリネーム。
3. `config.php` ファイルを自分の環境用に編集。

```php
# config.php

// ROOTPATH
define('ROOTPATH', dirname(__FILE__) . '/'); # ここはそのままでOKです

// inkscape
define('INKSCAPE_PATH', '/usr/local/bin/inkscape');  # inkscape がインストールされているパスを指定

// FROM address
define('FROM_ADDRESS', 'MAILADDRESS'); # スマホ用壁紙をメールで送信する機能用で使用する From アドレスを指定

// SPAM check
define('SPAM_CHECK', false); # スパム防止機能を使用したい場合は true に（デフォルトは false）。
define('SPAM_CHECK_PHP', ROOTPATH . 'assets/php/foo.php'); # スパム判定用の関数が定義されているファイルのパスを指定
define('SPAM_CHECK_FUNCTION', 'isSpam'); # スパム判定用の関数名を記入

```

スパム防止機能について
------
連続送信等を防止する為にIPアドレスをベースとしたスパム防止機能をオプションで利用できます。

スパム防止機能が有効になっている場合、「フォクすけの壁紙メーカー」がメールを送信する毎に `config.php` で指定されたスパム判定関数にクライアントのIPアドレスが渡されます。
スパム判定関数が `true` を返した場合は、スパムとして判断しメールの送信がキャンセルされます。

_※スパム防止機能を利用する際は、スパム判定用関数を実装したPHPファイルを独自にご用意下さい。_


```php
# スパム判定関数の例

/**
 * IPアドレスを元にスパムを判定する
 * @param {string} $ipaddress クライアントのIPアドレス
 * @return {boolean} スパムの場合は true を返す
 */
function isSpam ($ipaddress) {
  // ローカルホスト以外からの送信はスパムとして扱う
  if ($ipaddress === '127.0.0.1') {
    return true;
  } else {
    return false;
  }
}
```

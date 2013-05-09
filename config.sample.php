<?php
// ROOTPATH
define('ROOTPATH', dirname(__FILE__) . '/');

// inkscape
define('INKSCAPE_PATH', '/usr/local/bin/inkscape');

// FROM address
define('FROM_ADDRESS', 'MAILADDRESS');

// SPAM check
define('SPAM_CHECK', false);
define('SPAM_CHECK_PHP', ROOTPATH . 'assets/php/antispam/antispam.php');
define('SPAM_CHECK_FUNCTION', 'isSpam');


<?php

// script to convert multi-line srt caption files to new-format (02-05-08) tt XML caption files
$use_cdata_tags = true;
$debug_output = true;

// the directory to write the new files in
// it must exist, be writeable, and be outside of the directory that is being scanned
$new_directory = '../temp/';

/////////////////////////////////// no user configuration below this \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// get filename or scan directory if it's a directory
//$filename = (isset($_GET["filename"])) ? strval($_GET["filename"]) : "./";
$dir = (ereg("/CMS/",$HTTP_SERVER_VARS['PHP_SELF']))? "../../../srt/" : "../../srt/";
$file = (isset($_GET["filename"])) ? strval($_GET["filename"]) : "en-us.srt";
$file = $dir.$file;

// read each file into an array
//$it = new RecursiveDirectoryIterator("$filename");

//foreach(new RecursiveIteratorIterator($it) as $file)
//{

// debug('Filename', $file); exit;
// debug('Ext', substr(strtolower($file), (strlen($file) - 4), 4));// exit;

// debug - only use test file
// if($file == '.\multi-line_test_file.srt')

  // check for .srt extension
  if(substr(strtolower($file), (strlen($file) - 4), 4) == '.srt')
  {
    $ttxml     = '';
    $full_line = '';

    if($file_array = file($file))
    {
      // write tt , head, and div elements for the new file
     $ttxml .= "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
      $ttxml .= "<tt xml:lang='en' xmlns='http://www.w3.org/2006/10/ttaf1' xmlns:tts='http://www.w3.org/2006/10/ttaf1#style'>\n";
      $ttxml .= "  <head>\n";
      $ttxml .= "  </head>\n";
      $ttxml .= "  <body>\n";
      $ttxml .= "    <div xml:id=\"captions\">\n";

      foreach($file_array as $line)
      {
        $line = rtrim($line);

// debug('Line', $line);

        // get begin and end
        //                00  :  00  :  32  ,   000   -->   00  :  00  :  37  ,   000
        if(preg_match('/(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)/', $line, $match))
        {
          $begin = $match[1] . ":" . $match[2] . ":" . $match[3] . "." . $match[4];
          $end   = $match[5] . ":" . $match[6] . ":" . $match[7] . "." . $match[8];
          $full_line = '';
        }
        // if the next line is not blank, get the text
        elseif($line != '')
        {
          if($full_line != '')
          {
            $full_line .= '<br />' . $line;
          }
          else
          {
            $full_line .= $line;
          }
        }

        // if the next line is blank, write the paragraph
        if($line == '')
        {
          // write new paragraph
          //                 <p begin="00:08:01.50" end="00:08:07.50">Nothing is going on.</p>
          if($use_cdata_tags)
          {
            $ttxml .= "      <p begin=\"" . $begin . "\" end=\"" . $end . "\"><![CDATA[" . $full_line . "]]></p>\n";
          }
          else
          {
            $ttxml .= "      <p begin=\"" . $begin . "\" end=\"" . $end . "\">" . $full_line . "</p>\n";
          }

// debug('Text', $line);
// debug('ttxml', $ttxml); exit;

          $full_line = '';
        }
      }

// write ending tags
$ttxml .= " </div>\n";
$ttxml .= " </body>\n";
$ttxml .= "</tt>\n";

      // write new file
      /*$new_file = $new_directory . substr($file, 0, (strlen($file) - 4)) . '.xml';
      $fh = fopen($new_file, 'w') or die('Can\'t open: ' . $new_file);
      fwrite($fh, $ttxml) or die('Can\'t write to: ' . $new_file);
      fclose($fh);*/
      
      echo $ttxml;
      
    }
  }
//}


function debug($title, $value)
{
  global $debug_output;

  if ($debug_output)
  {
    print "<pre>";
    if (is_array($value))
    {
      print $title . ":\n";
      print_r($value);
    }
    else
    {
      print $title . ": " . $value;
    }
    print "</pre>\n";
  }
}

?>
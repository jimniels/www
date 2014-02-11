<?php
function getScriptogramJSON() {
    $username = 'jimniels';
    $url = 'http://scriptogr.am/'. $username .'/feed/';
    $fileContents = file_get_contents($url);

    $fileContents = str_replace(array("\n", "\r", "\t"), '', $fileContents);
    $fileContents = trim(str_replace('"', "'", $fileContents));


    $simpleXml = simplexml_load_string($fileContents);

    $json = json_encode($simpleXml);
    return $json;
}

function getDribbbleJSON() {
    $username = 'jimniels';
    $url = 'http://dribbble.com/'.$username.'/shots.json';
    $json = file_get_contents($url);
    return $json;
}

// verify the data
$sriptogram = json_decode(getScriptogramJSON(), true);
$dribbble = json_decode(getDribbbleJSON(), true);

// Verify and write Scriptogram
if ( $sriptogram['channel']['item'][0]['title'] != '' || $sriptogram['channel']['item'][0]['title'] != null) {
    
    $file = dirname(__FILE__) . '/json/scriptogram.json';

    if ( file_exists($file) ) {
        $f = file_put_contents($file, json_encode($sriptogram) );
        if($f) {
            echo '<p style="color: green;">Scriptogram written to cache!</p>';
            echo json_encode($sriptogram);
        }
    } else {
        echo '<p style="color:red">Could not get/write scriptogram cache file.</p>';
    }
} else {
    echo '<p style="color:red">Scriptogram data could not be verified.</p>';   
}

// Verify and write Dribbble
if ( $dribbble['shots'][0]['title'] != '' || $dribbble['shots'][0]['title'] != null) {
    $file = dirname(__FILE__) . '/json/dribbble.json';

    if ( file_exists($file) ) {
        $f = file_put_contents($file, json_encode($dribbble) );
        if($f) {
            echo '<p style="color: green;">Dribbble written to cache!</p>';
            echo json_encode($dribbble);
        }
    } else {
        echo '<p style="color:red">Could not get/write dribbble cache file.</p>';
    }
} else {
    echo '<p style="color:red">Scriptogram data could not be verified.</p>';   
}
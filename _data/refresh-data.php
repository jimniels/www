<?php

function getDribbbleJSON() {
    $username = 'jimniels';
    $url = 'http://dribbble.com/'.$username.'/shots.json';
    $json = file_get_contents($url);
    return $json;
}

$dribbble = json_decode(getDribbbleJSON(), true);

// Verify and write Dribbble
if ( $dribbble['shots'][0]['title'] != '' || $dribbble['shots'][0]['title'] != null) {
    echo "Verifying Dribbble ... \n";

    $file = 'dribbble.yml';

    if ( file_exists($file) ) {
        $f = file_put_contents($file, stripslashes_deep( json_encode($dribbble) ) );
        if($f) {
            echo "SUCCESS! New dribbble data written to cache!";
            //echo json_encode($dribbble);
        } else {
            echo "WARNING: Failed writing dribbble cache file.";
        }
    } else {
        echo 'WARNING: Could not write to dribbble cache file. File does not exist?';
    }
} else {
    echo 'WARNING: Dribbble data could not be verified. Something wrong with Dribbble API?';   
}

echo "\n";


// Remove escaped slashes that PHP does using json_encode
function stripslashes_deep($value) {
    $value = is_array($value) ?
                array_map('stripslashes_deep', $value) :
                stripslashes($value);
    return $value;
}
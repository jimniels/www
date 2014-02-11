<?php

/**
 * Get new Tweets with IDs from local files and write them to the cache files
 */
//header('Content-type: application/json');


function getTwitterJSON($id) {
    $url = 'https://api.twitter.com/1/statuses/oembed.json?id='.$id;
    $json = file_get_contents($url);
    return $json;
}

$fileIDs = array(
    'published-articles', 
    'recent-projects'
);

foreach ($fileIDs as $fileID) {
    
    // Read in the file
    $file = dirname(__FILE__) . '/json/' . $fileID . '.json';
    $data = json_decode(file_get_contents($file), true);

    // FOreach method
    $newStuff = false;
    $newStuffCount = 0;
    foreach ($data[$fileID] as $itemIndex => $item) {

        foreach ($item['tweets'] as $tweetIndex => $tweet) {
            
            // Make sure the tweet has an ID
            if($tweet['id']){

                // If it doesn't have a URL, we need to get its data from Twitter
                if(!$tweet['url']) {
                    
                    // There's new stuff
                    $newStuff = true;
                    $newStuffCount++;

                    // Get the tweet for the API
                    $response = json_decode( getTwitterJSON($tweet['id']), true );
                    
                    // Append response data to current tweet data
                    // verify the response and merge it
                    if($response['url']) {
                        $data[$fileID][$itemIndex]['tweets'][$tweetIndex] = array_merge($response, $data[$fileID][$itemIndex]['tweets'][$tweetIndex]); 
                        //echo 'Added info for tweet with ID:'.$tweet['id'].'<br>';
                    } else {
                        //echo 'Could not verify response for tweet with ID: '.$tweet['id'].'<br>';
                    }

                    
                }
            }
        }
    }

    // If there was new stuff, write it to the file
    if($newStuff) {
        echo 'New tweet(s) count for '.$fileID.' : '. $newStuffCount;

        if ( file_exists($file) ) {
            $f = file_put_contents($file, format(json_encode($data)) );
            if($f) {
                echo '<p style="color: green;">'.$file.' written to cache!</p>';
            } else {
                echo '<p style="color: red;">'.$file.' could not be written to cache!</p>';
            }
        } else {
            echo '<p style="color: red;">File does not exist: '.$file.'</p>';
        }
    } else {
        echo 'There were no new tweets to add.';
    }
}



// Example twitter response
// {
//     "cache_age": "3153600000",
//     "url": "https://twitter.com/csswizardry/statuses/354547144172126209",
//     "height": null,
//     "provider_url": "https://twitter.com",
//     "provider_name": "Twitter",
//     "author_name": "Harry Roberts",
//     "version": "1.0",
//     "author_url": "https://twitter.com/csswizardry",
//     "type": "rich",
//     "html": "<blockquote class=\"twitter-tweet\"><p><a href=\"https://twitter.com/robinrendle\">@robinrendle</a> This is a pretty decent article <a href=\"http://t.co/0V5aYLkMDO\">http://t.co/0V5aYLkMDO</a> :)</p>&mdash; Harry Roberts (@csswizardry) <a href=\"https://twitter.com/csswizardry/statuses/354547144172126209\">July 9, 2013</a></blockquote>\n<script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>",
//     "width": 550
// }


// Pretty print some JSON
function format($json, $validate_first=false) {
    $tab = "    ";
    $new_json = "";
    $indent_level = 0;
    $in_string = false;
    $in_slash = false;

    if($validate_first)
    {
            $json_obj = json_decode($json);

            if($json_obj === false)
                    return false;

            $json = json_encode($json_obj);
    }

    $len = strlen($json);

    for($c = 0; $c < $len; $c++)
    {
            $char = $json[$c];
            switch($char)
            {
                    case '{':
                    case '[':
                            if(!$in_string)
                            {
                                    $new_json .= $char . "\n" . str_repeat($tab, $indent_level+1);
                                    $indent_level++;
                            }
                            else
                            {
                                    $new_json .= $char;
                            }
                            break;
                    case '}':
                    case ']':
                            if(!$in_string)
                            {
                                    $indent_level--;
                                    $new_json .= "\n" . str_repeat($tab, $indent_level) . $char;
                            }
                            else
                            {
                                    $new_json .= $char;
                            }
                            break;
                    case ',':
                            if(!$in_string)
                            {
                                    $new_json .= ",\n" . str_repeat($tab, $indent_level);
                            }
                            else
                            {
                                    $new_json .= $char;
                            }
                            break;
                    case ':':
                            if(!$in_string)
                            {
                                    $new_json .= ": ";
                            }
                            else
                            {
                                    $new_json .= $char;
                            }
                            break;
                    case ' ':
                            if($in_string || (strlen($new_json) > 0 && $new_json[strlen($new_json)-1] != ' ' && $new_json[strlen($new_json)-1] != "\n"))
                                    $new_json .= " ";
                            break;
                    case "\\":
                            if(!$in_slash)
                            {
                                    $in_slash = true;
                                    $new_json .= "\\";
                                    continue 2; // First time in 8 years of programming I've ever had to use this legitimately.
                            }
                            $new_json .= "\\";
                            break;
                    case '"':
                            if(!$in_slash)
                                    $in_string = !$in_string;
                            $new_json .= $char;
                            break;
                    case "\n":
                    case "\r":
                    case "\t":
                            if($in_string)
                                    $new_json .= $char;
                            break;
                    default:
                            $new_json .= $char;
                            break;
            }

            $in_slash = false;
    }

    return $new_json;
}
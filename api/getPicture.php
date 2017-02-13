<?php
require 'vendor/autoload.php';
try {
    // Create a new SimpleImage object
    $image = new \claviska\SimpleImage();
    $image->fromFile('test.jpg');                     // load image.jpg
    $image->resize($image->getWidth()/2, $image->getHeight()/2);                          // resize to 320x200 pixels
    $image->toScreen();                               // output to the screen
} catch(Exception $err) {
    // Handle errors
    echo $err->getMessage();
}
?>

<?php
require 'vendor/autoload.php';
try {
    // Create a new SimpleImage object
    $image = new \claviska\SimpleImage();
    $image->fromFile(getcwd() . "/data/Maroc/" . $_GET["file"]);                     // load image.jpg
    if(!($image->getWidth()<1000 || $image->getHeight() < 1000)) {
        $image->resize($image->getWidth() / 2, $image->getHeight() / 2);
    }
    $image->toScreen();                               // output to the screen
} catch(Exception $err) {
    // Handle errors
    echo $err->getMessage();
}
?>

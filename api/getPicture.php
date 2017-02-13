<?php
require 'vendor/autoload.php';
try {
    // Create a new SimpleImage object
    $image = new \claviska\SimpleImage();
    $image->fromFile(getcwd() . "/data/" . $_GET["folder"] . "/" . $_GET["file"]);
    if(isset($_GET["thumb"])){
        //$image->resize($image->getWidth()/4, $image->getHeight()/4);
        //$image->crop(200, 200, 200, 200);
        $image->resize(340, 200);
        $image->toScreen();
    }else {
        if ($image->getWidth() > 1000 || $image->getHeight() > 1000) {
            $image->resize($image->getWidth() / 1.5, $image->getHeight() / 1.5);
        }
        $image->toScreen();                               // output to the screen
    }
} catch(Exception $err) {
    // Handle errors
    echo $err->getMessage();
}


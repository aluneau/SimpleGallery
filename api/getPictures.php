<?php
header('Content-type: application/json');
$_POST = json_decode(file_get_contents('php://input'), true);
if(isset($_POST['folder'])){
    $folderName = $_POST['folder'];
    $path = getcwd() . "/data/" . $folderName;
    $results = array();
    if(is_dir($path)){
        $images = preg_grep('~\.(jpeg|jpg|png)$~', scandir($path));
        $id = 0;
        foreach ($images as $result) {
            $object = array();
            $object['id'] = $id;
            $id++;
            $object['fileName']=$result;
            array_push($results, $object);
        }
        echo json_encode($results);
    }else{
        echo "{\"error\":\"This folder does not exist\"}";
    }
}else{
    echo "{\"error\":\"No folder set\"}";
}

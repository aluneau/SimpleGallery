<?php
header('Content-type: application/json');
$path = getcwd() . "/data";

$arr = scandir($path);
$results = array();
foreach ($arr as $result) {
    if ($result === '.' or $result === '..') continue;

    if (is_dir($path . '/' . $result)) {
        array_push($results, $result);
    }
}

echo json_encode($results);
<?php
header('Content-Type: application/json');

$directory = 'thc-diagrams';
$files = array_diff(scandir($directory), array('..', '.'));

$svgFiles = array_filter($files, function($file) use ($directory) {
    return pathinfo($directory . '/' . $file, PATHINFO_EXTENSION) === 'svg';
});

echo json_encode(array_values($svgFiles));
?>
<?php

include("resize-class.php");


$uploaddir = '../uploads/'; 
$random_digit=rand(0000,9999).time();

$new_file_name=$uploaddir.$random_digit.$_FILES['uploadfile']['name'];

//$file = $uploaddir . basename($_FILES['uploadfile']['name']); 
 
if (move_uploaded_file($_FILES['uploadfile']['tmp_name'], $new_file_name)) { 
// *** 1) Initialise / load image
	$resizeObj = new resize($new_file_name);

	// *** 2) Resize image (options: exact, portrait, landscape, auto, crop)
	$resizeObj -> resizeImage(140, 209, 'auto');

	// *** 3) Save image
	$resizeObj -> saveImage($new_file_name, 100);
	
	
  echo "success|".$new_file_name; 
} else {
	echo "error";
}
?>
<?php
$uploaddir = '../uploads/'; 
$random_digit=rand(0000,9999).time();

$new_file_name=$uploaddir.$random_digit.$_FILES['uploadfile']['name'];

//$file = $uploaddir . basename($_FILES['uploadfile']['name']); 
 
if (move_uploaded_file($_FILES['uploadfile']['tmp_name'], $new_file_name)) { 
  echo "success|".$new_file_name; 
} else {
	echo "error";
}
?>
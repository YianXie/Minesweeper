<?php 
session_start();

$msg = $_POST["data"];

if ($msg == "logout") {
    session_unset();
    session_destroy();
}
?>
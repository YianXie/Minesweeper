<?php 
session_start();
$username = $_SESSION["username"];
$personal_filename = "./userdata/" . $username . "/" . $username . "time.txt";
$serserBest_filename = "server_best.txt";
$time = htmlspecialchars($_POST["data"]);
$win = array();

// Personal best
$file = fopen($personal_filename,"c+") or die("unable to open file");
if ($file) {
    while (!feof($file)) {
        $line = fgets($file);
        if ($line != "" && $time < $line) {
            fseek($file,0);
            ftruncate($file,0);
            fwrite($file,$time);
            array_push($win,"better",$time);
            break;
        } else if ($line != "" && $time >= $line) {
            array_push($win,"worse");
            break;
        } else if ($line == "") {
            fwrite($file,$time);
            array_push($win,"first",$time);
            break;
        }
    }
    fclose($file);
}

// Server best
$server_file = fopen($serserBest_filename,"c+") or die("unable to open file");
if ($server_file) {
    while (!feof($server_file)) {
        $serverBestTime = fgets($server_file);
        if ($serverBestTime != "" && $time < $serverBestTime) {
            fseek($server_file,0);
            ftruncate($server_file,0);
            fwrite($server_file,$time);
            echo "server_best";
            break;
        } else if ($serverBestTime == "") {
            fwrite($server_file,$time);
            echo "first_one_in_the_server";
        }
    }
    fclose($server_file);
}
?>
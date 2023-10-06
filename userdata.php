<?php 
$file_name = "user_data.txt";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $username = htmlspecialchars($_GET["username"]);
    $password = htmlspecialchars($_GET["password"]);
    $username = (string)$username;
    $password = (string)$password;

    $file = fopen($file_name,"a") or die("unable to open file");
// if there is no username or passoword, the file will not close.
    if ($username !== "" && $password !== "") {
        fwrite($file,$username);
        fwrite($file,":");
        fwrite($file,$password);
        fwrite($file,"\r\n");
        fclose($file);
    }
} else if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $login_username = htmlspecialchars($_POST["username"]);
    $login_username = (string)$login_username;
    $login_password = htmlspecialchars($_POST["password"]);
    $login_password = (string)$login_password;
    $file = fopen($file_name, "r");

    if ($file) {
        $loggedIn = false;
        while (($line = fgets($file))) {
            $data_string = explode(":", $line);
            if ($login_username == (string)$data_string[0] and $login_password == (string)$data_string[1]) {
                echo "You Successfully Logged In!";
                $loggedIn = true;
                break;
            } else {
                continue;
            }
        }
        // the file may be closed already.
        fclose($file);
    }

    // 如果登录失败，返回相应的消息
    if (!$loggedIn) {
        echo "Login Failed. Please check your username and password.";
    }
}
?>
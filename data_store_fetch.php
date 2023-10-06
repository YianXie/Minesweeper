<?php

$filename = "data.txt";

if ( isset($_POST["action"]) && isset($_POST["data"]) ) {
    // store data
    if ( $_POST["action"] == "store" ) {
        $data = htmlspecialchars($_POST["data"]);
    //    echo "Data received: $data \n";

        $file = fopen($filename,"w") or die("unable to open file");
        if ( $file ) {
            fwrite($file,$data);
            fclose($file);
        } else {
            echo "Failed to open file for writing.";
        }
    } else {
        // fetch data
    }
}

?>

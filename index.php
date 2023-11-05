<?php session_start()?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>扫雷</title>
        <meta http-equiv="expires" content="0">
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="cache-control" content="no-cache">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="Minesweeper_Style.css">
        <link rel="icon" type="image/x-icon" href="Website_Icon.ico">
    </head>
    <body>
        <header>
            <div class="gameTitle">
                <img src="Minesweeper_Flag_Icon.png" alt="icon" height="60px">
                <span id="bigtitle" style="font-weight: bold;">Minesweeper</span>
            </div>
            <div style="font-size: x-large;"><a id="register" href="register.php" class="register">Register</a></div>
            <div class="leftFlag">
                <img src="Minesweeper_Flag_Icon.png" height="24px">
                <span id="remaining_flag_number" class="remain-flag"></span>
            </div>
        </header>

        <table id="gameHead">
            <tr>
                <td>
                    <div class="flag_mode_div" style="text-align: right;">
                        <span id="total_used_time" style="text-align: right;">0</span>
                        <input type="checkbox" value="flag_mode" name="flag_mode" onchange="flag_mode_function()" id="flag_mode" style="cursor: pointer;">
                        <label for="flag_mode" id="flag_mode_label"> Flag Mode</label>
                        <br>
                        <div class="dropdown">
                            <div id="dropdown_menu" class="user_content" style="font-size: large;">
                                <a href="javascript:check_stats()" id="stats_href">Stats</a>
                                <a href="javascript:log_out()" style="color: red;" id="log_out">Log out</a>
                            </div>
                        </div>
                        <div id="fastestTime" style="font-size: large;"></div>
                        <span id="serverBestDiv" style="font-size: large;"></span>
                    </div>
                </td>
            </tr>
        </table>
        <div id="win_msg" class="win_msg">
            <div class="winHead">
                <span>You won!</span>
                <button type="button" id="close_win_msg" onclick="close_popup()">x</button>
            </div>
            <div style="background-color: white;" class="win_stats">
                <br>
                <p>Time Spent</p>
                <span id="time_spent"></span>
                <p>Landmine Removed</p>
                <span id="landmine_removed"></span>
                <p id="win_rate_p">Win Rate</p>
                <div id="win_rate" style="font-size: 35px;font-weight: bold"></div>
                <button onclick="replay()">Watch Replay</button>
                <button type="button" onclick="init()" class="new_game_btn" id="new_game_btn">New Game</button>
            </div>
        </div>

        <div> 
            <audio id="lose_audio">
                <source src="bomb_explosion.mp3" type="audio/mpeg">
            </audio>
            <audio id="click_audio">
                <source src="Minesweeper_Click.mp3" type="audio/mpeg">
            </audio>
            <audio id="gameStart" autoplay>
                <source src="start.mp3" type="audio/mpeg">
            </audio>
            <audio id="win_audio">
                <source src="minesweeper_win.mp3" type="audio/mpeg">
            </audio>
        </div>
        <main>
            <select id="sizeSelection" onchange="changeSize()" class="diffculty">
                <option id="easyMode">Easy</option>
                <option id="hardMode">Hard</option>
                <option id="expertMode">Expert</option>
            </select>
            <table class="minesweeper" id="minesweeper_table"></table>
        </main>

        <?php 
        $username = $_SESSION["username"];
        $loginStatus = $_SESSION["loginStatus"];
        echo '<script>';
        echo 'var jsUsername = "' . $username . '";';
        echo 'let login = "' . $loginStatus . '";';
        echo '</script>';
        if ($loginStatus) {
            mkdir("./userdata/" . $username);
            $timeFileName = "./userdata/" . $username . "/" . $username . "time.txt";
            $file = fopen($timeFileName,"c+");
            while (!feof($file)) {
                $line = fgets($file);
                if ($line != "") {
                    echo '<script>';
                    echo 'var bestTime = ' . $line . ';';
                    echo '</script>';
                }
            }

            $stats = file("./userdata/" . $username . "/" . $username . "win_rate.txt");
            $json_stats = json_encode($stats);
            echo "<script>";
            echo 'var stats = ' . $json_stats . ';';
            echo "</script>";
        }

        $serverBest = fopen("server_best.txt","r");
        while (!feof($serverBest)) {
            $serverBestTime = fgets($serverBest);
            echo "<script>";
            echo 'var serverBestTime = "' . $serverBestTime . '";';
            echo "</script>";
        }
        ?>
        <script>
            if (login) {
                document.getElementById("register").innerHTML = jsUsername;
                document.getElementById("register").href = "javascript:user_menu();";
                if (bestTime != "") {
                    document.getElementById("fastestTime").innerHTML = "Your best record: " + bestTime + " seconds";
                };
            };
            document.getElementById("serverBestDiv").innerHTML = "Server best record: " + serverBestTime + " seconds";
        </script>
        <script src="Minesweeper_Javascript.js"></script>
    </body>
</html>

<?php 
session_start();
?>
<!Doctype html>
<html>
    <head>
        <style>
            html,body {
                height: 100%;
            }
            
            html {
                display: table;
                margin: auto;
            }
            
            body {
                display: table-cell;
                text-align: center;
                vertical-align: middle;
            }

            #username,#password,#repeat_password {
                height: 60px;
                width: 300px;
                background: #f1f1f1;
                border: none;
           }

            #username_text,#password_text {
                position: relative;
                left: -111px;
            }

            #repeat_password_text {
                position: relative;
                left: -82px;
            }

            #submit_button {
                background-color: #04AA6D;
                border: none;
                width: 300px;
                height: 50px;
                cursor: pointer;
            }
        </style>
        <title>Minesweeper Login</title>
    </head>
    <body>
        <img src="Minesweeper_Flag_Icon.png" alt="logo" style="height: 100px;">
        <h1 id="register_page">Login Page</h1>
        <br>
        <div id="loginResult"></div>
        <form method="POST" action="userdata.php">
            <div class="minesweeper_register_div">
                <label for="username" id="username_text"><b>Username<b></label>
                <br><br>
                <input type="text" name="username" id="username" placeholder=" Enter username here" required>
                <br><br>
                <label for="password" id="password_text"><b>Password</b></label>
                <br><br>
                <input type="password" name="password" id="password" placeholder=" Enter password here" required>
                <br><br>
                <input type="submit" id="submit_button">
            </div>
        </form>

        <?php
        if (isset($_GET["error"])) {
            echo "<p style='color: red;'>用户名或密码不正确，请重试。</p>";
        }
        ?>
            <!-- need to link to register page -->
        <p>Don't have an account? <a href="register.php">Sign up</a></p>

    </body>
</html>
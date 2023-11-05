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
                /* padding: -5px; */
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
        <title>Minesweeper Register</title>
    </head>
    <body>
        <img src="Minesweeper_Flag_Icon.png" alt="Flag" style="height:100px;">
        <h1 id="register_page">Register Page</h1>
        <br>
        <!-- should not use the full path -->
        <!-- should not use GET, otherwise the password will be leak -->
        <form action="userdata.php" method="GET" onsubmit="check_password()">
            <div class="calculater_register_div">
                <label for="username" id="username_text"><b>Username<b></label>
                <br><br>
                <input type="text" name="username" id="username" placeholder=" Enter username here" required>
                <br><br>
                <label for="password" id="password_text"><b>Password</b></label>
                <br><br>
                <input type="password" name="password" id="password" placeholder=" Enter password here" required>
                <br><br>
                <label for="repeat_password" id="repeat_password_text"><b>Repeat Password</b></label>
                <br><br>
                <input type="password" name="repeat_password" id="repeat_password" placeholder=" Repeat Password" required>
                <br><br>
                <input type="submit" id="submit_button">
            </div>
        </form>
        <p>Already have an account? <a href="login.php">Sign in</a></p>
        <script>
            function check_password() {
                var password = document.getElementById("password").value;
                var repeat_password = document.getElementById("repeat_password").value;
                if (password !== repeat_password) {
                    alert("Password does not match!Try again!")
                    document.getElementById("password").value = ""
                    document.getElementById("repeat_password").value = ""
                    event.preventDefault();
                } else {
                    return true;
                }
            }
        </script>
    </body>
</html>
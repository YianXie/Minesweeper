const diffcultyEasy = 9;
const diffcultyHard = 16;
const diffcultyExpert = 30;

// Variables
var landmine_coor = [];
var click_row_number = 0;
var click_column_number = 0;
var minesweeper_table = document.getElementById("minesweeper_table");
var changed_value;
var left_flag = 0;
var total_time = 0;
var win_percentage = 1;
var tr_cell;
var enable_flag_mode_or_not = false;
var first_click = true;
var mouseDownTime = 0;
var timeOutId = null;
var isFlagged = false;
var tr_cells;
var td_cells;
var map = [], flag_map = [], expanded = [];
let diffculty = "Easy";
const diffcultyEasyLandmineCount = 10;
const diffcultyHardLandmineCount = 40;
const diffcultyExpertLandmineCount = 99;
var landmine_count = diffcultyEasyLandmineCount;
var map_size = diffcultyEasy;
const cellWidth = 78;
var cell_size,gridWidth;
var phpResponse;
let won = undefined;
let win_rate,record_time;
let moves = [];

console.log("Javascript vesion: 2050");

// generate minesweeper map
function generateMap(onReplay) {
    if (!onReplay) {
        map.length = 0;
    }
    expanded.length = 0;
    flag_map.length = 0;
    const tableBody = document.createElement("tbody");
    tableBody.id = "mapBody";
    minesweeper_table.appendChild(tableBody);
    for (let r = 0; r < map_size; r++) {
        const createTr = document.createElement("tr");
        createTr.id = r;
        document.getElementById("mapBody").appendChild(createTr);
        // Dynamically generated
        if (!onReplay) {
            map.push([]);
        }
        flag_map.push([]);
        expanded.push([]);
        for (let c = 0; c < map_size; c++) {
            const createTd = document.createElement("td");
            document.getElementById(r).appendChild(createTd);
            if (!onReplay) {
                map[r].push(0);
            }
            flag_map[r].push(0);
            expanded[r].push(0);
        };
    };
    td_cells = document.querySelectorAll("td");
    tr_cells = document.querySelectorAll("tr");
    gridWidth = minesweeper_table.rows[0].cells[0].offsetWidth;
};

function addEventListeners() {
    // use EventListener instead of "onclick"
    td_cells.forEach(detect_td_onclick => { // check left click
        if (detect_td_onclick.parentNode.parentNode.parentNode.id != "gameHead") {
            detect_td_onclick.addEventListener("click", function () {
                click_column(this);
            });
        };
    });

    tr_cells.forEach(detect_tr_onclick => {
        if (detect_tr_onclick.parentNode.parentNode.id != "gameHead") {
            detect_tr_onclick.addEventListener("click", function () {
                click_row(this);
            });
        };
    });

    // hold for 1s to place flag
    // 移动端还有问题
    td_cells.forEach(hold_right_click => {
        hold_right_click.addEventListener("mousedown", function () {
            mouseDownTime = Date.now();

            timeOutId = setTimeout(function () {
                const currentTime = Date.now();
                if (currentTime - mouseDownTime >= 1000 && !isFlagged) {
                    right_click(hold_right_click);
                    isFlagged = true;
                };
            }, 1000);
        });

        hold_right_click.addEventListener("mouseup", function (event) {
            clearTimeout(timeOutId);
        });
    });

    // right click
    td_cells.forEach(cell => {
        cell.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            right_click(cell);
        })
    })
}

// Initialize the game, including remove the existing data.
function init(onReplay) {
    if (login) {
        win_rate = Math.round(100 / parseFloat(stats[1]) * parseFloat(stats[0]));
    }
    // Remove existing data.
    if (document.getElementById("mapBody")) {
        document.getElementById("mapBody").remove(); // reset minesweeper map
    } 
    left_flag = landmine_count;
    total_time = 0;
    update_time();
    first_click = true;
    if (!onReplay) {
        map.length = 0;
    }

    // Create a new one
    if (onReplay) {
        generateMap(true); // recreate map
    } else {
        generateMap(false);
    }
    addEventListeners();
    document.getElementById("remaining_flag_number").innerHTML = left_flag;
    try {
        clearInterval(record_time);
    }
    catch(err) {

    }
    record_time = setInterval(update_time, 1000);
}

function flag_mode_function() {
    enable_flag_mode_or_not = document.getElementById("flag_mode").checked;
    if (enable_flag_mode_or_not) {
        minesweeper_table.style.cursor = "url('Website_Icon.ico'),auto";
    } else {
        minesweeper_table.style.cursor = "auto";
    }
};

function update_time() {
    document.getElementById("total_used_time").innerHTML = total_time;
    total_time += 1;
};

function generateLandmine(click_row_number, click_column_number) {
    landmine_coor.length = 0;
    for (let i = 0; i < landmine_count; i++) {
        // Get the landmine coords
        let random_row = Math.floor(Math.random() * map_size); // Random row
        let random_column = Math.floor(Math.random() * map_size); // Random col
        random_row = random_row.toString();
        random_column = random_column.toString();
        let added_value = random_row + random_column;
        // Prevent same number from appearing
        if (landmine_coor.includes(added_value) || added_value == (click_row_number.toString() + click_column_number.toString())) {
            i -= 1;
            continue;
        } else {
            landmine_coor.push(added_value);
            map[random_row][random_column] = 9;
        };
    };

    for (let r = 0; r < map_size; r++) {
        for (let c = 0; c < map_size; c++) {
            var landmine_beside = 0;
            if (map[r][c] != 9) {
                if (r - 1 >= 0 && c - 1 >= 0) {
                    if (map[r - 1][c - 1] == 9) {
                        landmine_beside += 1
                    };
                }
                if (r - 1 >= 0) {
                    if (map[r - 1][c] == 9) {
                        landmine_beside += 1
                    };
                }
                if (r - 1 >= 0 && c + 1 <= map_size - 1) {
                    if (map[r - 1][c + 1] == 9) {
                        landmine_beside += 1
                    };
                }
                if (c - 1 >= 0) {
                    if (map[r][c - 1] == 9) {
                        landmine_beside += 1
                    };
                }
                if (c + 1 <= map_size - 1) {
                    if (map[r][c + 1] == 9) {
                        landmine_beside += 1
                    };
                }
                if (r + 1 <= map_size - 1 && c - 1 >= 0) {
                    if (map[r + 1][c - 1] == 9) {
                        landmine_beside += 1
                    };
                }
                if (r + 1 <= map_size - 1) {
                    if (map[r + 1][c] == 9) {
                        landmine_beside += 1
                    };
                }
                if (r + 1 <= map_size - 1 && c + 1 <= map_size - 1) {
                    if (map[r + 1][c + 1] == 9) {
                        landmine_beside += 1
                    };
                }
                map[r][c] = landmine_beside;
            }
        }
    }
}

function click_row(row,onReplay) {
    // Get the row number
    if (!enable_flag_mode_or_not) {
        click_row_number = row.rowIndex;
        if (first_click && !onReplay) {
            generateLandmine(click_row_number,click_column_number);
        };
        check_landmine(click_row_number, click_column_number);
        if (map[click_row_number][click_column_number] == 0) {
            expand_cell(click_row_number, click_column_number);
        };
        first_click = false;
        const dataList = [
            document.getElementById("total_used_time").innerHTML,
            "\r\n",
            left_flag,
            "\r\n",
            map,
            "\r\n",
            flag_map,
            "\r\n",
            expanded,
        ];
        // temporary remove it to reduce lag
        // store_data(dataList,"data_store_fetch.php");
        if (!onReplay) {
            addToMoves(row.rowIndex,click_column_number,false);
        }
    } if (onReplay) {
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundColor = "rgba(232,157,51,0.5)";
        setTimeout(function() {minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundColor = "rgb(255,255,255)"},500);
    }
}

function click_column(cell) {
    // Get the cell number
    if (enable_flag_mode_or_not && cell.parentNode.parentNode.id != "gameHead") {
        right_click(cell);
    } else {
        click_column_number = cell.cellIndex;
    };
};

function expand_cell(row, col) {
    expanded[row][col] = 1;
    minesweeper_table.rows[row].cells[col].style.border = "1px solid";
    if (map[row][col] != 9) {
        if (row - 1 >= 0 && col - 1 >= 0) {
            if (map[row-1][col-1] != 9) {
                check_landmine(row - 1, col - 1);
                if (map[row - 1][col - 1] == 0 && expanded[row - 1][col - 1] == 0) {
                    expand_cell(row - 1, col - 1);
                };
            };
        };
        if (row - 1 >= 0) {
            if (map[row-1][col] != 9) {
                check_landmine(row - 1, col);
                if (map[row - 1][col] == 0 && expanded[row - 1][col] == 0) {
                    expand_cell(row - 1, col);
                };
            }
        }
        if (row - 1 >= 0 && col + 1 <= map_size - 1) {
            if (map[row-1][col+1] != 9) {
                check_landmine(row - 1, col + 1);
                if (map[row - 1][col + 1] == 0 && expanded[row - 1][col + 1] == 0) {
                    expand_cell(row - 1, col + 1);
                };
            }
        }
        if (col - 1 >= 0) {
            if (map[row][col-1] != 9) {
                check_landmine(row, col - 1);
                if (map[row][col - 1] == 0 && expanded[row][col - 1] == 0) {
                    expand_cell(row, col - 1);
                };
            }
        }
        if (col + 1 <= map_size - 1) {
            if (map[row][col+1] != 9) {
                check_landmine(row, col + 1);
                if (map[row][col + 1] == 0 && expanded[row][col + 1] == 0) {
                    expand_cell(row, col + 1);
                };
            }
        }
        if (row + 1 <= map_size - 1 && col - 1 >= 0) {
            if (map[row+1][col-1] != 9) {
                check_landmine(row + 1, col - 1);
                if (map[row + 1][col - 1] == 0 && expanded[row + 1][col - 1] == 0) {
                    expand_cell(row + 1, col - 1);
                };
            }
        }
        if (row + 1 <= map_size - 1) {
            if (map[row+1][col] != 9) {
                check_landmine(row + 1, col);
                if (map[row + 1][col] == 0 && expanded[row + 1][col] == 0) {
                    expand_cell(row + 1, col);
                };
            }
        }
        if (row + 1 <= map_size - 1 && col + 1 <= map_size - 1) {
            if (map[row+1][col+1] != 9) {
                check_landmine(row + 1, col + 1);
                if (map[row + 1][col + 1] == 0 && expanded[row + 1][col + 1] == 0) {
                    expand_cell(row + 1, col + 1);
                };
            }
        };
    }
};

function check_landmine(click_row_number, click_column_number) {
    let milliseconds = new Date().getMilliseconds();
    // console.log(milliseconds);
    changed_value = minesweeper_table.rows[click_row_number].cells[click_column_number];
    changed_value.style.backgroundSize = gridWidth * 0.8 + 'px' + " " + gridWidth * 0.8 + 'px';
    if (minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundImage.includes("Minesweeper_Flag_Icon.png")) {
        if (!isFlagged) {
            left_flag += 1;
            document.getElementById("remaining_flag_number").innerHTML = left_flag;
            minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundColor = "rgb(189,189,189)";
            minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundImage = "none";
            flag_map[click_row_number][click_column_number] = 0;
        } else {
            isFlagged = false;
        };
    } else if (map[click_row_number][click_column_number] == 9 && flag_map[click_row_number][click_column_number] != 1) {
        // If the player click on the landmine...
        won = false;
        changed_value.style.backgroundImage = "url('Minesweeper_Icon_Bomb.png')";
        changed_value.style.backgroundColor = "red";
        for (let r = 0;r < map_size;r++) {
            for (let c = 0;c < map_size;c++) {
                if (map[r][c] == 9 && flag_map[r][c] != 1) {
                    minesweeper_table.rows[r].cells[c].style.backgroundImage = "url('Minesweeper_Icon_Bomb.png')";
                    minesweeper_table.rows[r].cells[c].style.backgroundSize = gridWidth * 0.8 + 'px' + " " + gridWidth * 0.8 + 'px';
                } else if (map[r][c] == 9 && flag_map[r][c] == 1) {
                    minesweeper_table.rows[r].cells[c].style.backgroundImage = "url('flagged_landmine.png')";
                    minesweeper_table.rows[r].cells[c].style.backgroundSize = gridWidth * 0.8 + 'px' + " " + gridWidth * 0.8 + 'px';
                } else if (map[r][c] != 9 && flag_map[r][c] == 1) {
                    minesweeper_table.rows[r].cells[c].style.backgroundImage = "url('wrong_flag.png')";
                    minesweeper_table.rows[r].cells[c].style.backgroundSize = gridWidth * 0.8 + 'px' + " " + gridWidth * 0.8 + 'px';
                };
            };
        };
        document.getElementById("lose_audio").play();
        clearInterval(record_time);
        if (login) {
            store_data("lose","win_rate.php");
        };
        return;
    } else {
        if (!document.getElementById("click_audio").paused) {
            document.getElementById("click_audio").currentTime = 0;
            document.getElementById("click_audio").play();
        } else {
            document.getElementById("click_audio").play();
        };
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.border = "1px solid black";
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.width = gridWidth-4 + "px";
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.height = gridWidth-4 + "px";
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.fontSize = gridWidth * 0.6 + "px";
        minesweeper_table.rows[click_row_number].cells[click_column_number].classList.add("clicked");
        if (map[click_row_number][click_column_number] != 0) {
            minesweeper_table.rows[click_row_number].cells[click_column_number].innerHTML = map[click_row_number][click_column_number];
            minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundColor = "white";
        } else {
            minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundColor = "white";
        }
    };

    // Change the color of the number depend on the value
    const number_on_the_cell = minesweeper_table.rows[click_row_number].cells[click_column_number].innerHTML;
    if (number_on_the_cell == 1) {
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.color = "blue";
    } else if (number_on_the_cell == 2) {
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.color = "green";
    } else if (number_on_the_cell == 3) {
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.color = "red";
    } else if (number_on_the_cell == 4) {
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.color = "purple";
    } else if (number_on_the_cell >= 5) {
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.color = "black";
    };
};

function right_click(cell,onReplay) {
    var right_click_row = cell.parentNode.rowIndex;
    if (left_flag > 0 && !first_click && minesweeper_table.rows[right_click_row].cells[cell.cellIndex].innerHTML == "" && flag_map[right_click_row][cell.cellIndex] != 1 && expanded[right_click_row][cell.cellIndex] != 1 && cell.parentNode.parentNode.parentNode.id != "gameHead") {
        if (!onReplay) {
            addToMoves(right_click_row,cell.cellIndex,true);
        }
        left_flag -= 1;
        cell.style.backgroundImage = "url('Minesweeper_Flag_Icon.png')";
        cell.style.backgroundSize = gridWidth * 0.8 + 'px' + " " + gridWidth * 0.8 + 'px';
        document.getElementById("remaining_flag_number").innerHTML = left_flag;
        flag_map[right_click_row][cell.cellIndex] = 1;
        won = true;
        for (let r = 0; r < map_size; r++) {
            for (let c = 0; c < map_size; c++) {
                if (map[r][c] == 9 && flag_map[r][c] !== 1) {
                    won = false;
                    break;
                }
            }
            if (!won) {
                break;
            }
        }

        if (won) {;
            clearInterval(record_time);
            if (login) {
                document.getElementById("time_spent").innerHTML = document.getElementById("total_used_time").innerHTML + "s";
                if (diffculty == "Easy") {
                    document.getElementById("landmine_removed").innerHTML = 10;
                } else if (diffculty == "Hard") {
                    document.getElementById("landmine_removed").innerHTML = 40;
                } else if (diffculty == "Expert") {
                    document.getElementById("landmine_removed").innerHTML = 99;
                }
                document.getElementById("win_rate").innerHTML = win_rate + "%";
                show_popup();
                store_data(document.getElementById("total_used_time").innerHTML,"shortest_time.php");
                store_data("win","win_rate.php");
            } else {
                document.getElementById("time_spent").innerHTML = document.getElementById("total_used_time").innerHTML + "s";
                if (diffculty == "Easy") {
                    document.getElementById("landmine_removed").innerHTML = 10;
                } else if (diffculty == "Hard") {
                    document.getElementById("landmine_removed").innerHTML = 40;
                } else if (diffculty == "Expert") {
                    document.getElementById("landmine_removed").innerHTML = 99;
                };
                document.getElementById("win_rate_p").innerHTML = "<a href='login.php'>login</a> to record your win rate";
                show_popup();
            }
            document.getElementById("win_audio").play();
        };
    } else if (left_flag < 0) {
        return;
    } else if (first_click && cell.parentNode.parentNode.parentNode.id != "gameHead") {
        return;
    }
};

function changeSize() {
    diffculty = document.getElementById("sizeSelection").value;
    if (diffculty == "Easy") {
        map_size = diffcultyEasy;
        landmine_count = diffcultyEasyLandmineCount;
    } else if (diffculty == "Hard") {
        map_size = diffcultyHard;
        landmine_count = diffcultyHardLandmineCount;
    } else if (diffculty == "Expert") {
        map_size = diffcultyExpert;
        landmine_count = diffcultyExpertLandmineCount;
    };
    init();
};

function user_menu() {
    document.getElementById("dropdown_menu").classList.toggle("show");
}

function check_stats() {
    // remove the "\r\n"
   alert("Your win rate is " + win_rate + "%");
}

function log_out() {
    // log out
    // login = false;
    // document.getElementById("register").innerHTML = "register";
    // document.getElementById("register").href = "register.php";
    store_data("logout","log_out.php");
    location.reload();
}

function store_data(data,phpName) {
    fetch(phpName, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `action=store&data=${data}`,
    })
        .then(response => response.text()) // 将响应转换为文本
        .then(responseData => {
            phpResponse = responseData;
            if (login) {
                if (phpResponse == "server_best") {
                    alert("Congratulation! You are the fastest player in the whole server!");
                    document.getElementById("serverBestDiv").innerHTML = "Server best record: " + total_time + " seconds";
                } else if (phpResponse == "first_one_in_the_server") {
                    alert("You are the first one who won in the whole server!");
                };
            };
            // console.log(phpResponse);
        })
        .catch(error => {
            console.error("Error:", error);
        });
};

function show_popup() {
    document.getElementById("win_msg").classList.add("openPopup");
}

function close_popup() {
    document.getElementById("win_msg").classList.remove("openPopup");
}

function addToMoves(row,col,flag,time) {
    const aMove = { // create data to move
        row,
        col,
        flag
    };

    moves.push(aMove); // move data to moves
}

function replay() {
    td_cells.forEach(detect_td_onclick => {
        detect_td_onclick.removeEventListener("click", click_column);
    });

    tr_cells.forEach(detect_tr_onclick => {
        detect_tr_onclick.removeEventListener("click", click_row);
    });
    
    close_popup();
    init(true);
    let currentIndex = 0;

    function startReplay() {
        if (currentIndex < moves.length) {
            if (!moves[currentIndex].flag) {
                click_column(minesweeper_table.rows[moves[currentIndex].row].cells[moves[currentIndex].col]);
                click_row(minesweeper_table.rows[moves[currentIndex].row],true);
            } else if (moves[currentIndex].flag) {
                right_click(minesweeper_table.rows[moves[currentIndex].row].cells[moves[currentIndex].col],true);
            }
            currentIndex++;
            setTimeout(startReplay,1000);
        }
    }
    setTimeout(startReplay,500);
}

window.onclick = function(event) {
  // make the dropdown menu disappear 
  if (!event.target.matches('.register')) {
    var dropdowns = document.getElementsByClassName("user_content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

document.getElementById("new_game_btn").addEventListener("click",function() {
    close_popup();
}) 

init(false);

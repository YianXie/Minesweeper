// Variables
var landmine_coor = [];
var click_row_number = 0;
var click_column_number = 0;
var minesweeper_table = document.getElementById("minesweeper_table");
var changed_value;
var left_flag = 8;
var total_time = 0;
var win_percentage = 1;
var tr_cell;
var enable_flag_mode_or_not = false;
var first_click = true;
var map_size = 9;
var landmine_count = 0;
var mouseDownTime = 0;
var timeOutId = null;
var isFlagged = false;
var tr_cells;
var td_cells;
var map = [],flag_map = [],expanded = [];

console.log("1429"); // version 1429
function generateMap(size) {
    for (let r = 0;r<size;r++) {
        const createTr = document.createElement("tr");
        createTr.id = r;
        minesweeper_table.appendChild(createTr);
        // Dynamically generated
        map.push([]);
        flag_map.push([]);
        expanded.push([]);
        landmine_count++;
        for (let c = 0;c<size;c++) {
            const createTd = document.createElement("td");
            document.getElementById(r).appendChild(createTd);
            map[r].push(0);
            flag_map[r].push(0);
            expanded[r].push(0);
        };
    };
};
generateMap(map_size); // generate orginal map

td_cells = document.querySelectorAll("td");
tr_cells = document.querySelectorAll("tr");

// use EventListener instead of "onclick"
td_cells.forEach(detect_td_onclick => { // check left click
    detect_td_onclick.addEventListener("click",function(event){
        click_column(this);
    });
});

tr_cells.forEach(detect_tr_onclick => {
    if (detect_tr_onclick.parentNode.parentNode.id != "gameHead") {
        detect_tr_onclick.addEventListener("click",function(event){
            click_row(this);
        });
    };
});

// hold for 1s to place flag
// 移动端还有问题
td_cells.forEach(hold_right_click => {
    hold_right_click.addEventListener("mousedown",function(event) {
        mouseDownTime = Date.now();

        timeOutId = setTimeout(function() {
            const currentTime = Date.now();
            if (currentTime - mouseDownTime >= 1000 && !isFlagged) {
                right_click(hold_right_click);
                isFlagged = true;
            };
        },1000);
    });

    hold_right_click.addEventListener("mouseup",function(event) {
        clearTimeout(timeOutId);
    });
});

function flag_mode_function() {
    enable_flag_mode_or_not = document.getElementById("flag_mode").checked;
    if (enable_flag_mode_or_not) {
        minesweeper_table.style.cursor = "url('Website_Icon.ico'),auto";
    } else {
        minesweeper_table.style.cursor = "auto";
    }
};

document.getElementById("remaining_flag_number").innerHTML = left_flag + " more flags"
const record_time = setInterval(update_time,1000);
function update_time() {
    total_time += 1;
    document.getElementById("total_used_time").innerHTML = total_time;
};

function init(click_row_number,click_column_number) {
    for (let i=0;i<landmine_count;i++) {
        // Get the landmine coords
        let random_row = Math.floor(Math.random() * landmine_count); // Random row
        let random_column = Math.floor(Math.random() * landmine_count); // Random col
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
    
    for (let r = 0;r < map_size;r++) {
        for (let c = 0;c < map_size;c++) {
            var landmine_beside = 0;
            if (map[r][c] != 9) {
                if (r-1 >= 0 && c-1 >= 0 ) {
                    if (map[r-1][c-1] == 9 ) {
                        landmine_beside += 1
                    };
                }
                if (r-1 >= 0) {
                    if (map[r-1][c] == 9 ) {
                        landmine_beside += 1
                    };
                }
                if (r-1 >= 0 && c+1 <= map_size-1 ) {
                    if (map[r-1][c+1] == 9 ) {
                        landmine_beside += 1
                    };
                }
                if (c-1 >= 0 ) {
                    if (map[r][c-1] == 9 ) {
                        landmine_beside += 1
                    };
                }
                if (c+1 <= map_size-1 ) {
                    if (map[r][c+1] == 9 ) {
                        landmine_beside += 1
                    };
                }
                if (r+1 <= map_size-1 && c-1 >= 0 ) {
                    if (map[r+1][c-1] == 9 ) {
                        landmine_beside += 1
                    };
                }
                if (r+1 <= map_size-1) {
                    if (map[r+1][c] == 9 ) {
                        landmine_beside += 1
                    };
                }
                if (r+1 <= map_size-1 && c+1 <= map_size-1) {
                    if (map[r+1][c+1] == 9 ) {
                        landmine_beside += 1
                    };
                }
                map[r][c] = landmine_beside;
            }
        }
    }
}

function click_row(row) {
    // Get the row number
    if (!enable_flag_mode_or_not) {
        click_row_number = row.rowIndex;
        if (first_click) {
            init(click_row_number,click_column_number);
        }; 
        check_landmine(click_row_number,click_column_number);
        if (map[click_row_number][click_column_number] == 0 && !enable_flag_mode_or_not) {
            expand_cell(click_row_number,click_column_number);
        };
        first_click = false;
        store_data();
    };
};

function click_column(cell) {
    // Get the cell number
    if (enable_flag_mode_or_not) {
        right_click(cell);
    } else {
        click_column_number = cell.cellIndex;
    };
};

function expand_cell(row,col) {
    expanded[row][col] = 1;
    minesweeper_table.rows[row].cells[col].style.border = "1px solid";
    if (!landmine_coor.includes(row.toString() + col.toString()) && check_if_there_are_landmine_beside(row,col)) {
        if (row-1 >= 0 && col-1 >= 0) {
            if (!landmine_coor.includes((parseInt(row-1)).toString() + parseInt(col -1).toString())) {
                check_landmine(row-1,col-1);
                if (map[row-1][col-1] == 0 && expanded[row-1][col-1] == 0) {
                    expand_cell(row-1,col-1);
                };
            }
        } 
        if (row-1 >= 0) {
            if (!landmine_coor.includes((parseInt(row-1)).toString() + parseInt(col).toString())) {
                check_landmine(row-1,col);
                if (map[row-1][col] == 0 && expanded[row-1][col] == 0) {
                    expand_cell(row-1,col);
                };
            } 
        } 
        if (row-1 >= 0 && col+1 <= map_size-1) {
            if (!landmine_coor.includes((parseInt(row-1)).toString() + parseInt(col + 1).toString())) {
                check_landmine(row-1,col+1);
                if (map[row-1][col+1] == 0 && expanded[row-1][col+1] == 0) {
                    expand_cell(row-1,col+1);
                };
            } 
        }
        if (col-1 >= 0) {
            if (!landmine_coor.includes((parseInt(row)).toString() + parseInt(col - 1).toString())) {
                check_landmine(row,col-1);
                if (map[row][col-1] == 0 && expanded[row][col-1] == 0) {
                    expand_cell(row,col-1);
                };
            }
        } 
        if (col+1 <= map_size-1) {
            if (!landmine_coor.includes((parseInt(row)).toString() + parseInt(col + 1).toString())) {
                check_landmine(row,col+1);
                if (map[row][col+1] == 0 && expanded[row][col+1] == 0) {
                    expand_cell(row,col+1);
                };
            } 
        }
        if (row+1 <= map_size-1 && col-1 >= 0) {
            if (!landmine_coor.includes((parseInt(row+1)).toString() + parseInt(col - 1).toString())) {
                check_landmine(row+1,col-1);
                if (map[row+1][col-1] == 0 && expanded[row+1][col-1] == 0) {
                    expand_cell(row+1,col-1);
                };
            } 
        }
        if (row+1 <= map_size-1) {
            if (!landmine_coor.includes((parseInt(row+1)).toString() + parseInt(col).toString())) {
                check_landmine(row+1,col);
                if (map[row+1][col] == 0 && expanded[row+1][col] == 0) {
                    expand_cell(row+1,col);
                };
            } 
        }
        if (row+1 <= map_size-1 && col+1 <= map_size-1) {
            if (!landmine_coor.includes((parseInt(row+1)).toString() + parseInt(col + 1).toString())) {
                check_landmine(row+1,col+1);
                if (map[row+1][col+1] == 0 && expanded[row+1][col+1] == 0) {
                    expand_cell(row+1,col+1);
                };
            } 
        };
    } 
}

function check_if_there_are_landmine_beside(row,col) {
    if (landmine_coor.includes(row.toString() + col.toString()) == false) {
        if (landmine_coor.includes((parseInt(row) - 1).toString() + parseInt(col -1).toString())) {
            return false;
        } else if (landmine_coor.includes((parseInt(row) - 1).toString() + parseInt(col).toString())) {
            return false;
        } else if (landmine_coor.includes((parseInt(row) + 1).toString() + parseInt(col - 1).toString())) {
            return false;
        } else if (landmine_coor.includes((parseInt(row) + 1).toString() + parseInt(col + 1).toString())) {
            return false;
        } else if (landmine_coor.includes((parseInt(row) + 1).toString() + parseInt(col).toString())) {
            return false;
        } else if (landmine_coor.includes((parseInt(row)).toString() + parseInt(col - 1).toString())) {
            return false;
        } else if (landmine_coor.includes((parseInt(row)).toString() + parseInt(col + 1).toString())) {
            return false;
        } else {
            return true;
        };
    } else {
        return false;
    };
};

function check_landmine(click_row_number,click_column_number) {
    var landmine_number = 0;
    changed_value = minesweeper_table.rows[click_row_number].cells[click_column_number];
    if (minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundImage.includes("Minesweeper_Flag_Icon.png")) {
        if (!isFlagged) {
            left_flag += 1;
            document.getElementById("remaining_flag_number").innerHTML = left_flag + " more flags";
            minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundColor = "rgb(189,189,189)";
            minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundImage = "none";
            flag_map[click_row_number][click_column_number] = 0;
        } else {
            isFlagged = false;
        };
    } else if (landmine_coor.includes(click_row_number.toString() + "" + click_column_number.toString()) && !minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundImage.includes("Minesweeper_Flag_Icon.png")) {
        // If the player click on the landmine...
        changed_value.style.backgroundImage = "url('Minesweeper_Icon_Bomb.png')";
        changed_value.style.backgroundColor = "red";
        for (let i = 0;i < landmine_coor.length;i++) {
            var show_all_landmine = landmine_coor[i].split("");
            minesweeper_table.rows[show_all_landmine[0]].cells[show_all_landmine[1]].style.backgroundImage = "url('Minesweeper_Icon_Bomb.png')";
        };
        document.getElementById("lose_audio").play();
        clearInterval(record_time);
        return;
    } else {
        document.getElementById("click_audio").play();
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.border = "1px solid black";
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.width = "74px";
        minesweeper_table.rows[click_row_number].cells[click_column_number].style.height = "74px";
        minesweeper_table.rows[click_row_number].cells[click_column_number].classList.add("clicked");
        if (map[click_row_number][click_column_number] != 0) {
            minesweeper_table.rows[click_row_number].cells[click_column_number].innerHTML = map[click_row_number][click_column_number];
            minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundColor = "white";
        } else {
            minesweeper_table.rows[click_row_number].cells[click_column_number].style.backgroundColor = "white";
        }
    };

    // Change the color of the number depend on the value
    var number_on_the_cell = minesweeper_table.rows[click_row_number].cells[click_column_number].innerHTML;
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

function right_click(cell) {
    var right_click_row = cell.parentNode.rowIndex;
    if (left_flag > 0 && !first_click && minesweeper_table.rows[right_click_row].cells[cell.cellIndex].innerHTML == "" && flag_map[right_click_row][cell.cellIndex] != 1 && expanded[right_click_row][cell.cellIndex] != 1) {
        left_flag -= 1;
        cell.style.backgroundImage = "url('Minesweeper_Flag_Icon.png')"; 
        document.getElementById("remaining_flag_number").innerHTML = left_flag + " more flags";
        flag_map[right_click_row][cell.cellIndex] = 1;
        var won = true;
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

        if (won) {
            win = true; 
            const winMessage = setTimeout(alert("You Won!"),500);
            clearInterval(record_time);
        }
    } else if (left_flag < 0) {
        return;
    };
};

td_cells.forEach(cell => {
    cell.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        right_click(cell);
    });
});

function changeSize(id) {
    console.log(id);
    if (id == "easyMode" && map_size != 9) {
        map_size = 9;
        generateMap(map_size);
    } else if (id == "hardMode" && map_size != 16) {
        map_size = 16;
        generateMap(map_size);
    } else if (id == "expertMode" && map_size != 30) {
        map_size = 30;
        generateMap(map_size);
    };
};

function store_data() {
    var data = [
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
    
    fetch("data_store_fetch.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `action=store&data=${data}`,
    })
    .then(response => response.text()) // 将响应转换为文本
    .then(responseData => {
        // 将PHP脚本的响应输出到页面上
//        console.log(responseData);
    })
    .catch(error => {
        console.error("Error:", error);
    });
};

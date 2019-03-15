var Height = 8;
var Width = 8;
var cell = [];
var board = document.getElementById("board");
var none = document.getElementById("none");
var black = document.getElementById("black");
var white = document.getElementById("white");
var black_number = document.getElementById("black-number");
var white_number = document.getElementById("white-number");
var stone = [none, black, white];
var color = document.getElementById("color");
var start = document.getElementById("start-button");
var vsHuman = document.getElementById("vsHuman");
var vsCPU = document.getElementById("vsCPU");
var reset = document.getElementById("reset-button");
var pass = document.getElementById("pass-button");
var player_color = 1;
var black_result = 0;
var white_result = 0;
var game_mode;

function init() {
    //盤面の生成
    for (var i = 0; i < Height; i++) {
        //二次元配列の作成
        cell[i] = [];
        var tr = document.createElement("tr");
        for (var j = 0; j < Width; j++) {
            var td = document.createElement("td");
            td.className = "cell";
            td.addEventListener("click", click);
            td.className = "cell";
            td.y = i;
            td.x = j;
            td.kind = 0;
            cell[i][j] = td;
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
    showBoard();
    start.style.display = "none";
    vsHuman.style.display = "none";
    vsCPU.style.display = "none";
    pass.style.display = "block";
    reset.style.display = "block";
    reset.innerHTML = '<input type="button" value="RESET" onclick="location.reload();">'
    pass.innerHTML = '<input type="button" value="PASS" onclick="pass();">'
}

function showBoard() {
    //テスト用
    /* for (var y = 0; y < 1; y++) {
           for (var x = 0; x < 8; x++) {
               cell[y][x].kind = 1;
           }
       }
       for (var y = 1; y < 7; y++) {
           for (var x = 0; x < 8; x++) {
               cell[y][x].kind = 2;
           }
       }
       for (var y = 7; y < 8; y++) {
           for (var x = 0; x < 7; x++) {
               cell[y][x].kind = 2;
           }
       }*/

    cell[3][4].kind = 1;
    cell[4][3].kind = 1;
    cell[3][3].kind = 2;
    cell[4][4].kind = 2;

    color.innerHTML = player_color;
    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            var block = stone[cell[y][x].kind].cloneNode(true);
            cell[y][x].appendChild(block);
        }
    }
}
//セルクリック時の処理
function click(e) {
    var src = e.srcElement;
    if (cell[src.y][src.x].kind == 0) {
        var cnt = turnBlock(src.y, src.x);
        if (cnt > 0) {
            var total = countTotalBlock();
            if (total == true) {
                if (game_mode == "Human") {
                    if (player_color == 1) {
                        player_color = 2;
                        //alert('相手ターン');
                        color.innerHTML = player_color;
                    } else {
                        player_color = 1;
                        //alert('自分ターン');
                        color.innerHTML = player_color;
                    }
                } else if (game_mode == "CPU") {
                    CPUturn();
                }
            }
        }
    }
}

function turnBlock(y, x) {
    var count = 0;
    for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
            //自身のマスを指した場合は判定をスキップする
            if (dx == 0 && dy == 0) {
                continue;
            }
            //その方向に何個分裏返せるコマがあるか。その方向に裏返せるかを判定。
            var cnt = countPossibleTurnBlock(y, x, dy, dx);
            //練習
            //裏返せる場合
            if (cnt > 0) {
                var cy = y + dy;
                var cx = x + dx;
                while (cell[cy][cx].kind == 3 - player_color) {
                    while (cell[cy][cx].firstChild) {
                        cell[cy][cx].removeChild(cell[cy][cx].firstChild);
                    }
                    var block2 = stone[player_color].cloneNode(true);
                    cell[cy][cx].appendChild(block2);
                    cell[cy][cx].kind = player_color;
                    cy = cy + dy;
                    cx = cx + dx;
                }
                var block3 = block2.cloneNode(true);
                cell[y][x].removeChild(cell[y][x].firstChild);
                cell[y][x].appendChild(block3);
                cell[y][x].kind = player_color;
                count++;
            }
        }
    }
    return count;
}

function CPUturn() {
    player_color = 2;
    for (var i = 0; i < Height; i++) {
        for (var j = 0; j < Width; j++) {
            if (cell[i][j].kind == 1 || cell[i][j].kind == 2) {
                continue;
            }
            var cnt = turnBlock(i, j);
            if (cnt > 0) {
                break;
            }
        }
        if (cnt > 0) {
            break;
        }
    }
    var total = countTotalBlock();
    if (total == true) {
        player_color = 1;
        //alert('自分ターン');
        color.innerHTML = player_color;
    }
}

function countPossibleTurnBlock(y, x, dy, dx) {
    var count = 0;
    //dyとdxは-1～1の間
    var cy = y + dy;
    var cx = x + dx;

    //枠をはみ出たものは判定しない
    if ((cy < 0 || Height <= cy) || (cx < 0 || Width <= cx)) {
        return 0;
    }

    //マスの種類が黒の場合は2,白の場合は1である限り、カウントを続ける
    while (cell[cy][cx].kind == 3 - player_color) {
        count++;
        cy += dy;
        cx += dx;

        //端まで達してしまったらカウントはゼロ
        if ((cy < 0 || Height <= cy) || (cx < 0 || Width <= cx)) {
            return 0;
        }
    }
    if (count > 0 && cell[cy][cx].kind == player_color) {
        return count;
    }
}

function countTotalBlock() {
    //集計
    var black_count = 0;
    var white_count = 0;
    var none_count = 0;
    for (var i = 0; i < Height; i++) {
        for (var j = 0; j < Width; j++) {
            if (cell[i][j].kind == 1) {
                black_count++;
            } else if (cell[i][j].kind == 2) {
                white_count++;
            } else {
                none_count++;
            }
        }
    }
    black_number.innerHTML = black_count;
    white_number.innerHTML = white_count;
    if (none_count == 0) {
        black_result = black_count;
        white_result = white_count;
        result();
        return false;
    }
    return true;
}
//PASSボタン押下
pass.onclick = function () {
    if (game_mode == "Human") {
        if (player_color == 1) {
            player_color = 2;
            alert('相手ターン');
            color.innerHTML = player_color;
        } else {
            player_color = 1;
            alert('自分ターン');
            color.innerHTML = player_color;
        }
    } else if (game_mode == "CPU") {
        CPUturn();
    }

}

function result() {
    if (black_result > white_result) {
        alert("player1:WIN");
    } else if (white_result > black_result) {
        alert("player2:WIN");
    } else {
        alert(drawgame);
    }
}
$('.start-button').click(function () {
    game_mode = $('input[name="game-mode"]:checked').val();
    console.log(game_mode);
})

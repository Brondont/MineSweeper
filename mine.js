document.addEventListener('DOMContentLoaded', function () {
    var board = [];
    const BOARDSIZE = 8;
    const mineCount = 9;
    var tempmineCount = mineCount;
    var mineslocation = [];
    var tilesClicked = 0;
    var flag = false;
    var gamestatus = false;
    var countup = 0;


    startGame();
    mines();
    function startGame() {
        //set mine count
        document.querySelector(".mines-count").innerHTML = '00' + tempmineCount.toString();
        document.querySelector("#flag").addEventListener('click', flagclicked);
            setInterval(timer, 1000);
        //populate columns
        for (let r = 0; r < BOARDSIZE; r++) {
            let row = [];
            for (let c = 0; c < BOARDSIZE; c++) {
                let tile = document.createElement('div');
                tile.id = r.toString() + '-' + c.toString();
                tile.addEventListener("click", tileclicked);
                document.querySelector(".Gameboard").append(tile);
                row.push(tile);
            }
            board.push(row);
        }
    }
    function timer() {
        if(gamestatus)
            return;
        countup++;
        if (countup < 10)
            document.querySelector(".timer").innerHTML = "00" + countup.toString()
        else if (countup < 100)
            document.querySelector(".timer").innerHTML = "0" + countup.toString()
        else
            document.querySelector(".timer").innerHTML = countup.toString()

    }
    function flagclicked() {
        if (flag) {
            flag = false;
            document.querySelector("#flag").style.backgroundColor = "lightgray";
        } else {
            flag = true;
            document.querySelector("#flag").style.backgroundColor = "darkgray";
        }
    }

    function tileclicked() {
        if (gamestatus)
            return;
        let tile = this;
        if (flag) {
            if (tile.innerHTML == "") {
                tile.innerHTML = "🚩";
                tempmineCount--;
                if (tempmineCount >= 0)
                    document.querySelector(".mines-count").innerHTML = '00' + tempmineCount.toString();
                else
                    document.querySelector(".mines-count").innerHTML = '-00' + (-1 * tempmineCount).toString();
            }
            else if (tile.innerHTML == "🚩") {
                tile.innerHTML = "";
                tempmineCount++;
                if (tempmineCount >= 0)
                    document.querySelector(".mines-count").innerHTML = '00' + tempmineCount.toString();
                else
                    document.querySelector(".mines-count").innerHTML = '-00' + (-1 * tempmineCount).toString();
            }
            return;
        }
        if (tile.innerHTML == "🚩")
            return;
        if (mineslocation.includes(tile.id)) {
            document.querySelector("#gamestatus").innerHTML = "😵";
            tile.style.backgroundColor = 'red';
            revealMines();
            gamestatus = true;
            return;
        }

        let coords = tile.id.split('-');
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        checkTile(r, c);
        console.log(tilesClicked);
        if (tilesClicked == ((BOARDSIZE * BOARDSIZE) - mineCount)) {
            gamestatus = true;
            console.log('win!');
            document.querySelector("#gamestatus").innerHTML = "😎"
        }
    }
    function checkTile(r, c) {
        let Smines = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (r + i >= 0 && r + i < BOARDSIZE && c + j >= 0 && c + j < BOARDSIZE) {
                    if (mineslocation.includes(board[r + i][c + j].id)) {
                        Smines++;
                    }
                }
            }
        }
        if (!board[r][c].classList.contains('tclicked'))
            tilesClicked++;
        if (Smines > 0) {
            board[r][c].innerHTML = Smines
            board[r][c].setAttribute('class', 'tclicked x' + (Smines).toString());
            board[r][c].setAttribute('style', 'border: 3px solid #7F7F7F;width:57px;height:57.8px;')
        } else {

            if (board[r][c].classList.contains('tclicked'))
                return;
            board[r][c].setAttribute('class', 'tclicked')
            board[r][c].setAttribute('style', 'border: 3px solid #7F7F7F;width:57px;height:57.8px;')
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (r + i >= 0 && r + i < BOARDSIZE && c + j >= 0 && c + j < BOARDSIZE) {
                        checkTile(r + i, c + j);
                    }
                }
            }
        }
    }
    function revealMines() {
        for (let i = 0; i < BOARDSIZE; i++) {
            for (let j = 0; j < BOARDSIZE; j++) {
                if (mineslocation.includes(board[i][j].id)) {
                    board[i][j].setAttribute('style', 'border: 3px solid #7F7F7F;width:57px;height:57.8px;')
                    board[i][j].style.backgroundColor = "red";
                    board[i][j].innerHTML = "💣";
                }
            }
        }
    }
    function mines() {
        let mines = mineCount;
        while (mines > 0) {
            let r = Math.floor(Math.random() * BOARDSIZE);
            let c = Math.floor(Math.random() * BOARDSIZE);
            let id = r.toString() + '-' + c.toString()
            if (!mineslocation.includes(id)) {
                mineslocation.push(id);
                mines--;
            }
        }
    }
});
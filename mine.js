document.addEventListener('DOMContentLoaded', function () {
    var board = [];
    const BOARDSIZE = 8;
    var mineCount = 9;
    var mineslocation = [];
    var tilesClicked = 0;
    var flag = false;
    var gamestatus = false;



    startGame();
    mines();
    function startGame() {
        //set mine count
        document.querySelector(".mines-count").innerHTML = '00' + mineCount.toString();
        document.querySelector("#flag").addEventListener('click', flagclicked);
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
                mineCount--;
                if (mineCount >= 0)
                    document.querySelector(".mines-count").innerHTML = '00' + mineCount.toString();
                else
                    document.querySelector(".mines-count").innerHTML = '-00' + (-1 * mineCount).toString();
            }
            else if (tile.innerHTML == "🚩") {
                tile.innerHTML = "";
                mineCount++;
                if (mineCount >= 0)
                    document.querySelector(".mines-count").innerHTML = '00' + mineCount.toString();
                else
                    document.querySelector(".mines-count").innerHTML = '-00' + (-1 * mineCount).toString();
            }
            return;
        }
        if (mineslocation.includes(tile.id)) {
            if(this.innerHTML == "🚩")
                return;
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
            board[r][c].setAttribute('style', 'border: 3px solid #7F7F7F;')
        } else {

            if (board[r][c].classList.contains('tclicked'))
                return;
            board[r][c].setAttribute('class', 'tclicked')
            board[r][c].setAttribute('style', 'border: 3px solid #7F7F7F;')
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (r + i >= 0 && r + i < BOARDSIZE && c + j >= 0 && c + j < BOARDSIZE) {
                        checkTile(r + i, c + j);
                    }
                }
            }
        }
        if (tilesClicked == (BOARDSIZE * BOARDSIZE) - mineCount) {
            gamestatus = true;
            document.querySelector("#gamestatus").innerHTML = "😎"
        }
    }
    function revealMines() {
        for (let i = 0; i < BOARDSIZE; i++) {
            for (let j = 0; j < BOARDSIZE; j++) {
                if (mineslocation.includes(board[i][j].id)) {
                    board[i][j].setAttribute('style', 'border: 3px solid gray')
                    board[i][j].style.backgroundColor = "red";
                    board[i][j].innerHTML = "💣";
                }
            }
        }
    }
    function mines() {
        let mines = mineCount;
        while(mines>0)
        {
            let r = Math.floor(Math.random() * BOARDSIZE);
            let c = Math.floor(Math.random() * BOARDSIZE);
            let id = r.toString()+ '-' + c.toString()
            if(!mineslocation.includes(id))
                mineslocation.push(id);
            mines--;
        }
    }
});
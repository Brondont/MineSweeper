document.addEventListener('DOMContentLoaded', function () {
    var board = [];
    const BOARDSIZE = 8;
    var mineCount = 5;
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
            document.querySelector("#gamestatus").innerHTML = "😵";
            console.log(board);
            revealMines();
            gamestatus = true;
            return;
        }
    }
    function revealMines() {

    }

    function mines() {
        mineslocation.push("0-0");
        mineslocation.push("3-2");
        mineslocation.push("6-2");
        mineslocation.push("5-2");
        mineslocation.push("1-2");
    }
});
document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const minesField = document.querySelector(".minesField");
  const reset = document.querySelector(".reset");
  const timer = document.querySelector(".time");
  const counter = document.querySelector(".count");
  const difficulty = document.querySelector("select");

  const realMines = localStorage.getItem("realMines")
    ? localStorage.getItem("realMines")
    : 10;
  var tempMines = realMines;
  const BOARD_WIDTHX = localStorage.getItem("BOARD_WIDTHX")
    ? localStorage.getItem("BOARD_WIDTHX")
    : 9;
  const BOARD_WIDTHY = localStorage.getItem("BOARD_WIDTHY")
    ? localStorage.getItem("BOARD_WIDTHY")
    : 9;
  const TILE_DIMENSION = 28;
  var board = [];
  var minesLocations = [];
  var gameOn = false;
  var gameStarted = false;
  var mousedown = false;
  var revealedTiles = 0;

  const generateMines = () => {
    let mines = realMines;
    while (mines > 0) {
      let y = Math.floor(Math.random() * BOARD_WIDTHY);
      let x = Math.floor(Math.random() * BOARD_WIDTHX);
      let id = y.toString() + "-" + x.toString();
      if (!minesLocations.includes(id)) {
        minesLocations.push(id);
        mines--;
      }
    }
  };

  const revealMines = () => {
    board.forEach((row) => {
      row.forEach((tile) => {
        if (minesLocations.includes(tile.id)) {
          tile.setAttribute("class", "tclicked");
          tile.style.backgroundColor = "red";
          tile.innerHTML = "💣";
        }
      });
    });
    gameStarted = false;
    gameOn = false;
    reset.innerHTML = "😵";
  };

  const checkTile = (x, y) => {
    if (board[y][x].innerHTML === "🚩") return;
    // count the number of neighbouring mines
    var neighbouringMines = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          y + i < 0 ||
          y + i >= BOARD_WIDTHY ||
          x + j < 0 ||
          x + j >= BOARD_WIDTHX
        )
          continue;
        if (minesLocations.includes(y + i + "-" + (x + j))) {
          neighbouringMines++;
        }
      }
    }
    // reveal the tiles recursively according to the number of mines
    if (neighbouringMines > 0) {
      board[y][x].innerHTML = neighbouringMines;
      board[y][x].setAttribute("class", "tclicked x" + neighbouringMines);
      revealedTiles++;
    } else {
      board[y][x].setAttribute("class", "tclicked x" + neighbouringMines);
      revealedTiles++;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            y + i < 0 ||
            y + i >= BOARD_WIDTHY ||
            x + j < 0 ||
            x + j >= BOARD_WIDTHX ||
            board[y + i][x + j].classList[1]
          )
            continue;
          checkTile(x + j, y + i);
        }
      }
    }
  };

  const tileHovered = (event) => {
    if (!gameOn) return;
    const tile = event.target;
    const y = +tile.id.split("-")[0];
    const x = +tile.id.split("-")[1];

    if (mousedown && tile.innerHTML !== "🚩") {
      if (event.which === 1 && !tile.classList[1])
        tile.setAttribute("class", "tclicked");
      if (event.which === 2) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              y + i < 0 ||
              y + i >= BOARD_WIDTHY ||
              x + j < 0 ||
              x + j >= BOARD_WIDTHX
            )
              continue;
            if (
              !board[y + i][x + j].classList[1] &&
              board[y + i][x + j].innerHTML !== "🚩"
            )
              board[y + i][x + j].setAttribute("class", "tclicked");
          }
        }
      }
    }
  };

  const tileUnhovered = (event) => {
    if (!gameOn) return;
    const tile = event.target;
    const y = +tile.id.split("-")[0];
    const x = +tile.id.split("-")[1];

    if (mousedown) {
      if (event.which === 1 && !board[y][x].classList[1])
        tile.setAttribute("class", "t");
      else if (event.which === 2) {
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              y + i < 0 ||
              y + i >= BOARD_WIDTHY ||
              x + j < 0 ||
              x + j >= BOARD_WIDTHX
            )
              continue;
            if (!board[y + i][x + j].classList[1])
              board[y + i][x + j].setAttribute("class", "t");
          }
        }
      }
    }
  };

  const middleClickTile = (event) => {
    const tile = event.target;
    const y = +tile.id.split("-")[0];
    const x = +tile.id.split("-")[1];
    var surroundingMinesCount = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          y + i < 0 ||
          y + i >= BOARD_WIDTHY ||
          x + j < 0 ||
          x + j >= BOARD_WIDTHX
        )
          continue;
        if (
          event.type === "mousedown" &&
          !board[y + i][x + j].classList[1] &&
          board[y + i][x + j].innerHTML !== "🚩"
        ) {
          board[y + i][x + j].setAttribute("class", "tclicked");
        } else if (event.type === "mouseup") {
          // if it doesn't have mine count cancel middle mouse click
          if (!tile.classList[1] && !board[y + i][x + j].classList[1]) {
            board[y + i][x + j].setAttribute("class", "t");
          }
          if (board[y + i][x + j].innerHTML === "🚩") surroundingMinesCount++;
        }
      }
    }
    if (event.type !== "mouseup") return;
    var tileSurroundingMines = +tile.classList[1].split("x")[1];
    if (surroundingMinesCount === tileSurroundingMines) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            y + i < 0 ||
            y + i >= BOARD_WIDTHY ||
            x + j < 0 ||
            x + j >= BOARD_WIDTHX ||
            board[y + i][x + j].classList[1] ||
            board[y + i][x + j].innerHTML === "🚩"
          )
            continue;
          checkTile(x + j, y + i);
        }
      }
    } else {
      // cancel revealing if the flags count doesnt match the count of the mines in the tile
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            y + i < 0 ||
            y + i >= BOARD_WIDTHY ||
            x + j < 0 ||
            x + j >= BOARD_WIDTHX ||
            board[y + i][x + j].classList[1] ||
            board[y + i][x + j].innerHTML === "🚩"
          )
            continue;
          board[y + i][x + j].setAttribute("class", "t");
        }
      }
    }
  };

  const tilePressed = (event) => {
    if (!gameOn) return;
    gameStarted = true;
    const tile = event.target;

    if (event.which === 3) {
      // if the tile has a mine count cancel the click on it
      if (tile.classList[1]) return;
      if (event.type === "contextmenu") {
        event.preventDefault();
        if (event.button === 2) {
          const flagged = tile.innerHTML === "🚩";
          if (flagged) {
            tile.innerHTML = "";
            tempMines++;
          } else {
            tile.innerHTML = "🚩";
            tempMines--;
          }
          counter.innerHTML = ("00" + tempMines).slice(-3);
        }
      }
    }
    // if is a middle button event
    else if (event.which === 2) {
      if (tile.innerHTML == "🚩") return;
      middleClickTile(event);
    }
    // if is a left button event
    else if (event.which === 1) {
      if (tile.innerHTML == "🚩") return;
      // if the tile has a mine count cancel the click on it
      if (tile.classList[1]) return;
      if (event.type === "mousedown") {
        tile.setAttribute("class", "tclicked");
      } else if (event.type === "mouseup") {
        tile.setAttribute("class", "t");

        if (minesLocations.includes(tile.id)) {
          revealMines();
          return;
        }
        const cords = tile.id.split("-");
        const y = +cords[0];
        const x = +cords[1];
        checkTile(x, y);
      }
    }
    if (revealedTiles === BOARD_WIDTHX * BOARD_WIDTHY - realMines) {
      gameOn = false;
      gameStarted = false;
      reset.innerHTML = "😎";
    }
  };

  const restartGame = (event) => {
    if (!mousedown) return;
    reset.setAttribute("class", "reset");
    if (event.type === "mouseup") location.reload();
  };

  const incrementTime = () => {
    if (!gameStarted) return;
    timer.innerHTML = ("00" + (+timer.innerHTML + 1)).slice(-3);
  };

  const generateBoard = () => {
    for (let i = 0; i < BOARD_WIDTHY; i++) {
      const row = [];
      for (let j = 0; j < BOARD_WIDTHX; j++) {
        let tile = document.createElement("div");
        tile.setAttribute("id", i + "-" + j);
        tile.setAttribute("class", "t");
        tile.addEventListener("mouseover", tileHovered);
        tile.addEventListener("mouseout", tileUnhovered);
        tile.addEventListener("mousedown", tilePressed);
        tile.addEventListener("mouseup", tilePressed);
        tile.addEventListener("contextmenu", tilePressed);

        row.push(tile);
        minesField.appendChild(tile);
      }
      board.push(row);
    }
  };

  const startGame = () => {
    gameOn = true;
    body.addEventListener("mousedown", () => {
      if (!gameOn) return;
      reset.innerHTML = "😮";
      mousedown = true;
    });
    body.addEventListener("mouseup", () => {
      if (!gameOn) return;
      reset.innerHTML = "🙂";
      mousedown = false;
    });
    difficulty.addEventListener("change", () => {
      const dif = difficulty.value;
      if (dif === "easy") {
        localStorage.setItem("BOARD_WIDTHX", 9);
        localStorage.setItem("BOARD_WIDTHY", 9);
        localStorage.setItem("realMines", 10);
      } else if (dif === "intermediate") {
        localStorage.setItem("BOARD_WIDTHX", 16);
        localStorage.setItem("BOARD_WIDTHY", 16);
        localStorage.setItem("realMines", 40);
      } else if (dif === "hard") {
        localStorage.setItem("BOARD_WIDTHX", 30);
        localStorage.setItem("BOARD_WIDTHY", 16);
        localStorage.setItem("realMines", 99);
      }
      location.reload();
    });

    reset.addEventListener("mousedown", () => {
      reset.setAttribute("class", "resetClicked");
    });
    reset.addEventListener("mouseup", restartGame);
    reset.addEventListener("mouseout", restartGame);

    setInterval(incrementTime, 1000);

    counter.innerHTML = ("00" + tempMines).slice(-3);

    minesField.style.gridTemplateColumns = `repeat(${BOARD_WIDTHX}, auto)`;
    minesField.style.height = TILE_DIMENSION * BOARD_WIDTHY + "px";
    minesField.style.width = TILE_DIMENSION * BOARD_WIDTHX + "px";
    generateMines();
    generateBoard();
  };

  startGame();
});

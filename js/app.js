//------------------------------------------------
// Dom wrapper functions
//------------------------------------------------
const domGet     = x => document.querySelector(x);
const domGetAll  = x => document.querySelectorAll(x);
const domMake    = x => document.createElement(x);
const log        = x => console.log(x);

//------------------------------------------------
// Constants for control
//------------------------------------------------
const directions = {
    UP:     [0 , -1],
    DOWN:   [0 ,  1],
    LEFT:   [-1 , 0],
    RIGHT:  [ 1 , 0]
}

//------------------------------------------------
// Globally-scoped variables
//------------------------------------------------
const tileSize = 20;

let player = null;
let playerPos = [];

let mapDimensions = {
    width: 0,
    height: 0
}

let tileMap = [];
let board = null;

//------------------------------------------------
// Set up processes
//------------------------------------------------
function setDims() {
    mapDimensions.width = tileMap[0].length;
    mapDimensions.height = tileMap.length;
    board.style.width = mapDimensions.width * tileSize + "px";
    board.style.height = mapDimensions.height * tileSize + "px";
}

function buildMapFromData() {
    let arr = [];
    for (let i = 0; i < map.length; i++) {
        let row = [];
        for (let j  = 0; j < map[i].length; j++ ) {
            let tile = eval(`new ${map[i][j]}()`); // thanks thiago!
            row.push(tile);
            board.appendChild(makeTileDiv(tile.type, tile.char, j, i, tileSize));
        }
        arr.push(row);
    }
    return arr;
}

function makeTileDiv (className, innerText, xPos, yPos, size) {
    let tileDiv = domMake("div");
    tileDiv.className = `tile ${className}`;
    tileDiv.innerText = innerText;
    tileDiv.style.width = size + "px";
    tileDiv.style.height = size + "px";
    tileDiv.style.left = (size  * xPos) + "px";
    tileDiv.style.top =  (size  * yPos) + "px";
    return tileDiv;
}

//------------------------------------------------
// Updating functions
//------------------------------------------------
function drawPlayer (xPos, yPos) {
    let play = domGet("#player");
    if (play) {
        play.style.left =  (xPos * tileSize) + "px";
        play.style.top  =  (yPos * tileSize) + "px";
    }
    else {
        play = makeTileDiv("player", "@", xPos, yPos, tileSize);
        play.id = "player";
        board.appendChild(play);
    }
}

function movePlayer (dir) {
    let y = playerPos[0] + directions[dir][0];
    let x = playerPos[1] + directions[dir][1];

    if(x >= 0 && x < map[0].length) {
        if(y >= 0 && y < map.length) {
            if (tileMap[x][y].onPlayerTryEnter()) {
                playerPos = [y, x];
                drawPlayer(...playerPos);
            }
        }
    }
}

//------------------------------------------------
// Actually start the game
//------------------------------------------------
board = domGet("#gameboard");
tileMap = buildMapFromData();
setDims();
playerPos = [3, 3];
movePlayer("LEFT");
drawPlayer(...playerPos);

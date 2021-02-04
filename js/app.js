console.log("js is working!");

// HELPERS
const dGet    = x => document.querySelector(x);
const dGetAll = x => document.querySelectorAll(x);
const make    = x => document.createElement(x);
const log     = x => console.log(x);

// VARS
const tileSize = 20;
let player = null;
let playerPos = [];
let mapDimensions = {
    width: 0,
    height: 0
}

let tileMap = [];

const directions = {
    UP:     [0 , -1],
    DOWN:   [0 ,  1],
    LEFT:   [-1 , 0],
    RIGHT:  [ 1 , 0]
}


// CLASSES
class Tile {
    constructor() {
        this.type = "empty";
        this.playerCanEnter = false;
        this.char = "·"
    }
}

class Empty extends Tile {
    constructor() {
        this.type = "empty";
        this.playerCanEnter = false;
        this.char = "·"
    }
}

class Rock extends Tile {
    constructor() {
        this.type = "rock";
        this.playerCanEnter = false;
        this.char = "•"
    }
}

class Soil extends Tile {
    constructor() {
        this.type = "soil";
        this.playerCanEnter = false;
        this.char = "."
    }
}


class Grass extends Tile {
    constructor(){
        super();
        this.type = "grass";
        this.playerCanEnter = true;
        this.char = "·";
    }
}

class Wall extends Tile {
    constructor() {
        super();
        this.type = "wall";
        this.playerCanEnter = false;
        this.char = "░";
    }
}


let board = dGet("#gameboard");




function setDims(){
    mapDimensions.width = tileMap[0].length;
    mapDimensions.height = tileMap.length;

    board.style.width = mapDimensions.width * tileSize + "px";
    board.style.height = mapDimensions.height * tileSize + "px";
}


for (let i = 0; i < map.length; i++) {
    let row = [];
    for (let j  = 0; j < map[i].length; j++ ) {
        let tile = eval(`new ${map[i][j]}()`);
        row.push(tile);
        board.appendChild(makeTileDiv(tile.type, tile.char, j, i, tileSize));
    }
    tileMap.push(row);
}

tileMap = makeMap();
setDims();



function makeTileDiv (className, innerText, xPos, yPos, size) {
    let tileDiv = make("div");
    tileDiv.className = `tile ${className}`;
    tileDiv.innerText = innerText;
    tileDiv.style.width = size + "px";
    tileDiv.style.height = size + "px";
    tileDiv.style.left = (size  * xPos) + "px";
    tileDiv.style.top =  (size  * yPos) + "px";
    return tileDiv;
}


function drawPlayer (xPos, yPos) {
    let play = dGet("#player");
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

playerPos = [3,1];

drawPlayer(...playerPos);


function movePlayer (dir) {
    let y = playerPos[0] + directions[dir][0];
    let x = playerPos[1] + directions[dir][1];

    if(x >= 0 && x < map[0].length) {
        if(y >= 0 && y < map.length) {
            if (tileMap[x][y].playerCanEnter) {
                playerPos = [y, x];
                drawPlayer(...playerPos);
            }
        }
    }
}

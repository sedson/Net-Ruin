//------------------------------------------------
// Dom wrapper functions
//------------------------------------------------
const domGet     = x => document.querySelector(x);
const domGetAll  = x => document.querySelectorAll(x);
const domMake    = x => document.createElement(x);
const log        = x => console.log(x);

//------------------------------------------------
// other helpers
//------------------------------------------------
const randArr = arr => arr[Math.floor(Math.random() * arr.length)];

const setSizeAndPos = (elem, size, x, y) => {
    elem.style.left   = x * size + "px";
    elem.style.top    = y * size + "px";
    elem.style.width  = size + "px";
    elem.style.height = size + "px";
}

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
let playerInventory = [];

let mapDimensions = {
    width: 0,
    height: 0
}

let tileMap = [];
let board = null;

let warningFunc= null;

//------------------------------------------------
// Set up processes
//------------------------------------------------
function setDims() {
    mapDimensions.width = tileMap[0].length;
    mapDimensions.height = tileMap.length;
    board.style.width  = mapDimensions.width  * tileSize + "px";
    board.style.height = mapDimensions.height * tileSize + "px";
}

function buildMapFromData(data) {
    let outputMap = [];
    for (let i = 0; i < data.length; i++) {
        let row = [];
        for (let j  = 0; j < data[i].length; j++ ) {
            let tile = eval(`new ${data[i][j]}(${j}, ${i})`); // thanks thiago!
            row.push(tile);
            board.appendChild(makeTileDiv(tile.type, tile.char, j, i, tileSize));
        }
        outputMap.push(row);
    }
    return outputMap;
}

function makeTileDiv (className, innerText, xPos, yPos, size) {
    let tileDiv = domMake("div");
    tileDiv.className = `tile ${className}`;
    tileDiv.innerText = innerText;
    setSizeAndPos(tileDiv, size, xPos, yPos);
    return tileDiv;
}

function makeEntityDiv (className, innerText, xPos, yPos, size) {
    let tileDiv = domMake("div");
    tileDiv.className = `tile entity ${className}`;
    tileDiv.innerText = innerText;
    setSizeAndPos(tileDiv, size, xPos, yPos);
    return tileDiv;
}


function spawnFlowers (num) {
    for(let i = 0; i < num; i++){
        let placed = false;
        while(! placed){
            let randTile = randArr(randArr(tileMap));
            if(randTile.onPlayerTryEnter() && randTile.containedEntities.length === 0) {
                let flower = new Flower(randTile);
                randTile.containedEntities.push(flower);
                let flowerDiv = makeEntityDiv(flower.type, flower.char, randTile.x, randTile.y, tileSize);
                board.appendChild(flowerDiv);
                flower.attachToDom(flowerDiv);
                placed = true;
            }
        }
    }
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

    if(x >= 0 && x < tileMap[0].length) {
        if(y >= 0 && y < tileMap.length) {
            if (tileMap[x][y].onPlayerTryEnter()) {
                playerPos = [y, x];
                drawPlayer(...playerPos);
                perTileMessage(...playerPos)
                tileMap[x][y].onPlayerEnter();
            }
        }
    }
}

function perTileMessage (x, y) {
    let i = domGet("#info");
    i.textContent = "";
    let t = tileMap[y][x];
    log(t);
    let p = domMake("p");
    p.innerText = t.type;
    i.appendChild(p);
}

function addToInventory (entity) {
    if (entity.domElem) entity.domElem.remove();
    playerInventory.push(entity);
    perTileMessage(...playerPos);
    let list = domGet("#inventory-list");
    let li = domMake("li");
    li.innerText = entity.type;
    list.appendChild(li);
}


function blockMessage (message, duration = 2) {
    let m = domGet("#warning");
    if (m) m.remove();
    let newMessage = domMake("p");
    newMessage.id = "warning";
    newMessage.innerHTML = `<p>${message}</p>`;
    newMessage.style.animationDuration = duration + "s";
    domGet("body").appendChild(newMessage);
}

//------------------------------------------------
// Actually start the game
//------------------------------------------------
board = domGet("#gameboard");
tileMap = buildMapFromData(MAP_DATA);
spawnFlowers(9);
setDims();
playerPos = [3, 3];
movePlayer("LEFT");
drawPlayer(...playerPos);

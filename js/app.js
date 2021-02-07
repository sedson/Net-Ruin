//------------------------------------------------
// dom wrapper functions
//------------------------------------------------
const dom = {
    get:  x => document.querySelector(x),
    all:  x => document.querySelectorAll(x),
    make: x => document.createElement(x)
}

// using CSS styling to position elements
const setSizeAndPos = (elem, size, row, col) => {
    elem.style.left   = col * size + "px";
    elem.style.top    = row * size + "px";
    elem.style.width  = size + "px";
    elem.style.height = size + "px";
}

const makeTile = (row, col, size) => {
    let tile = dom.make("div");
    tile.className = "tile";
    setSizeAndPos(tile, size, row, col);
    return tile;
}

//------------------------------------------------
// Constants for control
//------------------------------------------------
const DIRS = {
    UP:     {row: -1, col:  0},
    DOWN:   {row:  1, col:  0},
    LEFT:   {row:  0, col:  1},
    RIGHT:  {row:  0, col: -1}
}

const CONTROLS = {
    "ArrowLeft":    [0, -1],
    "ArrowRight":   [0,  1],
    "ArrowUp":      [-1, 0],
    "ArrowDown":    [ 1, 0]
}

// Size of the tiles on the DOM -- in pixels
const TILE_SIZE = 20;

//------------------------------------------------
// Keeping a class to store positions -- this is more of a mental trick
// to force me to think in terms of rows and cols not X and Y
//------------------------------------------------
class Position {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    add(other) {
        return new Position(this.row + other.row, this.col + other.col);
    }
    subtract(other) {
        return new Position(this.row - other.row, this.col - other.col);
    }
    mult(fac){
        return new Position(this.row * fac, this.col * fac);
    }
}

//------------------------------------------------
// Player class
//------------------------------------------------
class Player {
    constructor(row, col, gameboard){
        this.pos = new Position(row, col);
        this.gaameboard = gameboard;
    }

    inventory = [];

    addToInventory(item){
        this.inventory.push(item);
    }

    tryMove (event) {
        if(CONTROLS.hasOwnProperty(event.key) && ! event.shiftKey){
            let movement = new Position(...CONTROLS[event.key]);
            let newPos = this.pos.add(movement);
            let checkTile = gameboard.getTile(newPos, movement);
            if (checkTile && checkTile.onPlayerTryEnter()) {
                this.pos = newPos;
                console.log(this.pos);
                this.draw();
            }
        }
    }

    draw (offset = new Position(0,0)) {
        let offsetPos = this.pos.subtract(offset);

        let playerElement = dom.get("#player");
        if (playerElement) {
            playerElement.style.left =  (offsetPos.col * TILE_SIZE) + "px";
            playerElement.style.top  =  (offsetPos.row * TILE_SIZE) + "px";
        }
        else {
            playerElement = makeTile(offsetPos.row, offsetPos.col, TILE_SIZE);
            playerElement.classList.add("player");
            playerElement.innerText = "@";
            playerElement.id = "player";
            dom.get("#gameboard").appendChild(playerElement);
        }
    }
}

//------------------------------------------------
// Gameboard Class
//------------------------------------------------
class GameBoard {
    constructor(tilemap, numRows, numCols){
        this.numRows = numRows;
        this.numCols = numCols;
        this.tilemap = tilemap;
        this.offset = new Position(0, 0);
        this.displaytiles = this.makeTileArray();
    }

    makeTileArray() {
        let arr = [];
        let gameBoardElement = dom.get("#gameboard");
        gameBoardElement.style.width  = this.numCols * TILE_SIZE + "px";
        gameBoardElement.style.height = this.numRows * TILE_SIZE + "px";

        for(let row = 0; row < this.numRows; row++){
            let rowArr = [];
            for(let col = 0; col < this.numCols; col++){
                let tile = makeTile(row, col, TILE_SIZE);
                gameBoardElement.appendChild(tile);
                rowArr.push(tile);
            }
            arr.push(rowArr);
        }
        return arr;
    }

    inBounds(pos){
        return pos.row >=0 && pos.col >=0 && pos.row < this.numRows && pos.col < this.numCols;
    }

    getTile(pos, movement){
        if(this.inBounds(pos)){
            return this.tilemap.getTile(pos.row + this.offset.row, pos.col + this.offset.col);
        } else {
            // this.shift(movement.mult(1));
            return null;
        }
    }

    shift(movement){
        this.offset = this.offset.add(movement);
        this.draw();
    }


    tryShift (event) {
        if(CONTROLS.hasOwnProperty(event.key) && event.shiftKey){
            let movement = new Position(...CONTROLS[event.key]);
            this.shift(movement);
        }
    }

    draw(){
        for(let row = 0; row < this.numRows; row++) {
            for(let col = 0; col < this.numCols; col++) {

                let dataTile = this.tilemap.getTile(row + this.offset.row, col + this.offset.col);
                let domTile  = this.displaytiles[row][col];

                domTile.className = `tile ${dataTile.type}`;
                domTile.innerText = dataTile.char;
            }
        }
    }
}


//------------------------------------------------
// Set up processes
//------------------------------------------------


function makeTileDiv (className, innerText, xPos, yPos, size) {
    let tileDiv = dom.make("div");
    tileDiv.className = `tile ${className}`;
    tileDiv.innerText = innerText;
    setSizeAndPos(tileDiv, size, xPos, yPos);
    return tileDiv;
}

function makeEntityDiv (className, innerText, xPos, yPos, size) {
    let tileDiv = dom.make("div");
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
                let flowerDiv = makeEntityDiv(flower.type, flower.char, randTile.x, randTile.y, TILE_SIZE);
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


function perTileMessage (x, y) {
    let i = dom.get("#info");
    i.textContent = "";
    let t = tileMap[y][x];
    let p = dom.make("p");
    p.innerText = t.type;
    i.appendChild(p);
}

function addToInventory (entity) {
    if (entity.domElem) entity.domElem.remove();
    playerInventory.push(entity);
    perTileMessage(...playerPos);
    let list = dom.get("#inventory-list");
    let li = dom.make("li");
    li.innerText = entity.type;
    list.appendChild(li);
}


function blockMessage (message, duration = 2) {
    let m = dom.get("#warning");
    if (m) m.remove();
    let newMessage = dom.make("p");
    newMessage.id = "warning";
    newMessage.innerHTML = `<p>${message}</p>`;
    newMessage.style.animationDuration = duration + "s";
    dom.get("body").appendChild(newMessage);
}

//------------------------------------------------
// Actually start the game
//------------------------------------------------
// domTiles = buildDomBoard();
// tileMap = buildTileMap(MAP_DATA);
// drawDomBoard(...[0,0]);
// //spawnFlowers(9);
// setDims();
// playerPos = [3, 3];
// drawPlayer();

const tileMap = new GameMap(MAP_DATA);
const gameboard = new GameBoard(tileMap, 20, 20);
gameboard.draw();
const player = new Player(3, 3, gameboard);
document.onkeydown = () => {
    player.tryMove(event);
    gameboard.tryShift(event);
}

player.draw();

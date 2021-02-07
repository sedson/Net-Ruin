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
const CONTROLS = {
    "ArrowLeft":    [0, -1],
    "ArrowRight":   [0,  1],
    "ArrowUp":      [-1, 0],
    "ArrowDown":    [ 1, 0]
}

// Size of the tiles on the DOM -- in pixels
const TILE_SIZE = 20;


//------------------------------------------------
// Keeping a class to store positions
// Basi
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
        this.gameboard = gameboard;
        this.inventory = [];

        // making the dom element and storing a refernece to it
        this.playerTile = makeTile(this.pos.row, this.pos.col, TILE_SIZE);
        this.playerTile.id = "player";
        this.playerTile.classList.add("player");
        this.playerTile.innerText = "@";
        dom.get("#gameboard").appendChild(this.playerTile);
    }

    addToInventory(item){
        this.inventory.push(item);
    }

    tryMove (event) {
        if (CONTROLS.hasOwnProperty(event.key)) {
            // get the direction from the controls array -- use spread operator to pass array as args
            let movement = new Position(...CONTROLS[event.key]);
            let newPos = this.pos.add(movement);
            let newTile = this.gameboard.getTile(newPos);

            // only try to do movement if the newTile in not null
            // and will allow the player to enter
            if (newTile && newTile.onPlayerTryEnter()) {
                // check if the player is near the edge of the game board
                // -- if they are -- shift the map, if not move
                if(this.gameboard.isBoundaryTile(newPos)){
                    this.gameboard.shift(movement);
                } else {
                    this.pos = newPos;
                    this.draw();
                }
            }
        }
    }

    draw () {
        this.playerTile.style.left =  (this.pos.col * TILE_SIZE) + "px";
        this.playerTile.style.top  =  (this.pos.row * TILE_SIZE) + "px";
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

    isBoundaryTile(pos){
        return pos.row < 2 || pos.col < 2 || pos.row >= this.numRows - 2 || pos.col >= this.numCols - 2;
    }

    getTile(pos){
        let tile = this.tilemap.getTile(pos.row + this.offset.row, pos.col + this.offset.col);
        return this.inBounds(pos) ? tile : null;
    }

    shift(movement){
        this.offset = this.offset.add(movement);
        this.draw();
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
const gameboard = new GameBoard(tileMap, 10, 20);
gameboard.draw();
const player = new Player(3, 3, gameboard);
document.onkeydown = () => { player.tryMove(event); }

player.draw();

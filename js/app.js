//------------------------------------------------
// dom wrapper functions
//------------------------------------------------
const dom = {
    get:  x => document.querySelector(x),
    all:  x => document.querySelectorAll(x),
    make: x => document.createElement(x),
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

const makeEntity = (row, col, size, type, char, board) => {
    let tile = dom.make("div");
    tile.className = `tile entity ${type}`;
    tile.innerText = char;
    setSizeAndPos(tile, size, row, col);
    dom.get("#gameboard").appendChild(tile);
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
const TILE_SIZE = 40;
const randArr = arr => arr[Math.floor(Math.random() * arr.length)];

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

    addToInventory (item) {
        this.inventory.push(item);
        GUI.reset();
        GUI.setTileInfo(this.gameboard.getTile(this.pos));
        GUI.showInventory(this.inventory);
    }

    tryMove (event) {
        GUI.reset();
        if (CONTROLS.hasOwnProperty(event.key)) {
            // get the direction from the controls array -- use spread operator to pass array as args
            let movement = new Position(...CONTROLS[event.key]);
            let newPos = this.pos.add(movement);
            let newTile = this.gameboard.getTile(newPos);

            // only try to do movement if the newTile in not null
            // and will allow the player to enter
            if (newTile && newTile.onPlayerTryEnter(this)) {
                // check if the player is near the edge of the game board
                // -- if they are -- shift the map, if not move
                if(this.gameboard.isBoundaryTile(newPos)){
                    this.gameboard.shift(movement);
                } else {
                    this.pos = newPos;
                    this.draw();
                }
            }
            gameboard.getTile(this.pos).onPlayerEnter(this);
            GUI.setTileInfo(this.gameboard.getTile(this.pos));
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
        this.boundarySize = 1;
        this.tempTiles = [];
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
        return pos.row < this.boundarySize || pos.col < this.boundarySize ||
               pos.row >= this.numRows - this.boundarySize || pos.col >= this.numCols - this.boundarySize;
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
        this.tempTiles.forEach(x => x.remove());
        this.tempTiles = [];

        for(let row = 0; row < this.numRows; row++) {
            for(let col = 0; col < this.numCols; col++) {

                let dataTile = this.tilemap.getTile(row + this.offset.row, col + this.offset.col);
                let domTile  = this.displaytiles[row][col];

                if(dataTile.containedEntities.length > 0){
                    for(let e of dataTile.containedEntities){
                        let visE = makeEntity(row, col, TILE_SIZE, e.type, e.char, this);
                        e.attachToDom(visE);
                        this.tempTiles.push(visE);
                    }
                }

                domTile.className = `tile ${dataTile.type}`;
                domTile.innerText = dataTile.char;
            }
        }
    }
}


//------------------------------------------------
// Set up processes
//------------------------------------------------

function spawnEntities (type, gamemap, num) {
    for(let i = 0; i < num; i++){
        let placed = false;
        while(! placed){
            let randTile = randArr(randArr(gamemap.tiles));
            if(randTile.containedEntities.length === 0) {
                let flower = eval(`new ${type}(randTile)`);
                randTile.containedEntities.push(flower);
                placed = true;
            }
        }
    }
}


//------------------------------------------------
// GUI Object
//------------------------------------------------
const GUI = {
    reset: () => {
        info.textContent= "";
    },

    setTileInfo: (tile) => {
        let p = dom.make("p");
        p.innerText = tile.type;
        dom.get("#info").prepend(p);
    },

    blockMessage: (message, duration = 2 ) => {
        let m = dom.get("#warning");
        if (m) m.remove();
        let newMessage = dom.make("p");
        newMessage.id = "warning";
        newMessage.innerHTML = `<p>${message}</p>`;
        newMessage.style.animationDuration = duration + "s";
        dom.get("body").appendChild(newMessage);
    },

    addItemToInfo: function () {
        let args = [...arguments];
        args.forEach(x => {
            console.log(x);
            dom.get("#info").append(x);
        });
    },

    showInventory: (itemArr) => {
        let list = dom.get("#inventory-list");
        list.textContent = "";
        for(let item of itemArr){
            list.innerHTML += (`<li>${item.type}</li>`)
        }
    }
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

//------------------------------------------------
// Actually start the game
//------------------------------------------------

const tileMap = new GameMap(MAP_DATA);
const gameboard = new GameBoard(tileMap, 20, 20);
spawnEntities("Flower", tileMap, 200);
spawnEntities("Clover", tileMap, 200);
gameboard.draw();

const player = new Player(3, 3, gameboard);
document.onkeydown = () => { player.tryMove(event); }
console.log(tileMap.tiles[1].filter(x => x.containedEntities.length > 0))

player.draw();

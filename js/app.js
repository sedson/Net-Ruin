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
    // elem.style.left   = col * size + "px";
    // elem.style.top    = row * size + "px";
    elem.style.transform = `translate(${col * size}px, ${row * size}px)`;
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
    "arrowleft":    [0, -1],
    "arrowright":   [0,  1],
    "arrowup":      [-1, 0],
    "arrowdown":    [ 1, 0],
    "w":            [-1, 0],
    "a":            [0, -1],
    "s":            [1,  0],
    "d":            [0,  1]
}

// Size of the tiles on the DOM -- in pixels
const TILE_SIZE = 40;
const randArr = arr => arr[Math.floor(Math.random() * arr.length)];

//------------------------------------------------
// Keeping a class to store [row, col] positions and clear a bit of repeated code
// could have done with arrays
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
        GUI.showInventory(this.inventory);
    }

    tryMove (event) {
        let key = event.key.toLowerCase();
        if (CONTROLS.hasOwnProperty(key)) {
            GUI.reset(); // reset GUI at beggining of update
            // get the direction from the controls array -- use spread operator to pass array as args
            let movement = new Position(...CONTROLS[key]);
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
        this.playerTile.style.transform = `translate(${this.pos.col * TILE_SIZE}px, ${this.pos.row * TILE_SIZE}px)`
        // this.playerTile.style.left =  (this.pos.col * TILE_SIZE) + "px";
        // this.playerTile.style.top  =  (this.pos.row * TILE_SIZE) + "px";
    }
}

//------------------------------------------------
// Set up processes
//------------------------------------------------
function spawnEntities (gameboard) {
    for(let row of gameboard.tilemap.tiles){
        for(let tile of row) {
            // look to see if any of the enitities should spawn here
            if(SPAWN_TABLE.hasOwnProperty(tile.type)){
                for (let potSpawn of SPAWN_TABLE[tile.type]){
                    let rand = Math.random() * 100;
                    if(rand < potSpawn.spawnRate){
                        tile.containedEntities.push(eval(`new ${potSpawn.entity}(tile)`));
                    }
                }
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
        [...arguments].forEach(x => {
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

//------------------------------------------------
// Actually start the game
//------------------------------------------------

const gameboard = new GameBoard(MAP_DATA, 12, 20);
spawnEntities(gameboard);
gameboard.draw();

const player = new Player(3, 3, gameboard);
document.onkeydown = () => { player.tryMove(event); }

player.draw();
const dialog = new Dialog(dom.get("#dialog"), dom.get("#dialog-message"), dom.get("#dialog-next"));

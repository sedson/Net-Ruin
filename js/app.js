//------------------------------------------------
// dom helper functions
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

//------------------------------------------------
// Random getters
//------------------------------------------------
const randArr = arr => arr[Math.floor(Math.random() * arr.length)];
const rand = function(){randArr([...arguments])};

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
        this.movementLocked = false;

        // making the dom element and storing a refernece to it
        this.playerTile = makeTile(this.pos.row, this.pos.col, TILE_SIZE);
        this.playerTile.id = "player";
        this.playerTile.classList.add("player");
        this.playerTile.innerText = "☺";
        this.hasCoolOutfit = false;
        dom.get("#gameboard").appendChild(this.playerTile);

        this.inventory = [];
        this.outfit = {
            head: "--",
            torso: "--",
            legs: "--",
            feet: "--"
        }
        GUI.showInventory(this.inventory);
        GUI.showOutfit(this.outfit);
        GUI.setTileInfo(this.gameboard.getTile(this.pos));
    }

    addToInventory (item) {
        this.inventory.push(item);
        this.inventory.sort((a, b) => a.type < b.type ? -1 : 1);
        GUI.showInventory(this.inventory);
    }

    tryMove (event) {
        if(! this.movementLocked){
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
                this.gameboard.getTile(this.pos).onPlayerEnter(this);

                GUI.setTileInfo(this.gameboard.getTile(this.pos));
                let coords = this.pos.add(this.gameboard.offset);
                GUI.setCoords(coords.col, coords.row);
            }
        }
    }

    draw () {
        this.playerTile.style.left =  (this.pos.col * TILE_SIZE) + "px";
        this.playerTile.style.top  =  (this.pos.row * TILE_SIZE) + "px";
    }

    validateTrade (trade) {
        return this.getNum(trade.input) >= trade.quantity;
    }

    makeTrade (trade) {
        if(this.validateTrade(trade)){
            for(let i = 0; i < trade.quantity; i++){
                this.inventory.splice(this.inventory.findIndex(x => x.type == trade.input), 1);
            }
            this.outfit[trade.type] = trade.output;
            GUI.showInventory(this.inventory);
            GUI.showOutfit(this.outfit);
            trade.accepted = true;
        }
    }

    getNum (item) {
        return this.inventory.filter(x => x.type === item).length;
    }
}

//------------------------------------------------
// Spawn the five types of entities across the map
// -- loop all tiles, and spawn objects with a po
//------------------------------------------------
function spawnEntities (gameboard) {
    for(let row of gameboard.tilemap.tiles){
        for(let tile of row) {
            // look to see if any of the enitities should spawn here
            if(SPAWN_TABLE.hasOwnProperty(tile.type)){
                for (let potentialSpawn of SPAWN_TABLE[tile.type]){
                    let rand = Math.random() * 100;
                    if(rand < potentialSpawn.spawnRate){
                        tile.containedEntities.push(eval(`new ${potentialSpawn.entity}(tile)`));
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
        dom.get("#info").textContent= "";
    },

    setTileInfo: (tile) => {
        let p = dom.make("p");
        p.innerText = tile.type;
        dom.get("#info").prepend(p);
    },

    setCoords: (x, y) =>{
        let p = dom.make("p");
        p.innerText = `LOC: ${x}, ${y}`
        p.style.color = "var(--mid2)"
        dom.get("#info").prepend(dom.make("br"));
        dom.get("#info").prepend(p);
    },

    blockMessage: (message, duration = 2 ) => {
        let m = dom.get("#warning");
        if (m) m.remove();
        let newMessage = dom.make("p");
        newMessage.id = "warning";
        newMessage.innerHTML = `<p>${message}</p>`;
        newMessage.style.animationDuration = duration + "s";
        dom.get("#info").appendChild(newMessage);
    },

    addItemToInfo: function () {
        [...arguments].forEach(x => {
            dom.get("#info").append(x);
        });
    },

    showInventory: (inventory) => {
        let list = dom.get("#inventory-list");
        list.innerText = "";
        for(let i = 0; i < inventory.length; i++){
            if (i > 0 && inventory[i].type !== inventory[i - 1].type) list.innerHTML += "<br>";
            list.innerHTML += (`<span class="inventory-item ${inventory[i].type}">${inventory[i].char}</span>`);
        }
    },

    showOutfit: (outfit) => {
        let list = dom.get("#outfit-list");
        list.textContent = "";
        for(let [key, val] of Object.entries(outfit)){
            list.innerHTML += `<p>${val}</p>`
        }

    }
}

//------------------------------------------------
// Actually start the game
//------------------------------------------------
class Game {
    constructor(){
        this.gameboard = new GameBoard(MAP_DATA, 12, 20);
        this.started = false;
        this.gameboard.offset = new Position(23, 27);
        spawnEntities(this.gameboard);

        this.player = new Player(6, 10, this.gameboard);
        // Add keyboard event listener to the document
        document.onkeydown = () => this.player.tryMove(event);
        this.dialog = new Dialog(dom.get("#dialog"), dom.get("#dialog-message"), dom.get("#dialog-next"));
        this.tradingpost = new TradingPostGUI();
    }

    start(){
        this.gameboard.draw();
        this.player.draw();
        if(! this.started ){
            this.dialog.setMessages("LOGGING ON...", `VISITOR: ${Math.floor(Math.random() * 9999)}...`,
                                    "This is NETRUIN...", "Use arrow keys or WASD to move...",
                                    "← Talk to the guide over there.")
            this.started = true;
        }
    }
}

let game = new Game();
game.start();


const store = () => {
    window.localStorage.setItem("savedGame", JSON.stringify(game));

}

const load = () => {
    let json = window.localStorage.getItem("savedGame");
    let game = JSON.parse(json);
    console.log(game);
}

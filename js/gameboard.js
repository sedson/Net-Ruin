//------------------------------------------------
// Gameboard class
// stores the tileMap containing all the tiles
//------------------------------------------------
class GameBoard {
    constructor(tileData, numRows, numCols){
        this.tilemap = new TileMap(tileData);

        this.numRows = numRows;
        this.numCols = numCols;

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
// TileMap
//------------------------------------------------
class TileMap {
    constructor(data) {
        this.tiles = this.buildGameMapFromData(data);
        this.numRows = this.tiles.length;
        this.numCols = this.tiles[0].length;
    }

    inBounds(row, col) {
        return (row >=0 && col >=0 && row < this.numRows && col < this.numCols);
    }

    getTile(row, col) {
        return this.inBounds(row, col) ? this.tiles[row][col] : new Void(-1,-1);
    }

    // method to build an array of Tile Objects from an array of strings
    // in the input array => each string must correspond to a valid tiletype
    // as described in *tiles.js*
    buildGameMapFromData(data){
        let outputTileMap = [];
        for (let row = 0; row < data.length; row++){
            let rowArr = [];
            for (let col = 0; col < data[0].length; col++){
                let tileType = data[row][col];
                // Construct a tile from the data array [THANKS THIAGO!!]
                let tile = eval(`new ${tileType}(${row}, ${col})`);
                rowArr.push(tile);
            }
            outputTileMap.push(rowArr);
        }
        return outputTileMap;
    }
}

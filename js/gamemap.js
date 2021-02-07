//------------------------------------------------
// GameMap
//------------------------------------------------
class GameMap {
    constructor(data) {
        this.tiles = this.buildGameMapFromData(data);
        this.numRows = this.tiles.length;
        this.numCols = this.tiles[0].length;
    }

    getTile(row, col) {
        // inbounds check
        if(row >= 0 && row < this.numRows && col >= 0 && col < this.numCols){
            return this.tiles[row][col];
        }
        return new Empty(-1, -1);
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

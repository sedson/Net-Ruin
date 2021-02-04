
const lookUpTable = (val) => {
    if(val < 50){
        return "Empty";
    }
    else if(val < 80){
        return "Soil"
    }
    else if (val < 105){
        return "Rock";
    }
    else if (val < 165){
        return "Grass";
    }
    else {
        return "Wall";
    }
}




function makeMap () {
    let img = document.querySelector("#map-texture")
    let canvas = document.createElement("canvas");
    let board =  document.querySelector("#gameboard");
    board.textContent = "";


    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    let tilesArray = [];

    for(let j = 0; j < img.height; j++){
        let row = [];
        for(let i = 0; i <img.width; i++){
            let pixelBrightness = canvas.getContext('2d').getImageData(i, j, 1, 1);
            let tile = eval(`new ${lookUpTable(pixelBrightness)}()`);
            row.push(tile);
            board.appendChild(makeTileDiv(tile.type, tile.char, j, i, tileSize));
        }
        tilesArray.push(row);
    }

    return tilesArray;

}

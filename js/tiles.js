//--------------------------
// Base Class
//--------------------------
class Tile {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    onPlayerTryEnter () { return false; }
    type = "";
    char = "";

    onPlayerEnter () {
        for(let entity of this.containedEntities){
            entity.playerInteraction();
        }
    }

    containedEntities = [];

    addEntity (entity) {
      this.containedEntities.push(entity);
    }

    removeEnity (entity) {
        this.containedEntities = this.containedEntities.filter(x => x !== entity);
    }
}

//--------------------------
// Empty tile
// hex: 000000
//--------------------------
class Empty extends Tile {
    constructor(x, y) {
        super(x , y);
    }

    onPlayerTryEnter () { return false; }
    type = "empty";
    char = "#";
}

//--------------------------
// Rock tile
// hex: E59281
//--------------------------
class Rock extends Tile {
    constructor(x, y) {
        super(x , y);
    }

    onPlayerTryEnter () { return false; }
    type = "rock";
    char = "∩";
}

//--------------------------
// Soil tile
// hex: E59281
//--------------------------
class Soil extends Tile {
    constructor(x, y) {
        super(x , y);
    }

    onPlayerTryEnter () { return true; }
    type = "soil";
    char = "·";
}

//--------------------------
// Grass tile
// hex: 54AF58
//--------------------------
class Grass extends Tile {
    constructor(x, y) {
        super(x , y);
    }

    onPlayerTryEnter () { return true; }
    type = "grass";
    char = "·";
}

//--------------------------
// Wall tile
// hex: FF0000
//--------------------------
class Wall extends Tile {
    constructor(x, y) {
        super(x , y);
    }

    onPlayerTryEnter () { return false; }
    type = "wall";
    char = "░░";
}

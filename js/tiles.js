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
// Base Class
//--------------------------
class StaticBlockingTile extends Tile{
    constructor (x, y) {
        super(x, y);
    }
    onPlayerTryEnter () {
        blockMessage(this.type, 1);
        return false;
    }
}

//--------------------------
// Empty tile
// hex: 000000
//--------------------------
class Empty extends StaticBlockingTile {
    constructor(x, y) {
        super(x , y);
    }
    type = "empty";
    char = "#";
}

//--------------------------
// Rock tile
// hex: E59281
//--------------------------
class Rock extends StaticBlockingTile {
    constructor(x, y) {
        super(x , y);
    }
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
class Wall extends StaticBlockingTile {
    constructor(x, y) {
        super(x , y);
    }

    onPlayerTryEnter () {
        blockMessage(this.type, 1);
        return false;
    }
    type = "wall";
    char = "░░";
}

//--------------------------
// Wall tile
// hex: FF0000
//--------------------------
class Door extends Tile {
    constructor(x, y) {
        super(x , y);
    }

    onPlayerTryEnter () {
        let unlock = playerInventory.some(x => x.type === "flower");
        if(! unlock) blockMessage("Need flower to unlock Door", 2.5);
        return unlock;
    }

    type = "door";
    char = "█";
}

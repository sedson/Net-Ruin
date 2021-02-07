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

    onPlayerEnter (player) {
        for(let entity of this.containedEntities){
            entity.playerInteraction(player);
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
    onPlayerTryEnter () {
        GUI.blockMessage(this.type, 1);
        return false;
    }
}

//--------------------------
// Empty tile
// hex: 000000
//--------------------------
class Empty extends StaticBlockingTile {
    type = "empty";
    char = "#";
}

//--------------------------
// Rock tile
// hex: E59281
//--------------------------
class Rock extends StaticBlockingTile {
    type = "rock";
    char = "∩";
}

//--------------------------
// Soil tile
// hex: E59281
//--------------------------
class Soil extends Tile {
    onPlayerTryEnter () { return true; }
    type = "soil";
    char = "·";
}

//--------------------------
// Grass tile
// hex: 54AF58
//--------------------------
class Grass extends Tile {
    onPlayerTryEnter () { return true; }
    type = "grass";
    char = "·";
}

//--------------------------
// Wall tile
// hex: FF0000
//--------------------------
class Wall extends StaticBlockingTile {
    type = "wall";
    char = "░░";
}

//--------------------------
// Wall tile
// hex: FF0000
//--------------------------
class Door extends Tile {
    onPlayerTryEnter (player) {
        let unlock = player.inventory.some(x => x.type === "flower");
        if(! unlock) GUI.blockMessage("Need flower to unlock Door", 2.5);
        return unlock;
    }
    type = "door";
    char = "█";
}

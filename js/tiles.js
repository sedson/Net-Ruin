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
// a blocking base class
//--------------------------
class StaticBlockingTile extends Tile{
    onPlayerTryEnter () {
        GUI.blockMessage(this.type, 1);
        return false;
    }
}

class Empty extends StaticBlockingTile {
    type = "empty";
    char = "#";
}

class Rock extends StaticBlockingTile {
    type = "rock";
    char = "∩";
}

class Soil extends Tile {
    onPlayerTryEnter () { return true; }
    type = "soil";
    char = "·";
}

class Grass extends Tile {
    onPlayerTryEnter () { return true; }
    type = "grass";
    char = ".";
}

class Wall extends StaticBlockingTile {
    type = "wall";
    char = "░░";
}

class Door extends Tile {
    onPlayerTryEnter (player) {
        let unlock = player.inventory.some(x => x.type === "flower");
        if(! unlock) GUI.blockMessage("Need flower to unlock Door", 2.5);
        return unlock;
    }
    type = "door";
    char = "█";
}

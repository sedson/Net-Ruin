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

class Void extends Tile {
    type = "void";
    char = "";
    onPlayerTryEnter () { return true; }
}

class Rock extends StaticBlockingTile {
    type = "rock";
    char = "∩";
}

class Soil extends Tile {
    onPlayerTryEnter () { return true; }
    type = "soil";
    char = "D";
}

class Sand extends Tile {
    onPlayerTryEnter () { return true; }
    type = "sand";
    char = "D";
}

class Grass extends Tile {
    onPlayerTryEnter () { return true; }
    type = "grass";
    char = ".";
}

class Wall extends StaticBlockingTile {
    type = "wall";
    // char = "░░";
    char = "W";
}
class TradingPost extends Tile {
    type = "trading post";
    char = "░░";
    onPlayerTryEnter(){

        return true;
    }
    onPlayerEnter(player){
        super.onPlayerEnter(player);
        tradingPostGUI.show();
    }
}

class Door extends Tile {
    onPlayerTryEnter (player) {
        let unlock = player.inventory.some(x => x.type ==="AccessCard");
        if(! unlock) GUI.blockMessage("ACCESS DENIED: this door requires an AccessCard", 2.5);
        return unlock;
    }
    type = "door";
    // char = "█";
    char = "E";
}

class Guide extends Tile {
    onPlayerTryEnter (player) { return true; }
    onPlayerEnter(){
        dialog.setMessages("Welcome to the rotting temple...")
    }
    type = "guide";
    char = "O";
}

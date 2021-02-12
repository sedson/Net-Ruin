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

class Ruin extends StaticBlockingTile {
    type = "ruin";
    char = "╪╪";
}

class Sludge extends Tile {
    onPlayerTryEnter () { return true; }
    type = "sludge";
    char = "~";
}

class Soil extends Tile {
    onPlayerTryEnter () { return true; }
    type = "soil";
    char = "·";
}

class Sand extends Tile {
    onPlayerTryEnter () { return true; }
    type = "sand";
    char = "ˆ";
}

class Path extends Tile {
    onPlayerTryEnter () { return true; }
    type = "path";
    char = "●";
}

class Grass extends Tile {
    onPlayerTryEnter () { return true; }
    type = "grass";
    char = ".";
}

class Wall extends StaticBlockingTile {
    type = "wall";
    char = "╬╬"
    // char = "╫╫";
    // char = "W";
}
class TradingPost extends Tile {
    type = "trading post";
    char = "$$";
    onPlayerTryEnter(){
        game.tradingpost.launch();
        return true;

    }
    onPlayerEnter(player){
    }
}

class Door extends StaticBlockingTile {
    onPlayerTryEnter (player) {
        super.onPlayerTryEnter();
        game.dialog.setMessages("You shoule be dressed better...", "if you want join THE CLUB.")
        return false;
    }
    type = "door";
    char = "█▐";
}

class Guide extends Tile {
    onPlayerTryEnter (player) { return true; }
    onPlayerEnter(){
        game.dialog.setMessages("wow...",
                        "you are NETRUIN's first guest in... ",
                        "well, in a pretty long time...",
                        "i have some bad news...",
                        "there's nothing going on here...",
                        "if anyone is still around...",
                        "they'll be in THE CLUB...",
                        "but...",
                        "if you want to get in to THE CLUB...",
                        "you're going to need...",
                        "a BETTER OUTFIT.",
                        )
    }
    type = "guide";
    char = "G";
}

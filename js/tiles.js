//--------------------------------------------------------
// Base Class
//--------------------------------------------------------
class Tile {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.type = "";
        this.char = "";
        this.containedEntities = [];
    }

    onPlayerTryEnter () { return true; }


    onPlayerEnter (player) {
        for(let entity of this.containedEntities){
            entity.playerInteraction(player);
        }
    }

    addEntity (entity) {
      this.containedEntities.push(entity);
    }

    removeEnity (entity) {
      this.containedEntities = this.containedEntities.filter(x => x !== entity);
    }
}

//--------------------------------------------------------
// Basic tiles
//--------------------------------------------------------
class Void extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "void";
      this.char = "";
    }

}
class Soil extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "soil";
      this.char = "ˆ";
    }
}
class Ash extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "ash";
      this.char = "‘";
    }
}
class Snow extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "snow";
      this.char = "·";
    }
}
class Sand extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "sand";
      this.char = "·";
    }
}
class Path extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "path";
      this.char = "●";
    }
}
class Sludge extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "sludge";
      this.char = "~";
    }
}
class Terra extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "terra";
      this.char = "\\";
    }
}

//--------------------------------------------------------
// Tiles that block the player
//--------------------------------------------------------
class StaticBlockingTile extends Tile{
    onPlayerTryEnter () {
        GUI.blockMessage(this.type, 1);
        return false;
    }
}
class Wall extends StaticBlockingTile {
    constructor(x, y) {
      super(x, y);
      this.type = "wall";
      this.char = "╬"
    }
}
class Ruin extends StaticBlockingTile {
    constructor(x, y) {
      super(x, y);
      this.type = "ruin";
      this.char = randArr(["╔", "╚", "╦", "╩"]);
    }
}
class Rock extends StaticBlockingTile {
    constructor(x, y) {
      super(x, y);
      this.type = "rock";
      this.char = "▲";
    }
}
class Water extends StaticBlockingTile {
    constructor(x, y) {
      super(x, y);
      this.type = "water";
      this.char = "≈";
    }
}
class Boundary extends StaticBlockingTile {
    constructor(x, y) {
      super(x, y);
      this.type = "boundary";
      this.char = "▒";
    }
}

//--------------------------------------------------------
// Tiles with special interactions
//--------------------------------------------------------
class TradingPost extends Tile {
    constructor(x, y) {
      super(x, y);
      this.type = "trading post";
      this.char = "☻";
    }
    onPlayerTryEnter(){
        game.tradingpost.launch();
        return true;
    }
}

class Club extends Tile {
    constructor(x, y) {
      super(x, y);
      this.type = "club";
      this.char = "░";
    }
    onPlayerTryEnter (player) {
        if( ! player.hasCoolOutfit){
            let coolOutfit = this.rateOutfit(player.outfit);
            if(coolOutfit) {
                game.dialog.setMessages("Welcome to THE CLUB")
                player.hasCoolOutfit = true;
                setTimeout(() => GUI.showWin(), 3000);
                return true;
            } else {
                GUI.blockMessage("THE CLUB", 1);
                game.dialog.setMessages("You need a better outfit...", "if you want to join THE CLUB")
                return false;
            }
        } else {
            return true;
        }
    }

    // this is the function that determines if an outfit is cool
    // pretty sloppy because coded late at night  : |
    // would love to clean this up
    rateOutfit (outfit) {
        let score = 0;
        let outfitArray = Object.values(outfit).filter(x => x !== "--");
        if (outfitArray.length === 4) score += 1; // add to score for complete outfit
        let allWords = outfitArray.join(' ').split(' ').filter(x => x.length > 2);
        console.log(allWords.join(' '))
        let alreadySeenWords = [];
        for(let word of allWords) {
            if (alreadySeenWords.includes(word)) {
                score += 1; // synergy boost for any matching garments
            } else {
                alreadySeenWords.push(word);
            }
            if(GARMENTS.specialWords.includes(word)) score +=1; // also add bonus for
        }
        return score >= OUTFIT_SCORE_MIN; // should not be hard coded
    }
}

class Guide extends Tile {
    constructor(x, y){
      super(x, y);
      this.type = "guide";
      this.char = "☻";
    }

    onPlayerEnter(){
        game.dialog.setMessages("wow...",
                        "so this is NETRUIN... ",
                        "ur the first new user in...",
                        "well, in a pretty long time...",
                        "i have some bad news...",
                        "theres nothing going on here...",
                        "like really nothing...",
                        "if ANYONE is still around...",
                        "theyll be in THE CLUB...",
                        "but...",
                        "if u wanna get into to THE CLUB...",
                        "ur gonna need...",
                        "a BETTER OUTFIT."
                        )
    }

}

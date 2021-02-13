//--------------------------------------------------------
// Base Class
//--------------------------------------------------------
class Tile {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    onPlayerTryEnter () { return true; }
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

//--------------------------------------------------------
// Basic tiles
//--------------------------------------------------------
class Void extends Tile {
    type = "void";
    char = "";
}
class Soil extends Tile {
    type = "soil";
    char = "ˆ";
}
class Ash extends Tile {
    type = "ash";
    char = "‘";
}
class Snow extends Tile {
    type = "snow";
    char = "·";
}
class Sand extends Tile {
    type = "sand";
    char = "·";
}
class Path extends Tile {
    type = "path";
    char = "●";
}
class Sludge extends Tile {
    type = "sludge";
    char = "~";
}
class Terra extends Tile {
    type = "terra";
    char = "\\";
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
    type = "wall";
    char = "╬"
}
class Ruin extends StaticBlockingTile {
    type = "ruin";
    char = randArr(["╔", "╚", "╦", "╩"]);
}
class Rock extends StaticBlockingTile {
    type = "rock";
    char = "▲";
}
class Water extends StaticBlockingTile {
    type = "water";
    char = "≈";
}
class Boundary extends StaticBlockingTile {
    type = "boundary";
    char = "▒";
}

//--------------------------------------------------------
// Tiles with special interactions
//--------------------------------------------------------
class TradingPost extends Tile {
    type = "trading post";
    char = "☻";
    onPlayerTryEnter(){
        game.tradingpost.launch();
        return true;
    }
}

class Club extends Tile {
    type = "club";
    char = "░";
    onPlayerTryEnter (player) {
        if( ! player.hasCoolOutfit){
            let coolOutfit = this.rateOutfit(player.outfit);
            if(coolOutfit) {
                game.dialog.setMessages("Welcome to THE CLUB")
                player.hasCoolOutfit = true;
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
        return score >= 4; // should not be hard coded
    }
}

class Guide extends Tile {
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
    type = "guide";
    char = "☻";
}

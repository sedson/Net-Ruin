// Data structure class to help manage moving these "trade offers"
// between the player and the GUI
class Trade {
    constructor (input, quantity, output, type) {
        this.input = input;
        this.quantity = quantity;
        this.output = output;
        this.type = type;
        this.accepted = false;
    }

    // made these static methods so i can call them without making a class instance
    static makeRandomTrade (garmentType) {
        let input = randArr(ITEM_NAMES);
        let rare = Math.random() > 0.75;
        let quantity = rare ? 3 : 1;
        let garment = Trade.makeGarment(garmentType, rare);
        return new Trade(input, quantity, garment, garmentType);
    }

    static makeGarment (type, isRare) {
        let description = isRare ? randArr(GARMENTS.specialWords) + " " : "";
        let garment = `${description}${randArr(GARMENTS.colors)} ${randArr(GARMENTS[type])}`;
        if (garment[garment.length - 1] !== "s") {
            if(["a", "e", "i", "o", "u"].some(x => x === garment[0])){
                garment = "an " + garment;
            } else {
                garment = "a " + garment;
            }
        }
        return garment;
    }
}

// Manager class that wraps the GUI for the trading post
class TradingPostGUI {
    constructor (){
        this.container = dom.get("#trade");
        this.text = dom.get("#trade-message");
        this.closeButton = dom.get("#trade-close");
        this.acceptButton = dom.get("#trade-accept");
        this.tradeIndex = 0;

        // listeners
        dom.get("#trade a.next").addEventListener("click", () => this.next());
        dom.get("#trade a.prev").addEventListener("click", () => this.prev());
        this.closeButton.addEventListener("click", () => this.close());
        this.acceptButton.addEventListener("click", () => this.accept());

        // populating the initial trades
        this.tradeOptions = [];
        for(let garmentType of GARMENT_TYPES){
            this.tradeOptions.push(Trade.makeRandomTrade(garmentType));
        }
    }

    // Called when player enters the tile
    launch (){
        this.updateTrades();
        this.show();
    }

    // Replenishes the already completed trades with new ones
    updateTrades () {
        for(let i = 0; i < this.tradeOptions.length; i++){
            if(this.tradeOptions[i].accepted){
                this.tradeOptions[i] = Trade.makeRandomTrade(this.tradeOptions[i].type)
            }
        }
    }

    // Manipulates the GUI to show properly for current trade
    show () {
        this.container.style.display = "block";

        // Get the currently viewed trade
        let trade = this.tradeOptions[this.tradeIndex];
        this.text.innerHTML = this.tradeToText(trade);

        // Has the player already made this trade?
        this.container.className = (trade.accepted) ? "accepted" : "";

        if (trade.accepted) {
            this.acceptButton.style.display = "none";
        }

        else if (game.player.validateTrade(trade)) { // check if player has items for this trade
            this.acceptButton.style.display = "block";
            this.acceptButton.className = "";
            this.acceptButton.innerText = `Trade`
        } else {
            this.acceptButton.style.display = "block";
            this.acceptButton.className = "invalid";
            this.acceptButton.innerText = this.tradeToTextFail(trade);
        }

        // no moving while the trading GUI is showing
        game.player.movementLocked = true;
    }

    // turns trade data structure into string
    tradeToText (trade) {
        return `${this.tradeIndex + 1}/${this.tradeOptions.length}<br>
                Listing : <em>${trade.output}</em><br>Cost : <em><span class="${trade.input}">${ITEM_CHARS[trade.input]}</span> ${trade.input} ×${trade.quantity}</em>`
    }

    // turns trade data structure into string if player cannot make trade
    tradeToTextFail (trade) {
        let plural = (trade.quantity > 1) ? "s" : "";
        return `${game.player.getNum(trade.input)} of ${trade.quantity} ${trade.input + plural} needed.`
    }

    // close the popup
    close () {
        this.container.style.display = "none";
        game.player.movementLocked = false;
    }

    // navigating through the trades
    next () {
        this.tradeIndex = (this.tradeIndex + 1 + this.tradeOptions.length) % this.tradeOptions.length;
        this.show();
    }

    prev () {
        this.tradeIndex = (this.tradeIndex + -1 + this.tradeOptions.length) % this.tradeOptions.length;
        this.show();
    }

    // player has made trade
    accept () {
        game.player.makeTrade(this.tradeOptions[this.tradeIndex])
        this.show();
    }
}

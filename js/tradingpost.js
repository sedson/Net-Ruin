class Trade {
    constructor (input, quantity, output, type) {
        this.input = input;
        this.quantity = quantity;
        this.output = output;
        this.type = type;
        this.accepted = false;
    }
}

class TradingPostGUI {
    constructor (){
        this.container = dom.get("#trade");
        this.text = dom.get("#trade-message");
        this.closeButton = dom.get("#trade-close");
        this.acceptButton = dom.get("#trade-accept");
        this.tradeIndex = 0;
        dom.get("#trade a.next").addEventListener("click", () => this.next());
        dom.get("#trade a.prev").addEventListener("click", () => this.prev());
        this.closeButton.addEventListener("click", () => this.close());
        this.acceptButton.addEventListener("click", () => this.accept());

        this.tradeOptions = [];
        for(let i = 0; i < 10; i++){
            let type = randArr(["head", "torso", "legs", "feet"])
            let trade = new Trade("flower", 2, this.makeGarment(type, 0.1), type);
            this.tradeOptions.push(trade);
        }
    }

    updateTrades () {
        for(let i = 0; i < this.tradeOptions.length; i++){
            if(this.tradeOptions[i].accepted){
                let type = randArr(["head", "torso", "legs", "feet"])
                this.tradeOptions[i] = new Trade("flower", 2, this.makeGarment(type, 0.1), type);
            }
        }
    }

    launch (){
        this.updateTrades();
        this.show();
    }

    show (){
        this.container.style.display = "block";

        let trade = this.tradeOptions[this.tradeIndex];
        this.text.innerHTML = this.tradeToText(trade);
        this.container.className = (trade.accepted) ? "accepted" : "";

        if(trade.accepted){
            this.acceptButton.style.display = "none";
        }
        else if (game.player.validateTrade(trade)) {
            this.acceptButton.style.display = "block";
            this.acceptButton.className = "";
            this.acceptButton.innerText = `Trade`
        } else {
            this.acceptButton.style.display = "block";
            this.acceptButton.className = "invalid";
            let plural = (trade.quantity > 1) ? "s" : "";
            this.acceptButton.innerText = `${game.player.getNum(trade.input)} of ${trade.quantity} ${trade.input + plural} needed.`
        }

        game.player.movementLocked = true;
    }

    tradeToText (trade) {
        return `${this.tradeIndex + 1}/${this.tradeOptions.length}<br>
                Listing: <em>${trade.output}</em><br>Cost: <em><span class="${trade.input}">${ITEM_CHARS[trade.input]}</span> ${trade.input} ×${trade.quantity}</em>`
    }

    close () {
        this.container.style.display = "none";
        game.player.movementLocked = false;
    }

    next () {
        this.tradeIndex = (this.tradeIndex + 1 + this.tradeOptions.length) % this.tradeOptions.length;
        this.show();
    }

    prev () {
        this.tradeIndex = (this.tradeIndex + -1 + this.tradeOptions.length) % this.tradeOptions.length;
        this.show();
    }

    accept () {
        game.player.makeTrade(this.tradeOptions[this.tradeIndex])
        this.show();
    }

    makeGarment (type, rareness) {
        let article = (type === "top" || type === "accessory") ? "a" : "";
        let description = (Math.random() < rareness) ? randArr(GARMENTS.specialWords) : "";
        return `${article} ${description} ${randArr(GARMENTS.colors)} ${randArr(GARMENTS[type])}`;
    }
}

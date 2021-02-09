class TradingPostGUI {
    constructor (){
        this.container = dom.get("#trade");
        this.text = dom.get("#trade-message");
        this.closeButton = dom.get("#trade-close");
        this.acceptButton = dom.get("#trade-accept");
        this.tradeIndex = 0;
        dom.get("#trade a.next").addEventListener("click", () => this.next());
        dom.get("#trade a.prev").addEventListener("click", () => this.prev());
        dom.get("#trade-close").addEventListener("click", () => this.close());
        this.acceptButton.addEventListener("click", () => this.accept());
    }

    show (){
        this.container.style.display = "block";

        let trade = TRADES[this.tradeIndex]
        this.text.innerHTML = this.tradeToText(trade);

        this.container.className = (trade.accepted) ? "accepted" : "";

        if(trade.accepted){
            this.acceptButton.style.display = "none";
        }
        else if (player.validateTrade(trade)) {
            this.acceptButton.style.display = "block";
            this.acceptButton.className = "";
            this.acceptButton.innerText = `Trade`
        } else {
            this.acceptButton.style.display = "block";
            this.acceptButton.className = "invalid";
            this.acceptButton.innerText = `${player.getNum(trade.input)} of ${trade.quantity} ${trade.input} needed.`
        }

        player.movementLocked = true;
    }

    tradeToText(trade){
        return `${this.tradeIndex + 1}/${TRADES.length}<br>
                Offering <em>${trade.output}</em> for <em>${trade.input} (x${trade.quantity})</em>`
    }

    close () {
        this.container.style.display = "none";
        player.movementLocked = false;

    }

    next(){
        this.tradeIndex = (this.tradeIndex + 1 + TRADES.length) % TRADES.length;
        this.show();
    }

    prev(){
        this.tradeIndex = (this.tradeIndex + -1 + TRADES.length) % TRADES.length;
        this.show();
    }

    accept(){
        player.makeTrade(TRADES[this.tradeIndex])
        this.show();
    }
}

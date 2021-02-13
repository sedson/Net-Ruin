class Dialog {
    constructor(){
        this.container = dom.get("#dialog");
        this.text = dom.get("#dialog-message");
        dom.get("#dialog-next").addEventListener("click", () => this.nextMessage());

        this.messages = []
        this.messageIndex = 0;
        this.letterIndex = 0;
    }

    setMessages(){
        this.messages = [...arguments];
        this.messageIndex = 0;
        this.letterIndex = 0;
        this.container.style.display = "block"
        game.player.movementLocked = true;
        this.typeMessage();
    }

    typeMessage(){
        if(this.letterIndex < this.messages[this.messageIndex].length){
            this.letterIndex++;
            this.text.innerText = this.messages[this.messageIndex].substring(0, this.letterIndex);
            // Calls the next letter every 40 milliseconds
            setTimeout(this.typeMessage.bind(this), 40); // why?
        }
    }

    nextMessage(){
        // if next is called while a message is still typing, finsih the the line
        if(this.letterIndex < this.messages[this.messageIndex].length){
            this.letterIndex = this.messages[this.messageIndex].length - 1;
            this.text.innerdialog = this.messages[this.messageIndex];
        }
        // else go to the next line, unless there are no more dialog lines, then close the dialog.
        else {
            this.messageIndex++;
            if (this.messageIndex < this.messages.length) {
                this.letterIndex = 0;
                this.typeMessage();
            } else {
                this.container.style.display = "none";
                game.player.movementLocked = false;
            }
        }
    }
}

class Dialog {
    constructor(container, text, button){
        this.container = container;
        this.text = text;
        this.messages = []
        this.messageIndex = 0;
        this.letterIndex = 0;
        this.button = button;
        this.button.addEventListener("click", () => this.nextMessage());
    }

    setMessages(){
        this.messages = [...arguments];
        console.log(this.messages)
        this.messageIndex = 0;
        this.letterIndex = 0;
        this.container.style.display = "block"
        this.typeMessage();
    }

    typeMessage(){
        if(this.letterIndex < this.messages[this.messageIndex].length){
            this.letterIndex++;
            this.text.innerText = this.messages[this.messageIndex].substring(0, this.letterIndex);
            setTimeout(this.typeMessage.bind(this), 80); //why?
        }
    }

    nextMessage(){
        if(this.letterIndex < this.messages[this.messageIndex].length){
            this.letterIndex = this.messages[this.messageIndex].length - 1;
            this.text.innerdialog = this.messages[this.messageIndex];
        }
        else {
            this.messageIndex++;
            if (this.messageIndex < this.messages.length) {
                this.letterIndex = 0;
                this.typeMessage();
            } else {
                this.container.style.display = "none";
            }
        }
    }
}

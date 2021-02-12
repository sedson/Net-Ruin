class Entity {
    constructor (tile) {
        this.parentTile = tile;
        this.domElems = [];
    }
    playerInteraction(player) {
        let par = document.createElement("p");
        par.innerText = ">";
        let par2 = document.createElement("p");
        par2.innerText = this.type;
        GUI.addItemToInfo(par, par2);
    }
    type = "";
    char = "";

    attachToDom() {
        [...arguments].forEach(item => this.domElems.push(item));
    }
}

class PlantEntity extends Entity {
    playerInteraction(player) {
        let par = document.createElement("p");
        par.innerText = ">";
        let par2 = dom.make("p");
        par2.className = `${this.type}`
        let par3 = dom.make("p");
        par3.innerText = this.type;
        par2.innerText = this.char;
        let link = document.createElement("a");
        link.innerText = "Pick Up";


        link.addEventListener("click", () => {
            player.addToInventory(this);
            this.parentTile.removeEnity(this);
            this.domElems.forEach(x => x.remove());
        });

        this.attachToDom(par, par2, par3, link);
        GUI.addItemToInfo(par, par2, par3, link);
    }
}

class Flower extends PlantEntity {
    type = "flower"
    char = "*";
}

class Gem extends PlantEntity {
    type = "gem"
    char = "♦";
}

class Terminal extends Entity {
    type = "terminal"
    char = "T"
    playerInteraction(player){
        super.playerInteraction(player);
        dialog.setMessages("Welcome...", "Stay a while...");
    }
}

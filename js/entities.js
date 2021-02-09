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

    attachToDom(domElem) {
        this.domElems.push(domElem)
    }
}

class PlantEntity extends Entity {
    playerInteraction(player) {
        let par = document.createElement("p");
        par.innerText = ">";
        let link = document.createElement("a");
        link.innerText = this.type;
        this.attachToDom(par);
        this.attachToDom(link);

        link.addEventListener("click", () => {
            player.addToInventory(this);
            this.parentTile.removeEnity(this);
            this.domElems.forEach(x => x.remove());
        });

        GUI.addItemToInfo(par, link);
    }
}

class Flower extends PlantEntity {
    type = "flower"
    char = "F";
}

class Clover extends PlantEntity {
    type = "clover"
    char = 'F';
}

class Terminal extends Entity {
    type = "terminal"
    char = "T"
    playerInteraction(player){
        super.playerInteraction(player);
        dialog.setMessages("Welcome...", "Stay a while...");
    }
}

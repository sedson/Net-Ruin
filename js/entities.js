class Entity {
    constructor (tile) {
        this.parentTile = tile;
    }
    playerInteraction() {

    }
    type = "";
    char = "";

    attachToDom(domElem) {
        this.domElem = domElem;
    }
}

class PlantEntity extends Entity {
    playerInteraction(player) {
        let par = document.createElement("p");
        par.innerText = ">";
        let link = document.createElement("a");
        link.innerText = this.type;

        link.addEventListener("click", () => {
            player.addToInventory(this);
            this.parentTile.removeEnity(this);
            this.domElem.remove();
        });

        GUI.addItemToInfo(par, link);
    }
}

class Flower extends PlantEntity {
    type = "flower"
    char = "*";
}

class Clover extends PlantEntity {
    type = "clover"
    char = "♣";
}

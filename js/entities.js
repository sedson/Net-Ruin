const SPAWN_TABLE = {
    soil: [
        { entity: "Flower", spawnRate: 10 }
    ],
    grass: [
        { entity: "Clover", spawnRate: 10 }
    ]
}

class Entity {
    constructor (tile) {
        this.parentTile = tile;
        this.domElems = [];
    }
    playerInteraction() {

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
    char = "*";
}

class Clover extends PlantEntity {
    type = "clover"
    char = '"';
}

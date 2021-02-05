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

class Flower extends Entity {
    constructor (tile) {
        super(tile);
    }
    type = "flower"
    char = "*";

    playerInteraction() {
        let info = document.querySelector("#info");
        let p = document.createElement("p");
        p.innerText = ">";
        let a = document.createElement("a");
        a.innerText = this.type;

        a.addEventListener("click", () => {
            addToInventory(this);
            log(this);
            this.parentTile.removeEnity(this);
        });

        info.appendChild(p);
        info.appendChild(a);
    }


}

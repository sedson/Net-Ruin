class Entity {
    constructor (tile) {
        this.parentTile = tile;
        this.domElems = [];
        this.type = "";
        this.char = "";
    }
    // Creates a DOM button to display and pick up this enity
    playerInteraction(player) {
        let arrow = document.createElement("p");
        arrow.innerText = ">";

        let entityIcon = dom.make("p");
        entityIcon.className = `${this.type}`; // give it the type as a class so it gets css colors
        entityIcon.innerText = this.char;

        let entityName = dom.make("p");
        entityName.innerText = this.type + " :";

        let pickUpButton = document.createElement("a");
        pickUpButton.innerText = "Pick Up";
        pickUpButton.addEventListener("click", () => {
            player.addToInventory(this);
            this.parentTile.removeEnity(this);
            this.domElems.forEach(x => x.remove());
        });

        // add the e;ems to this set of tracked objects to delete
        this.domElems.push(arrow, entityIcon, entityName, pickUpButton);

        // Add them to dom
        GUI.addItemToInfo(arrow, entityIcon, entityName, pickUpButton);
    }
}

class Flower extends Entity {
    constructor(x, y) {
      super(x, y);
      this.type = "flower";
      this.char = "*";
    }
}
class Gem extends Entity {
    constructor(x, y) {
      super(x, y);
      this.type = "gem";
      this.char = "♦";
    }
}
class Ring extends Entity {
    constructor(x, y) {
      super(x, y);
      this.type = "ring";
      this.char = "◦";
    }
}
class Shine extends Entity {
    constructor(x, y) {
      super(x, y);
      this.type = "shine";
      this.char = "☼";
    }
}
class Apple extends Entity {
    constructor(x, y) {
      super(x, y);
      this.type = "apple";
      this.char = "•";
    }
}

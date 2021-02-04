# Project 1 – ASCII Adventure Game

This is a game about exploring a map in order to find lost items. The game will be based on a grid of divs and use simple ASCII-style graphics (see references at bottom).

## Wireframes

Elements of game
![Basic](images/wf1.png)

Modal Dialog for special events
![With Dialog](images/wf2.png)

## User Story

Users can expect to -
1. Read introduction and click *Generate World* button.
1. Move a character across tiles using keyboard arrow keys or movement buttons on the DOM.
1. Move into a new section of the world when they reach the edge of the map.
1. Not be able to move to unreachable tiles - like walls and rocks
1. Hover on tiles to see a few stats about tile such as type (ie, wall, rock, soil...) and contents
1. Move into special tiles to trigger events like talking to characters, reading hints... These interactions will launch modal dialogs with further options like "Pick up Stone"...
1. See inventory of objects on the screen
1. Be directed to a nice winning dialog screen once they have collected al the lost items

## MVP

-  Map of world is small and stored in a predetermined text format datafile. The app would read this data and properly build a grid
-  User interacts with 5 to 10 different dynamic objects – whose positions are randomized – to find a single lost item.

## Stretch Goals

-  Map of world is a a predetermined image file. The app would read this image pixel by pixel and build the gameplay map based on a lookup table of colors that correspond to object types.
-  User interacts with 10 to 20 different dynamic objects to find 2 items.

## Super Stretchy Goals (maybe for after)

-  Map of world is procedurally generated following a clear set of rules. Dynamic objects are spawned based on probabilities and rules.
-  There are many many objects to find and user can keep playing as long as they want.
-  Buildings that the player can enter - look dark from outside, but when enter, the rest of the map goes dark.
-  design a custom font so that instead of ASCII i can get a series of custom sprites with color very easily

## Implementation Thoughts

In JS: 2D array of TILES
```javascript
// pseudocode
Tile {
  type: soil, //soil, wall, rock, sludge, etc
  playerCanEnter: true, // bool
  playerHasEntered: false, // bool
  containedItems: [], // arr of objects
  char: "#", // display character on Map
  onPlayerEnter: () => {} // callback
  onPlayerTryEnter: () => {} // callback
}

```
Main game loop functions
```javascript

move = (left, right, up, or down) => {
  // does tile exist in grid
  // can player enter
  // update position of player
  // call tile callback if exists
  // look for objects and their callbacks if they exist
}

updateTileGrid = () => {
  // somehow loop over all the tiles divs in the dom and up those to be a new set
  // of tiles from the data based on an offset value

}

//methods for populating and showing the modal dialog
//filling / updating the inventory
```

## Graphics references

Permaculture Network - [Link](http://root.schloss-post.com/)

![Permaculture Network](images/permaculture.png)

Dwarf Fortress

![Dwarf Fortress](images/DFascii3.png)


const tiles = [grass, wall, .....]


foreach of those => let x = new tiles[1]()

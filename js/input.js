document.onkeydown = checkKey;

function checkKey(event){
  switch (event.key) {
    case "ArrowLeft":
        movePlayer("LEFT");
        break;

    case "ArrowRight":
        movePlayer("RIGHT");
        break;

    case "ArrowUp":
        movePlayer("UP");
        break;

    case "ArrowDown":
        movePlayer("DOWN");
        break;
  }
}

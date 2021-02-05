// Events -- load after app.js

document.onkeydown = checkKey;

function checkKey(event) {
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


// https://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
    e.preventDefault();
    }
}, false);


// domGet("#gameboard").addEventListener("mouseover", function(event) {
//     domGet("#tip").innerText = event.target.className.split(' ').filter(x => x != "tile").join(" ").toUpperCase();
// });

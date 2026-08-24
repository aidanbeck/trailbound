import Theatre from '../easel/Theatre.js';

const tileSize = 16;
const gridSize = 9;


// Theatre Setup
const canvasElement = document.getElementById("theatre");
const theatre = new Theatre(canvasElement, tileSize * gridSize, tileSize * gridSize);
const ctx = theatre.ctx;
theatre.origin = "CENTER";
theatre.makeFullScreen();
theatre.shorterDimensionConsistent = true;
theatre.canvas.style.backgroundColor = "#f8f9fa";
theatre.ctx.imageSmoothingEnabled = false; //prevent image blurring
theatre.redraw = render;

// Interaction
theatre.addEventListener("pointerdown", () => {mouseDown = true});
theatre.addEventListener("pointerup", () => {mouseDown = false});
theatre.addEventListener("pointermove", pointerMove);

// State
let mouseDown = false;

function pointerMove(event) {
    let {x, y} = theatre.getEventCoordinates(event);
    
    if (mouseDown) {
    
        const tile = getTileCoordinate(x, y);
        ctx.clearRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
    }
}

const gridPixelSize = gridSize * tileSize;
function render() {
    ctx.translate(-gridPixelSize/2, -gridPixelSize/2);

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
        }
    }
}

function getTileCoordinate(x, y) {
    return {
        x: Math.floor(x / tileSize),
        y: Math.floor(y / tileSize)
    }
}
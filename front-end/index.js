import Theatre from './easel/Theatre.js';
import getState from './trailbound.js';

const TILE_SIZE = 16;
const GRID_SIZE = 9;

// Theatre Setup
const canvasElement = document.getElementById("theatre");
const theatre = new Theatre(canvasElement, TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
const ctx = theatre.ctx;
// theatre.origin = "CENTER";
theatre.makeFullScreen();
theatre.shorterDimensionConsistent = true;
theatre.canvas.style.backgroundColor = "#f8f9fa";
theatre.ctx.imageSmoothingEnabled = false; //prevent image blurring
canvasElement.style.imageRendering = 'pixelated'; //prevent image blurring;
theatre.redraw = render;
window.onload = () => { theatre.redraw(); }



// ---

const { world, view } = getState();
let mouseButton = -1;

function render() {

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const floor = view.floors[j * GRID_SIZE + i];
            const tile = view.tiles[j * GRID_SIZE + i];

            const floorType = world.floorTypes[floor];
            const tileType = world.tileTypes[tile];

            floorType && floorType.texture.draw(i * TILE_SIZE, j * TILE_SIZE, 0, ctx);
            tileType && tileType.texture.draw(i * TILE_SIZE, j * TILE_SIZE, 0, ctx);


        }
    }
}

function pointerDown(e) { mouseButton = e.button; }
function pointerUp(e) {

    if (mouseButton == 2 || event.type == 'dblclick') {
        let {x, y} = theatre.getEventCoordinates(e);
        let tile = getTileCoordinate(x, y, TILE_SIZE);

        tile.x -= 4;
        tile.y -= 4;

        view.setView(tile.x, tile.y);
        view.updateView(world);
        render();
    }

    mouseButton = -1;
}
function pointerMove(e) {
    let {x, y} = theatre.getEventCoordinates(e);

    const tile = getTileCoordinate(x, y, TILE_SIZE);
    mouseButton == 0 && world.setFloor(tile.x, tile.y, 1);

    view.updateView(world);
    render();
}

function getTileCoordinate(x, y, cellSize) {

    return {
        x: Math.floor(x / cellSize) + view.x,
        y: Math.floor(y / cellSize) + view.y
    }
}

// Interaction
theatre.addEventListener("pointerdown", (e) => pointerDown(e) );
theatre.addEventListener("pointerup",   (e) => pointerUp(e));
theatre.addEventListener("dblclick",    (e) => pointerUp(e));
theatre.addEventListener("pointermove", (e) => pointerMove(e));
theatre.addEventListener("contextmenu", (e) => e.preventDefault());
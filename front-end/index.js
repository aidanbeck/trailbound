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

// Interaction
// theatre.addEventListener("pointerdown", () => {mouseDown = true});
// theatre.addEventListener("pointerup", () => {mouseDown = false});
// theatre.addEventListener("pointermove", pointerMove);

// ---

const { world, view } = getState();

function render() {

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const floor = view.floors[i * GRID_SIZE + j];
            const tile = view.tiles[i * GRID_SIZE + j];

            const floorType = world.floorTypes[floor];
            const tileType = world.tileTypes[tile];

            floorType.texture.draw(j * TILE_SIZE, i * TILE_SIZE, 0, ctx);
            tileType && tileType.texture.draw(j * TILE_SIZE, i * TILE_SIZE, 0, ctx);

        }
    }

}
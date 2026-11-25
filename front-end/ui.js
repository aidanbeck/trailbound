/*
    Input handling & visual rendering
*/

import Theatre from '../easel/Theatre.js';
import { tileTypes, floorTypes, mobileTypes } from './trailboundTypes.js';
import { TILE_SIZE, GRID_SIZE } from './config.js';
import { view, setView, setTile, setFloor, moveMobile } from './index.js';

// Theatre & UI
const canvasElement = document.getElementById("theatre");
const theatre = new Theatre(canvasElement, TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
const ctx = theatre.ctx;
theatre.shorterDimensionConsistent = true;
theatre.canvas.style.backgroundColor = "#f8f9fa";
theatre.ctx.imageSmoothingEnabled = false; // prevent image blurring
canvasElement.style.imageRendering = 'pixelated'; // prevent image blurring;
theatre.canvas.style.width = "100vw"
theatre.canvas.style.maxHeight = '100vh';
theatre.redraw = () => { render(view); };
window.onload = () => { theatre.redraw(); }

// Listeners
theatre.addEventListener("pointerdown", (e) => pointerDown(e) );
theatre.addEventListener("pointerup",   (e) => pointerUp(e));
theatre.addEventListener("dblclick",    (e) => pointerUp(e));
theatre.addEventListener("pointermove", (e) => pointerMove(e));
theatre.addEventListener("contextmenu", (e) => e.preventDefault());
document.addEventListener('keydown', cycleSelectedTileType);
inventory.addEventListener('click', cycleSelectedTileType);

// Interaction State
let mouseButton = -1;
let selectedMobile = null;
let selectedType = 0;
let typesCount = 8;

// Interaction Logic
function pointerDown(e) {
    let {x, y} = theatre.getEventCoordinates(e);
    let tile = getTileCoordinate(x, y, TILE_SIZE);

    for (const mobileId in view.mobiles) {
        const mobile = view.mobiles[mobileId];
        if (mobile.x == tile.x && mobile.y == tile.y) {
            selectedMobile = mobile.id;
        }
    }

    mouseButton = e.button;
    pointerMove(e);
}

function pointerUp(e) {
    if (mouseButton == 2 || event.type == 'dblclick') {
        let {x, y} = theatre.getEventCoordinates(e);
        let tile = getTileCoordinate(x, y, TILE_SIZE);

        const offsetX = Math.floor(view.width / 2);
        const offsetY = Math.floor(view.height / 2);

        setView(tile.x - offsetX, tile.y - offsetY);
    }
    mouseButton = -1;
    selectedMobile = null;
}

function pointerMove(e) {
    let {x, y} = theatre.getEventCoordinates(e);

    let tile = getTileCoordinate(x, y, TILE_SIZE);

    if (selectedMobile) {
        moveMobile(selectedMobile, tile.x, tile.y);
        return;
    }

    if (mouseButton == 0) {
        setTile(tile.x, tile.y, selectedType);
    }
}

function cycleSelectedTileType() {
    selectedType++;
    if (selectedType > typesCount) {
        selectedType = 0;
        inventory.src = "front-end/images/rachel.png";
    } else {
        inventory.src = tileTypes[selectedType].texture.image.src;
    }
}

// Helpers
function getTileCoordinate(x, y, cellSize) {
    return {
        x: view.x + Math.floor(x / cellSize),
        y: view.y + Math.floor(y / cellSize)
    }
}


// Rendering
const width = theatre.canvas.width;
const height = theatre.canvas.height;
const floorBuffer = new OffscreenCanvas(width, height);
const floorCtx = floorBuffer.getContext("2d");
const tileBuffer = new OffscreenCanvas(width, height);
const tileCtx = tileBuffer.getContext("2d");
function render(view) {

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const index = i * GRID_SIZE + j;

            const floor = view.floors[index];
            const floorType = floorTypes[floor];
            floorType && floorType.texture.draw(j*TILE_SIZE, i*TILE_SIZE, 0, floorCtx);

            const tile = view.tiles[index];
            const tileType = tileTypes[tile];
            tileType && tileType.texture.draw(j*TILE_SIZE, i*TILE_SIZE, 0, tileCtx);
        }
        renderMobiles(view, i, tileCtx);
    }

    ctx.drawImage(floorBuffer.transferToImageBitmap(), 0, 0);
    ctx.drawImage(tileBuffer.transferToImageBitmap(), 0, 0);
}

// Hacky, will be refactored as mobiles change. Good enough for now.
function renderMobiles(view, i, tileCtx) {
    for (const mobileId in view.mobiles) {
                
        const mobile = view.mobiles[mobileId];
        const mobileX = mobile.x - view.x;
        const mobileY = mobile.y - view.y;
        const mobileType = mobileTypes[mobile.mobileType];

        // Render only if on the same y level as the tile and within screen width.
        if (mobileX < 0 || mobileX >= view.width) { continue; }
        if (mobileY != i) { continue; }
                
        mobileType && mobileType.texture.draw(mobileX * TILE_SIZE, mobileY * TILE_SIZE, 0, tileCtx);
    }
}

export default render;
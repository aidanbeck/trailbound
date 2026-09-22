import Theatre from './easel/Theatre.js';
import Client from './trailbound/Client.js';
import { tileTypes, floorTypes, mobileTypes } from './trailboundTypes.js';
import { LAN, TILE_SIZE, GRID_SIZE } from './config.js';


// Theatre Setup

const canvasElement = document.getElementById("theatre");
const theatre = new Theatre(canvasElement, TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
const ctx = theatre.ctx;
// theatre.origin = "CENTER";
// theatre.makeFullScreen();
theatre.shorterDimensionConsistent = true;
theatre.canvas.style.backgroundColor = "#f8f9fa";
theatre.ctx.imageSmoothingEnabled = false; // prevent image blurring
canvasElement.style.imageRendering = 'pixelated'; // prevent image blurring;
theatre.canvas.style.width = "100vw"
theatre.canvas.style.maxHeight = '100vh';
theatre.redraw = render;
window.onload = () => { theatre.redraw(); }


// Client Setup

let serverURL, socket;
if (LAN) {
    serverURL = 'http://127.0.0.1:8787/';
    socket = new WebSocket('ws://127.0.0.1:8787/websocket');
} else {
    serverURL = 'https://durable-world.aidanbeck.workers.dev/';
    socket = new WebSocket("wss://durable-world.aidanbeck.workers.dev/websocket");
}

const client = new Client(serverURL, socket, render);


// Inventory setup
let selectedType = 0;
let typesCount = 7;
document.addEventListener('keydown', () => {
    selectedType++;
    if (selectedType > typesCount) {
        selectedType = 0;
        inventory.src = "front-end/images/rachel.png";

    } else {
        inventory.src = tileTypes[selectedType].texture.image.src;
    }

});


// Interaction

let mouseButton = -1;

theatre.addEventListener("pointerdown", (e) => pointerDown(e) );
theatre.addEventListener("pointerup",   (e) => pointerUp(e));
theatre.addEventListener("dblclick",    (e) => pointerUp(e));
theatre.addEventListener("pointermove", (e) => pointerMove(e));
theatre.addEventListener("contextmenu", (e) => e.preventDefault());

function getTileCoordinate(x, y, cellSize) {

    return {
        x: client.view.x + Math.floor(x / cellSize),
        y: client.view.y + Math.floor(y / cellSize)
    }
}

function pointerDown(e) { 
    mouseButton = e.button;
    pointerMove(e);
}

function pointerUp(e) {

    if (mouseButton == 2 || event.type == 'dblclick') {
        let {x, y} = theatre.getEventCoordinates(e);
        let tile = getTileCoordinate(x, y, TILE_SIZE);

        let viewX = tile.x - 4;
        let viewY = tile.y - 4;

        client.view.setView(viewX, viewY);
        client.fetchView(render);
    }
    mouseButton = -1;
}

function pointerMove(e) {
    let {x, y} = theatre.getEventCoordinates(e);
    const tile = getTileCoordinate(x, y, TILE_SIZE);

    if (mouseButton == 0) {
        client.sendTile(tile.x, tile.y, selectedType);
    }
}


// Rendering

function render(view = client.view) {

    // This can be optimized by drawing to a buffer

    // Floors
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const floor = view.floors[j * GRID_SIZE + i];

            const floorType = floorTypes[floor];

            floorType && floorType.texture.draw((i) * TILE_SIZE, (j) * TILE_SIZE, 0, ctx);

        }
    }

    // Mobiles
    for (let mobile of view.mobiles) {
        const mobileType = mobileTypes[mobile.mobileType];

        mobileType && mobileType.texture.draw(mobile.x * TILE_SIZE, mobile.y * TILE_SIZE, 0, ctx);
    }

    // Tiles
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const tile = view.tiles[j * GRID_SIZE + i];

            const tileType = tileTypes[tile];

            tileType && tileType.texture.draw((i) * TILE_SIZE, (j) * TILE_SIZE, 0, ctx);

        }
    }
}


// Expose Global Variable

globalThis.CLIENT = client;
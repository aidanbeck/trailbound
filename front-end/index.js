import Theatre from './easel/Theatre.js';
import { tileTypes, floorTypes, mobileTypes } from './trailboundTypes.js';
import Client from './trailbound/Client.js';

const TILE_SIZE = 16;
const GRID_SIZE = 9;

// Theatre Setup
const canvasElement = document.getElementById("theatre");
const theatre = new Theatre(canvasElement, TILE_SIZE * GRID_SIZE, TILE_SIZE * GRID_SIZE);
const ctx = theatre.ctx;
// theatre.origin = "CENTER";
// theatre.makeFullScreen();
theatre.shorterDimensionConsistent = true;
theatre.canvas.style.backgroundColor = "#f8f9fa";
theatre.ctx.imageSmoothingEnabled = false; //prevent image blurring
canvasElement.style.imageRendering = 'pixelated'; //prevent image blurring;
theatre.redraw = render;
window.onload = () => { theatre.redraw(); }

theatre.canvas.style.width = "100vw"
theatre.canvas.style.maxHeight = '100vh';


// Interaction
theatre.addEventListener("pointerdown", (e) => pointerDown(e) );
theatre.addEventListener("pointerup",   (e) => pointerUp(e));
theatre.addEventListener("dblclick",    (e) => pointerUp(e));
theatre.addEventListener("pointermove", (e) => pointerMove(e));
theatre.addEventListener("contextmenu", (e) => e.preventDefault());
let mouseButton = -1;

// Networking
const serverURL = 'https://durable-object-starter.aidanbeck.workers.dev/';
const socket = new WebSocket("wss://durable-object-starter.aidanbeck.workers.dev/");
// const serverURL = 'http://127.0.0.1:8787/';
// const socket = new WebSocket('ws://127.0.0.1:8787/websocket');
const client = new Client(serverURL, socket);

// Pointer Event Handling

function getTileCoordinate(x, y, cellSize) {

    return {
        x: Math.floor(x / cellSize),
        y: Math.floor(y / cellSize)
    }
}

function pointerDown(e) { mouseButton = e.button; }

function pointerUp(e) {

    if (mouseButton == 2 || event.type == 'dblclick') {
        let {x, y} = theatre.getEventCoordinates(e);
        let tile = getTileCoordinate(x, y, TILE_SIZE);

        let viewX = client.view.x + tile.x - 4;
        let viewY = client.view.y + tile.y - 4;

        client.view.setView(viewX, viewY);
        client.fetchView(render); // pass in render function for when view is ready
    }

    mouseButton = -1;
}

function pointerMove(e) {
    let {x, y} = theatre.getEventCoordinates(e);

    const tile = getTileCoordinate(x, y, TILE_SIZE);
    if (mouseButton == 0) {
        client.world.setTile(tile.x, tile.y, 0);
    }
}

// Rendering

function render() {

    const view = client.view;

    // ctx.fillRect(view.x * TILE_SIZE - 500, view.y * TILE_SIZE - 500, 2000, 2000);
    // ctx.clearRect(view.x * TILE_SIZE - 500, view.y * TILE_SIZE - 500, 2000, 2000);

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const floor = view.floors[j * GRID_SIZE + i];
            const tile = view.tiles[j * GRID_SIZE + i];

            const floorType = floorTypes[floor];
            const tileType = tileTypes[tile];

            floorType && floorType.texture.draw((i) * TILE_SIZE, (j) * TILE_SIZE, 0, ctx);
            tileType && tileType.texture.draw((i) * TILE_SIZE, (j) * TILE_SIZE, 0, ctx);

        }
    }

    // Mobiles
    for (let mobile of view.mobiles) {
        const mobileType = mobileTypes[mobile.mobileType];

        mobileType && mobileType.texture.draw(mobile.x * TILE_SIZE, mobile.y * TILE_SIZE, 0, ctx);
    }
}

globalThis.CLIENT = client;
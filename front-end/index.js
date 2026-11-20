import Messenger from '../easel/Messenger.js';
import Theatre from '../easel/Theatre.js';

import World from '../trailbound/World.js';
import View from '../trailbound/View.js';

import { LAN, TILE_SIZE, GRID_SIZE } from './config.js';
import { tileTypes, floorTypes, mobileTypes } from './trailboundTypes.js';

// Trailbound Messenger
let messenger;
if (LAN) {
    messenger = new Messenger("https://solid-palm-tree-jjj6vvj77v6q3p44j-8787.app.github.dev", "wss://solid-palm-tree-jjj6vvj77v6q3p44j-8787.app.github.dev");
} else {
    messenger = new Messenger("https://durable-world.aidanbeck.workers.dev", "wss://durable-world.aidanbeck.workers.dev");
}

const view = new View();
const world = new World();

// let userToken = localStorage.getItem("trailbound:userToken");
// if (!userToken) { userToken = createUser(); }

messenger.connectionHandler = () => {
	messenger.sendMessage({ type: "createUser" });
}

messenger.addHandler("createUser", (data) => {
    messenger.sendMessage({ type: "setView", x: view.x, y: view.y });
});

messenger.addHandler("setView", (data) => {
    view.tiles = data.tiles;
    view.floors = data.floors;
    view.mobiles = data.mobiles;
    view.x = data.x;
    view.y = data.y;
    world.update(view.tiles, view.floors, view);
    render(view);
});

messenger.addHandler("setTile", (data) => {
    const x = data.x;
    const y = data.y;
    const tile = data.tile;

    world.setTile(x, y, tile);
    view.setTile(x, y, tile);
    render(view);
});

messenger.addHandler("setFloor", (data) => {
    const x = data.x;
    const y = data.y;
    const floor = data.floor;

    world.setFloor(x, y, floor);
    view.setFloor(x, y, floor);
    render(view);
});


messenger.addHandler("moveMobile", (data) => {
    
    const id = data.id;
    const x = data.x;
    const y = data.y;

    world.moveMobile(id, x, y);
    view.moveMobile(id, x, y);
    render(view);
});

function setView(x, y) {
    messenger.sendMessage({ type: 'setView', x: x, y: y });
}

function setTile(x, y, tile) {
        if (world.getTile(x, y) == tile) { return; }
    
        messenger.sendMessage({
            type: "setTile",
            x: x,
            y: y,
            tile: tile
        });

        world.setTile(x, y, tile);
        view.setTile(x, y, tile);
        render(view);
    }

function setFloor(x, y, floor) {
    if (world.getFloor(x,y) == floor) { return; }
    messenger.sendMessage({
        type: "setFloor",
        x: x,
        y: y,
        floor: floor
    });
    this.world.setFloor(x, y, floor);
    this.view.setFloor(x, y, floor);
    render(view);
}


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

// Interaction

let mouseButton = -1;

theatre.addEventListener("pointerdown", (e) => pointerDown(e) );
theatre.addEventListener("pointerup",   (e) => pointerUp(e));
theatre.addEventListener("dblclick",    (e) => pointerUp(e));
theatre.addEventListener("pointermove", (e) => pointerMove(e));
theatre.addEventListener("contextmenu", (e) => e.preventDefault());

function getTileCoordinate(x, y, cellSize) {
    return {
        x: view.x + Math.floor(x / cellSize),
        y: view.y + Math.floor(y / cellSize)
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

        const offsetX = Math.floor(view.width / 2);
        const offsetY = Math.floor(view.height / 2);

        setView(tile.x - offsetX, tile.y - offsetY);
    }
    mouseButton = -1;
}

function pointerMove(e) {
    let {x, y} = theatre.getEventCoordinates(e);
    const tile = getTileCoordinate(x, y, TILE_SIZE);

    if (mouseButton == 0) {
        setTile(tile.x, tile.y, selectedType);
    }
}

// Select Tile
let selectedType = 0;
let typesCount = 8;
document.addEventListener('keydown', cycleSelectedTileType);
inventory.addEventListener('click', cycleSelectedTileType);
function cycleSelectedTileType() {
    selectedType++;
    if (selectedType > typesCount) {
        selectedType = 0;
        inventory.src = "front-end/images/rachel.png";

    } else {
        inventory.src = tileTypes[selectedType].texture.image.src;
    }
}

// Rendering
function render(view) { // This can be optimized by drawing to a buffer

    // Floors
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const floor = view.floors[j * GRID_SIZE + i];

            const floorType = floorTypes[floor];

            floorType && floorType.texture.draw((i) * TILE_SIZE, (j) * TILE_SIZE, 0, ctx);

        }
    }

    // Tiles
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const tile = view.tiles[i * GRID_SIZE + j];

            const tileType = tileTypes[tile];

            tileType && tileType.texture.draw((j) * TILE_SIZE, (i) * TILE_SIZE, 0, ctx);

        }

        // Mobiles
        // This is hacky - EACH Y level of Tiles, it cycles through ALL mobiles and renders only the ones matching the Y level.
        // Eventually, only visible mobiles should be sent to the client.
        // These visible mobiles will then be sorted for more efficient rendering.
        // But this will all be refactored, and it works for now.
        for (const mobileId in view.mobiles) {
            const mobile = view.mobiles[mobileId];
            
            const x = mobile.x - view.x;
            const y = mobile.y - view.y;

            if (x < 0 || x >= view.width || y < 0 || y >= view.height) { continue; } // only render within view. Eventually view will handle this itself.
            if (y != i) { continue; } // only render mobiles on same y level of loop. Will not scale! Refactor this later.

            const mobileType = mobileTypes[mobile.mobileType];
            mobileType && mobileType.texture.draw(x * TILE_SIZE, y * TILE_SIZE, 0, ctx);
        }
    }
}
import Theatre from './easel/Theatre.js';
import { world, view } from './trailbound.js';

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
// theatre.canvas.style.height = "100vw"


// Interaction
theatre.addEventListener("pointerdown", (e) => pointerDown(e) );
theatre.addEventListener("pointerup",   (e) => pointerUp(e));
theatre.addEventListener("dblclick",    (e) => pointerUp(e));
theatre.addEventListener("pointermove", (e) => pointerMove(e));
theatre.addEventListener("contextmenu", (e) => e.preventDefault());

// State
let mouseButton = -1;
let waitForNewView = true;

const serverURL = 'https://durable-object-starter.aidanbeck.workers.dev/';
// const serverURL = 'http://127.0.0.1:8787/';
async function getView() {
    try {

        const response = await fetch(serverURL, {
            method: 'POST',
            // headers: {
			// 		'Content-Type': 'application/json',
			// 		'Access-Control-Allow-Origin': '*',
			// 		'Access-Control-Allow-Headers': '*',
			// 		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
			// },
            body: JSON.stringify({ x: view.x, y: view.y })
        });
        
        const data = await response.json();

        view.tiles = data.tiles;
        view.floors = data.floors;
        waitForNewView = false;
        render();
        // console.log(view.x, view.y);

    } catch(error) {
        console.error('Fetch failed: ', error);
    }
}

// Render
function render() {

    // ctx.fillRect(view.x * TILE_SIZE - 500, view.y * TILE_SIZE - 500, 2000, 2000);
    // ctx.clearRect(view.x * TILE_SIZE - 500, view.y * TILE_SIZE - 500, 2000, 2000);

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {

            const floor = view.floors[j * GRID_SIZE + i];
            const tile = view.tiles[j * GRID_SIZE + i];

            const floorType = world.floorTypes[floor];
            const tileType = world.tileTypes[tile];

            floorType && floorType.texture.draw((i + view.x) * TILE_SIZE, (j + view.y) * TILE_SIZE, 0, ctx);
            tileType && tileType.texture.draw((i + view.x) * TILE_SIZE, (j + view.y) * TILE_SIZE, 0, ctx);

        }
    }

    // Mobiles
    for (let mobile of view.mobiles) {
        const mobileType = world.mobileTypes[mobile.mobileType];

        mobileType && mobileType.texture.draw(mobile.x * TILE_SIZE, mobile.y * TILE_SIZE, 0, ctx);
    }
}

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

        world.mobiles[0].x = tile.x;
        world.mobiles[0].y = tile.y;

        tile.x -= 4;
        tile.y -= 4;

        startScroll((tile.x - view.x) * TILE_SIZE, (tile.y - view.y) * TILE_SIZE);

        view.setView(tile.x, tile.y);
        // view.updateView(world);
        getView();
    }

    mouseButton = -1;
}

function pointerMove(e) {
    let {x, y} = theatre.getEventCoordinates(e);

    const tile = getTileCoordinate(x, y, TILE_SIZE);
    if (mouseButton == 0) {
        // world.setFloor(tile.x, tile.y, 0);
        world.setTile(tile.x, tile.y, 0);
    }

    // view.updateView(world);
}

// Animation

let xPerStep = 0;
let yPerStep = 0;
let stepsRemaining = 0;

function startScroll(x, y) {

    stepsRemaining = 16;
    xPerStep = -x / stepsRemaining;
    yPerStep = -y / stepsRemaining;
    scrollScreen();
}

function scrollScreen() {

    if (stepsRemaining == 0) { waitForNewView = true; return; }

    if (!waitForNewView) {
        const imageData = ctx.getImageData(0, 0, 500, 500);

        ctx.translate(xPerStep, yPerStep);
        stepsRemaining--;

        ctx.putImageData(imageData, xPerStep, yPerStep);
        theatre.redraw();
    }    
    
    requestAnimationFrame(scrollScreen);
}

getView();
startScroll(0,0);
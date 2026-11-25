/*
    State, API Recievers, API/State Senders
*/

import Messenger from '../easel/Messenger.js';
import World from '../trailbound/World.js';
import View from '../trailbound/View.js';
import { LAN } from './config.js';
import render from './ui.js';

// Trailbound Messenger
let messenger;
if (LAN) {
    // messenger = new Messenger("https://localhost:8787", "wss://localhost:8787");
    messenger = new Messenger("https://solid-palm-tree-jjj6vvj77v6q3p44j-8787.app.github.dev/", "wss://solid-palm-tree-jjj6vvj77v6q3p44j-8787.app.github.dev/");
} else {
    messenger = new Messenger("https://trailbound.us/api", "wss://trailbound.us/api");
}

const view = new View();
const world = new World();

messenger.connectionHandler = () => {
	messenger.sendMessage({ type: "createUser" });
}

messenger.addHandler("createUser", (data) => {
    view.mobileId = data.user.mobileId;
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

    world.setTile(x, y, tile);
    view.setTile(x, y, tile);
    render(view);

    messenger.sendMessage({
        type: "setTile",
        x: x,
        y: y,
        tile: tile
    });
}

function setFloor(x, y, floor) {
    if (world.getFloor(x,y) == floor) { return; }

    world.setFloor(x, y, floor);
    view.setFloor(x, y, floor);
    render(view);

    messenger.sendMessage({
        type: "setFloor",
        x: x,
        y: y,
        floor: floor
    });
}

function moveMobile(id, x, y) {
    const mobile = world.getMobile(id);
    if (mobile.x == x && mobile.y == y) { return; }

    world.moveMobile(id, x, y);
    view.moveMobile(id, x, y);
    render(view);

    messenger.sendMessage({
        type: "moveMobile",
        id: id,
        x: x,
        y: y
    });
}

export { view, setView, setTile, setFloor, moveMobile };
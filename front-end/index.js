import Messenger from '../easel/Messenger.js';
import World from './trailbound/World.js';
import View from './trailbound/View.js';

import { LAN, TILE_SIZE, GRID_SIZE } from './config.js';

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
	messenger.sendMessage({ type: "createUser", sessionId: messenger.sessionId });
}

messenger.addHandler("createUser", (data) => {
    messenger.sendMessage({ type: "setView", sessionId: messenger.sessionId, x: view.x, y: view.y });
});

messenger.addHandler("setView", (data) => {
    view.tiles = data.tiles;
    view.floors = data.floors;
    view.mobiles = data.mobiles;
    world.update(view.tiles, view.floors, view);
    //render(view)
    console.log("setView", data);
});

messenger.addHandler("setTile", (data) => {
    const x = data.x;
    const y = data.y;
    const tile = data.tile;

    world.setTile(x, y, tile);
    view.setTile(x, y, tile);
    //render(view)
    console.log("setTile", data);
});

messenger.addHandler("setFloor", (data) => {
    const x = data.x;
    const y = data.y;
    const floor = data.floor;

    world.setFloor(x, y, floor);
    view.setFloor(x, y, floor);
    //render(view)
    console.log("setFloor", data);
});



// !!! unedited functions

function setView() {
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
        //render(view)
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
    //render(view)
}
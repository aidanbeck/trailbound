import World from './World.js';
import View from './View.js';

const world = new World();

export default class Server {

    constructor(broadcast, ctx) {
        this.world = world;
        this.broadcast = broadcast;
        this.ctx = ctx;

        this.receiveMessage = this.receiveMessage.bind(this);

    }

    receiveMessage(event) {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case "setTile":
                this.setTile(data.x, data.y, data.tile);
                break;
            case "setFloor":
                this.setFloor(data.x, data.y, data.floor);
        }
    }

    // Trailbound Specific

    async setTile(x, y, tile) {
		const saveWorld = (await this.ctx.storage.get("world")) || this.world;
		this.world.tiles = saveWorld.tiles;

        const currentTile = world.getTile(x, y);

        if (tile == currentTile) {
            return;
        }

		this.world.setTile(x, y, tile);
        await this.ctx.storage.put("world", this.world); // save world

        this.broadcast({
            type: "setTile",
            x: x,
            y: y,
            tile: tile
        });
	}

    async setFloor(x, y, floor) {
		const saveWorld = (await this.ctx.storage.get("world")) || this.world;
		this.world.floors = saveWorld.floors;

		this.world.setFloor(x, y, floor);
        await this.ctx.storage.put("world", this.world); // save world

        this.broadcast({
            type: "setFloor",
            x: x,
            y: y,
            tile: tile
        });
	}

    async setView(x, y) {

		const view = new View(x, y);
		view.update(this.world);
	
		return {
			x: view.x,
			y: view.y,
			floors: view.floors,
			tiles: view.tiles,
			mobiles: view.mobiles
		};
	}
}

// This will eventually replace or be used by a lot of the DurableWorld class, most of that is placeholders for now.
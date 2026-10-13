import World from './World.js';
import View from './View.js';
import Mobile from './Mobile.js';

const world = new World();
const users = [];

export default class Server {

    constructor(broadcast, ctx) {
        this.world = world;
        this.users = users;

        this.broadcast = broadcast;
        this.ctx = ctx;
        this.load();

        this.receiveMessage = this.receiveMessage.bind(this);
    }

    receiveMessage(event) {
        const data = JSON.parse(event.data);

        switch (data.type) {
            case "createUser":
                this.createUser();
            case "setTile":
                this.setTile(data.x, data.y, data.tile);
                break;
            case "setFloor":
                this.setFloor(data.x, data.y, data.floor);
        }
    }

    async save() {
        await this.ctx.storage.put("world", this.world);
        await this.ctx.storage.put("users", this.users);
        // should saving just be every once in a while?
    }

    async load() {
        this.world = (await this.ctx.storage.get("world")) || this.world;
        this.users = (await this.ctx.storage.get("users")) || this.users;
    }

    async createUser() {
        // const saveWorld = (await this.ctx.storage.get("world")) || this.world;
        // const saveUsers = (await this.ctx.storage.get("users")) || this.users;
        // this.world.mobiles = saveWorld.mobiles;
        // this.users = saveUsers;

        const user = new User();
        const type = Math.round(Math.random()); //randomly Rachel or Stefan
        const userMobile = new Mobile(user.mobileId, user.view.x, user.view.y, type);
        this.world.addMobile(userMobile);
        this.users.push(user);

        // await this.ctx.storage.put("world", this.world); // save world
        // await this.ctx.storage.put("users", this.users); // save users

        this.save();

        this.broadcast({
            token: user.token
        });
    }

    async setTile(x, y, tile) {
		// const saveWorld = (await this.ctx.storage.get("world")) || this.world;
		// this.world.tiles = saveWorld.tiles;

        const currentTile = world.getTile(x, y);

        if (tile == currentTile) {
            return;
        }

		this.world.setTile(x, y, tile);
        // await this.ctx.storage.put("world", this.world); // save world
        this.save();

        this.broadcast({
            type: "setTile",
            x: x,
            y: y,
            tile: tile
        });
	}

    async setFloor(x, y, floor) {
		// const saveWorld = (await this.ctx.storage.get("world")) || this.world;
		// this.world.floors = saveWorld.floors;

		this.world.setFloor(x, y, floor);
        // await this.ctx.storage.put("world", this.world); // save world
        this.save();

        this.broadcast({
            type: "setFloor",
            x: x,
            y: y,
            tile: tile
        });
	}

    async setView(x, y) {

		const view = new View(x, y);

        this.world.addMobile(JSON.parse(JSON.stringify(new Mobile("player", x+4, y+4, type))));
		view.update(this.world);

        // this interestingly does not save the server. I will keep it this way as an experiment
	
		return {
			x: view.x,
			y: view.y,
			floors: view.floors,
			tiles: view.tiles,
			mobiles: view.mobiles
		};
	}
}

class User {
    constructor() {
        this.view = new View();
        this.mobileId = crypto.randomUUID();
        this.token = crypto.randomUUID();
    }
}

   /* Todo:
    * Test users & usertoken alignment
    * use token to move mobile properly in setView
    * require token to make changes. Check if in bounds
    * State saving & loading (remove annoying lines before each change)
    * 
    * Save usertoken to each socket instance
    * use usertoken to check that an update is in bounds before sending socket to client
    */
import Switchboard from '../../easel/Switchboard.js';

import World from '../../trailbound/World.js';
import View from '../../trailbound/View.js';
import Mobile from '../../trailbound/Mobile.js';

export default class TrailboundServer {

    constructor(save, load) {


        this.switchboard = new Switchboard();
        this.save = save;
        this.load = load;

        this.world = new World(); //this.load("world") || new World();
        this.users = []; //this.load("users") || [];


        // add handlers
        this.switchboard.addHandler("createUser", this.createUser);
        this.switchboard.addHandler("setView", this.setView);
        this.switchboard.addHandler("setTile", this.setTile);
        this.switchboard.addHandler("setFloor", this.setFloor);
    }

    createUser = (data) => {
        const sessionId = data.sessionId;

        const user = new User(sessionId);
        const type = Math.round(Math.random()); //randomly Rachel or Stefan
        const userMobile = new Mobile(user.mobileId, user.view.x+4, user.view.y+4, type);

        this.world.addMobile(userMobile);
        this.users.push(user);

        this.switchboard.sendMessage(sessionId, {type: "createUser", user: user});

        this.save("users", this.users);
        this.save("world", this.world);
    }

    setView = (data) => {

        const sessionId = data.sessionId;
        const x = data.x;
        const y = data.y;

        // hacky hacky hacky, bad bad bad
        let mobileId;
        for(const user of this.users) {
            if (user.sessionId == sessionId) {
                mobileId = user.mobileId;
            }
        }
        for (const mobile of this.world.mobiles) {
            if (mobile.id == mobileId) {
                mobile.x = x + 4;
                mobile.y = y + 4;
                console.log(mobile);
            }
        }

        const view = new View(x, y);
		view.update(this.world);

        this.switchboard.sendMessage(sessionId, {
            type: "setView",
            x: view.x,
			y: view.y,
			floors: view.floors,
			tiles: view.tiles,
			mobiles: view.mobiles
        });
    }

    setTile = (data) => {

        const x = data.x;
        const y = data.y;
        const tile = data.tile;

        const currentTile = this.world.getTile(x, y);

        if (data.tile == currentTile) { return; }

        this.world.setTile(x, y, tile);
        this.switchboard.sendMessageToAll({
            type: "setTile",
            x: x,
            y: y,
            tile: tile
        });
        this.save("world", this.world);
    }

    setFloor = (data) => {

        const x = data.x;
        const y = data.y;
        const floor = data.floor;

        const currentFloor = this.world.getFloor(x, y);

        if (data.floor == currentFloor) { return; }

        this.world.setFloor(x, y, floor);
        this.switchboard.sendMessageToAll({
            type: "setFloor",
            x: x,
            y: y,
            floor: floor
        });
        this.save("world", this.world);
    }
}

class User {
    constructor(sessionId) {
        this.view = new View();
        this.mobileId = crypto.randomUUID();
        this.sessionId = sessionId;
    }
}

// saving does not have to be as often. multiple events can designate a save should happen soon, and it will save if anything has changed on a timer.
// users can be a map that is parsed upon saving/loading
// change usermobile testificate for actually finding the mobile and moving it
// on close, you can also find the mobile and delete it
// world, view, mobile should be in its own folder in root alongside easel, shared by client and server
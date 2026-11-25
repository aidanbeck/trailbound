import Switchboard from '../../easel/Switchboard.js';

import World from '../../trailbound/World.js';
import View from '../../trailbound/View.js';
import Mobile from '../../trailbound/Mobile.js';

export default class TrailboundServer {

    constructor(save, load) {

        this.switchboard = new Switchboard();
        this.save = save;
        this.load = load;

        this.world = new World(); // todo: load world & users
        this.users = new Map();

        // add handlers
        this.switchboard.addHandler("createUser", this.createUser);
        this.switchboard.addHandler("setView", this.setView);
        this.switchboard.addHandler("setTile", this.setTile);
        this.switchboard.addHandler("setFloor", this.setFloor);
        this.switchboard.addHandler("moveMobile", this.moveMobile);
    }

    createUser = (data) => {

        const sessionId = data.sessionId;
        const user = new User(sessionId);

        const id = user.mobileId;
        const x = user.view.x + 4; // center of view
        const y = user.view.y + 4; // center of view
        const type = Math.round(Math.random()); // 0 (Rachel) or 1 (Stefan)

        const userMobile = new Mobile(id, x, y, type);
        this.world.addMobile(userMobile);
        this.users.set(sessionId, user);

        this.switchboard.sendMessage(sessionId, {type: "createUser", user: user});
        this.save("users", this.users);
        this.save("world", this.world);
    }

    setView = (data) => {

        const sessionId = data.sessionId;
        const viewX = data.x;
        const viewY = data.y;

        const mobileId = this.users.get(sessionId).mobileId;
        const mobile = this.world.getMobile(mobileId);

        mobile.x = viewX + 4; // center of view
        mobile.y = viewY + 4; // center of view

        const view = new View(viewX, viewY);
		view.update(this.world);

        this.switchboard.sendMessage(sessionId, {
            type: "setView",
            x: view.x,
			y: view.y,
			floors: view.floors,
			tiles: view.tiles,
			mobiles: view.mobiles
        });
        this.switchboard.sendMessageToAll({
            type: "moveMobile",
            id: mobile.id,
            x: mobile.x,
            y: mobile.y
        });
    }

    setTile = (data) => {

        const x = data.x;
        const y = data.y;
        const tile = data.tile;

        // tile is already set
        if (tile == this.world.getTile(x, y)) { return; }

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

        // floor is already set
        if (floor == this.world.getFloor(x, y)) { return; }

        this.world.setFloor(x, y, floor);

        this.switchboard.sendMessageToAll({
            type: "setFloor",
            x: x,
            y: y,
            floor: floor
        });
        this.save("world", this.world);
    }

    moveMobile = (data) => {

        const id = data.id;
        const x = data.x;
        const y = data.y;

        // mobile is already moved
        const mobile = this.world.getMobile(id);
        if (mobile.x == x && mobile.y == y) { return; }

        this.world.moveMobile(id, x, y);

        this.switchboard.sendMessageToAll({
            type: "moveMobile",
            id: id,
            x: x,
            y: y
        });
    }
}

class User {
    constructor(sessionId) {
        this.view = new View();
        this.mobileId = crypto.randomUUID();
        this.sessionId = sessionId;
    }
}

// on close, you can also find the mobile and delete it
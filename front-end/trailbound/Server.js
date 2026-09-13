import World from './World.js';

export default class Server {

    constructor(broadcast) {
        this.broadcast = broadcast;
        this.world = new World();
    }

    setTile(x, y, tile) {
        this.world.setTile(x, y, tile);
        this.broadcast({
            type: "setTile",
            x: x,
            y: y
        });
    }
    
}
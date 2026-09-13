import World from './World.js';
import View from './View.js';

export default class Client {

    constructor(serverURL, socket) {
        this.serverURL = serverURL
        this.socket = socket;
        this.world = new World();
        this.view = new View();

        this.view.update(this.world);
        this.fetchView();
        
        socket.addEventListener("message", this.recieveMessage);
    }

    recieveMessage(event) {
        const data = JSON.parse(event.data);
        console.log(data);
    }

    async fetch(method, body) {
        try {
            const response = await fetch(this.serverURL, {
                method: method,
                body: JSON.stringify(body)
            });
        
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error);
        }
    }

    broadcast(message) {
        const data = JSON.stringify(message);
        this.socket.send(data);
    }

    async fetchView(render) {
        const data = await this.fetch('POST', { x: this.view.x, y: this.view.y });
        this.view.tiles = data.tiles;
        this.view.floors = data.floors;

        render();
    }

    sendTile(x, y, tile) {
        this.world.setTile(x, y, tile);
        // this.view.update(this.world);
        this.broadcast({
            type: "setTile",
            x: x,
            y: y
        });
    }

    recieveTile(x, y, tile) {
        this.world.setTile(x, y, tile);
        // this.view.update(this.world);
    }

    recieveView(data) {
        this.view.tiles = data.tiles;
        this.view.floors = data.floors;
    }
    
}
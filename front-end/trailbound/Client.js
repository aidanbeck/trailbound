import World from './World.js';
import View from './View.js';

export default class Client {

    constructor(serverURL, socket, renderFunction) {
        this.serverURL = serverURL;
        this.socket = socket;
        this.renderFunction = renderFunction; // external render function
        
        this.world = new World();
        this.view = new View();

        this.view.update(this.world);
        this.fetchView();
        
        this.receiveMessage = this.receiveMessage.bind(this); // make 'this' refers to Client, not socket
        socket.addEventListener("message", this.receiveMessage);
    }

    receiveMessage(event) {
        const data = JSON.parse(event.data);

        if (data.type == 'world_update') {
            this.receiveTile(data.x, data.y, data.tile);
        } else {
            console.log("Message from Server: ", data);
        }
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

    async fetchView() {
        const data = await this.fetch('POST', { x: this.view.x, y: this.view.y });
        this.view.tiles = data.tiles;
        this.view.floors = data.floors;

        this.renderFunction(this.view);
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

    receiveTile(x, y, tile) {
        this.world.setTile(x, y, tile);
        this.view.setTile(x, y, tile);
        this.renderFunction(this.view);
    }

    receiveView(data) {
        this.view.tiles = data.tiles;
        this.view.floors = data.floors;
    }
    
}
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

    receiveMessage(event) {
        const data = JSON.parse(event.data);

        if (data.type == 'setTile') {
            this.receiveTile(data.x, data.y, data.tile);
        } else if (data.type == 'setFloor') {
            this.receiveFloor(data.x, data.y, data.floor);
        } else {
            console.log("Message from Server: ", data);
        }
    }

    async fetchView() {
        const data = await this.fetch('POST', { type: 'setView', x: this.view.x, y: this.view.y });
        this.view.tiles = data.tiles;
        this.view.floors = data.floors;

        this.world.update(data.tiles, data.floors, this.view);

        this.renderFunction(this.view);
    }

    sendTile(x, y, tile) {
        if (this.world.getTile(x, y) == tile) { return; }
    
        this.world.setTile(x, y, tile);
        this.view.setTile(x, y, tile);

        this.broadcast({
            type: "setTile",
            x: x,
            y: y,
            tile: tile
        });
        this.renderFunction(this.view);
    }

    sendFloor(x, y, floor) {
        if (this.world.getFloor(x,y) == floor) { return; }

        this.world.setFloor(x, y, floor);
        this.view.setFloor(x, y, floor);
        this.broadcast({
            type: "setFloor",
            x: x,
            y: y,
            floor: floor
        });
        this.renderFunction(this.view);
    }

    receiveTile(x, y, tile) {
        this.world.setTile(x, y, tile);
        this.view.setTile(x, y, tile);
        this.renderFunction(this.view);
    }

    receiveFloor(x, y, floor) {
        this.world.setFloor(x, y, floor);
        this.view.setFloor(x, y, floor);
        this.renderFunction(this.view);
    }

    recieveMobile() {} // How should this work? Should it be updated? created/deleted? Should it update and the client is responsible for creation/deletion?

    receiveView(data) {
        this.view.tiles = data.tiles;
        this.view.floors = data.floors;
        this.world.update(data.tiles, data.floors, this.view);
    }
}
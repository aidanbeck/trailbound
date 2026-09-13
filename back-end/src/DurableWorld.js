import { DurableObject } from "cloudflare:workers";

import { world } from './front-end/trailbound.js';
import View from './front-end/View.js';

/**
 * Env provides a mechanism to reference bindings declared in wrangler.jsonc within JavaScript
 *
 * @typedef {Object} Env
 * @property {DurableObjectNamespace} MY_DURABLE_OBJECT - The Durable Object namespace binding
 */

export class DurableWorld extends DurableObject {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param {DurableObjectState} ctx - The interface for interacting with Durable Object state
	 * @param {Env} env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx, env) {
		super(ctx, env);

        this.sockets = new Set();
	}

    async fetch(request) {
        if (request.headers.get("Upgrade") === "websocket") {
            return this.handleWebSocket(request);
        }

        return new Response("Not found", { status: 404 });
    }

    handleWebSocket(request) {
        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);

        server.accept();

        this.sockets.add(server);

        server.addEventListener("close", () => {
            this.sockets.delete(server);
        });

        server.addEventListener("error", () => {
            this.sockets.delete(server);
        });

        return new Response(null, {
            status: 101,
            webSocket: client
        });
    }

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	async moveView(x, y) {
		const saveWorld = (await this.ctx.storage.get("world")) || world;

		world.tiles = saveWorld.tiles;
		world.floors = saveWorld.floors;
		world.mobiles = saveWorld.mobiles;

		world.setTile(x + 4, y + 4, 0); // destroy walked on tile
        await this.ctx.storage.put("world", world); // save world

        this.broadcast({
            type: "world_update",
            x: x + 4,
            y: y + 4,
            tile: 0
        }); // broadcast change

		let saveView = new View(x, y);
		saveView.updateView(world);
	
		
		return {
			x: saveView.x,
			y: saveView.y,
			floors: saveView.floors,
			tiles: saveView.tiles,
			mobiles: saveView.mobiles
		};
	}

    broadcast(message) {
        const data = JSON.stringify(message);

        for(const socket of this.sockets) {
            try {
                socket.send(data);
            } catch (err) {
                this.sockets.delete(socket);
            }
        }
    }

	/**
	 * The Durable Object exposes an RPC method sayHello which will be invoked when a Durable
	 *  Object instance receives a request from a Worker via the same method invocation on the stub
	 *
	 * @param {string} name - The name provided to a Durable Object instance from a Worker
	 * @returns {Promise<string>} The greeting to be sent back to the Worker
	 */
	async sayHello(name) {
		return `Hello, ${name}!`;
	}
}
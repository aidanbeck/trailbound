import { DurableObject } from "cloudflare:workers";
import Server from './trailbound/Server.js'

/**
 * Env provides a mechanism to reference bindings declared in wrangler.jsonc within JavaScript
 *
 * @typedef {Object} Env
 * @property {DurableObjectNamespace} DURABLE_WORLD - The Durable Object namespace binding
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
        this.broadcast = this.broadcast.bind(this);

        this.server = new Server(this.broadcast, ctx);
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

    async fetch(request) {

        const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		};

        if (request.method === "OPTIONS") { return new Response(null, { status: 204, headers: corsHeaders, }); }

        if (request.headers.get("Upgrade") === "websocket") { return await this.handleWebSocket(request); }

        const body = await request.json();
        const response = await this.server.setView(body.x, body.y);

        return new Response( JSON.stringify(response), { headers: { "Content-Type": "application/json", ...corsHeaders, }} );

    }

    async handleWebSocket(request) {
        const pair = new WebSocketPair();
        const [client, socketServer] = Object.values(pair);

        socketServer.accept();

        this.sockets.add(socketServer);

        socketServer.addEventListener("close", () => {
            this.sockets.delete(socketServer);
        });

        socketServer.addEventListener("error", () => {
            this.sockets.delete(socketServer);
        });

        socketServer.addEventListener("message", (event) => {
            this.server.receiveMessage(event); // send to Server class
        });

        return new Response(null, {
            status: 101,
            webSocket: client
        });
    }
}
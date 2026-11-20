import { DurableObject } from "cloudflare:workers";
import TrailboundServer from "./TrailboundServer.js";

export class DurableWorld extends DurableObject {

	constructor(ctx, env) {
		super(ctx, env);
		this.trailboundServer = new TrailboundServer(this.save, this.load);
	}

	async fetch(request) {
        if (request.headers.get("Upgrade") === "websocket") {
            return this.handleWebSocket(request);
        }
        return new Reponse();
    }

	async handleWebSocket(request) {
        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);
        server.accept();
        
        this.trailboundServer.switchboard.addSocket(server); // add socket to trailboundServer

        return new Response(null, {
            status: 101,
            webSocket: client
        });
    }

	async save(key, data) {
        await this.ctx.storage.put(key, data);
    }

    async load(key, data) {
		return this.ctx.storage.get(key);
    }
}

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const instanceName = "myServerSlug"; //url.pathname.split("/");
		const stub = env.DURABLE_WORLD.getByName(instanceName);
		return stub.fetch(request);
	},
};
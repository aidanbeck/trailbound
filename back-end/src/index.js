import { DurableObject } from "cloudflare:workers";

import { world } from './front-end/trailbound.js';
import View from './front-end/View.js';

/**
 * Env provides a mechanism to reference bindings declared in wrangler.jsonc within JavaScript
 *
 * @typedef {Object} Env
 * @property {DurableObjectNamespace} MY_DURABLE_OBJECT - The Durable Object namespace binding
 */

export class MyDurableObject extends DurableObject {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param {DurableObjectState} ctx - The interface for interacting with Durable Object state
	 * @param {Env} env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx, env) {
		super(ctx, env);
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

		world.setTile(x+4, y+4, 0); // destroy walked on tile

		let saveView = new View(x, y);
		saveView.updateView(world);
	
		await this.ctx.storage.put("world", world); // save world
		
		return {
			x: saveView.x,
			y: saveView.y,
			floors: saveView.floors,
			tiles: saveView.tiles,
			mobiles: saveView.mobiles
		};
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

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param {Request} request - The request submitted to the Worker from the client
	 * @param {Env} env - The interface to reference bindings declared in wrangler.jsonc
	 * @param {ExecutionContext} ctx - The execution context of the Worker
	 * @returns {Promise<Response>} The response to be sent back to the client
	 */
	async fetch(request, env, ctx) {

		// Handle Cors
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*", // before shipping, change to https://trailbound.us/
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		};
		if (request.method === "OPTIONS") { return new Response(null, { status: 204, headers: corsHeaders, }); }


		const instanceName = "foo";
		const stub = env.MY_DURABLE_OBJECT.getByName(instanceName);
		const body = await request.json();

		const movedView = await stub.moveView(body.x, body.y);

		return new Response(
			JSON.stringify(movedView),
			{ headers: { "Content-Type": "application/json", ...corsHeaders, } }
		);
		
	}
};
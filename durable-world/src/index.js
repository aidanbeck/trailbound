import { DurableWorld } from './DurableWorld.js';
export { DurableWorld };

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

		const url = new URL(request.url);
		const instanceName = "myServerSlug"; //url.pathname.split("/");
		const stub = env.DURABLE_WORLD.getByName(instanceName);
		return stub.fetch(request);
	}
};
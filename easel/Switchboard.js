// This is the Switchboard module for Easel, used by servers to route websocket requests.

export default class Switchboard {
	constructor() {
		this.sockets = new Map();
		this.messageHandlers = new Map();
		this.connectionHandler = () => {};
		
		this.recieveMessage = this.recieveMessage.bind(this);
		this.removeSocket = this.removeSocket.bind(this);
	}
	
	sendMessage(sessionId, data) {
		const socket = this.sockets.get(sessionId);
		const message = JSON.stringify(data);
		socket.send(message);
	}

	sendMessageToAll(data) {
		const message = JSON.stringify(data);

		for (const [sessionId, socket] of this.sockets) {
			try { socket.send(message); }
			catch { this.sockets.delete(sessionId); }
		}
	}
	
	addHandler(type, handler) {
		this.messageHandlers.set(type, handler)
	}

	addSocket(socket) {
		const sessionId = crypto.randomUUID();
		this.sockets.set(sessionId, socket);
		
		// Add Listeners
		socket.addEventListener("message", (event) => { this.recieveMessage(event.data) });
		socket.addEventListener("close", () => { this.removeSocket(sessionId)} );

		// Send Token
		this.sendMessage(sessionId, { type: "sessionId", sessionId: sessionId });
		this.connectionHandler(sessionId);

		return sessionId;
	}

	removeSocket(sessionId) {
		this.sockets.delete(sessionId);
	}

	recieveMessage(data) {
		const message = JSON.parse(data.toString());
		const type = message.type;
		const sessionId = message.sessionId;
		const handler = this.messageHandlers.get(type);
		handler(message);
	}
}
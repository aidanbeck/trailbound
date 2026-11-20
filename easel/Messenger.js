export default class Messenger {
	constructor(serverURL, socketURL) {
		
		this.serverURL = serverURL;
		this.socket = new WebSocket(socketURL);
		this.sessionId = "";
		this.messageHandlers = {};

		this.connectionHandler = (e) =>    {console.log(e)};
		this.disconnectionHandler = (e) => {console.log(e)};
		this.errorHandler = (e) => 		   {console.log(e)};

		this.addHandler("sessionId", (data) => { // Default sessionId Handler, always the first socket recieved.
			this.sessionId = data.sessionId; // Save sessionId
			this.connectionHandler(); // Trigger Connection Handler
		});
		this.socket.addEventListener("close",   (e) => {this.disconnectionHandler(e)});
		this.socket.addEventListener("error",   (e) => {this.errorHandler(e)});
		this.socket.addEventListener("message", (e) => {this.recieveMessage(e)});

	}

	async fetch(method, body) {
		const response = await fetch(this.serverURL, {
			method: method,
			body: JSON.stringify(body)
		});
		
		return await response.json();
	}

	sendMessage(data) {
		data.sessionId = this.sessionId;
		const message = JSON.stringify(data);
		this.socket.send(message);
	}

	recieveMessage(event) {
		const data = JSON.parse(event.data);
		const type = data.type;
		this.messageHandlers[type](data);
	}

	addHandler(type, logic) {
		this.messageHandlers[type] = logic;
	}
}
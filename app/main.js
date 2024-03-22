const net = require("net");

const process_request = require("./process");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
	socket.on("close", () => {
		socket.end();
	});
	socket.on("data", (data) => {
		process_request(data, socket);
	});
	socket.on("error", (error) => {
		console.log(error);
	});
});
server.on("connection", () => console.log("New connection received"));
server.on("error", (error) => console.log(error));

server.listen(4221, "localhost");

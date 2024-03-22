const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
	socket.on("close", () => {
		socket.end();
		server.close();
	});
	socket.on("data", (buffer) => {
		const data = buffer.toString();
		const dataArray = data.split("\r\n");
		const startLine = dataArray[0].split(" ");
		const path = startLine[1];
		if (path === "/") {
			socket.write(
				[
					"HTTP/1.1 200 OK",
					"Content-Type: text/html; charset=UTF-8",
					"Content-Encoding: UTF-8",
				].join("\r\n") + "\r\n\r\n"
			);
		} else if (path.startsWith("/echo/")) {
			const randomString = path.split("/echo/")[1];
			socket.write(
				[
					"HTTP/1.1 200 OK",
					"Content-Type: text/plain",
					"Content-Encoding: UTF-8",
					"Content-Length: 3",
				].join("\r\n") + "\r\n\r\n"
			);
			socket.write(randomString + "\r\n\r\n");
		} else {
			socket.write(
				[
					"HTTP/1.1 404 NOT FOUND",
					"Content-Type: text/plain; charset=UTF-8",
					"Content-Encoding: UTF-8",
				].join("\r\n") + "\r\n\r\n"
			);
		}
		socket.end();
	});
	socket.on("error", (error) => {
		console.log(error);
	});
});
server.on("connection", () => console.log("New connection received"));
server.on("error", (error) => console.log(error));

server.listen(4221, "localhost");

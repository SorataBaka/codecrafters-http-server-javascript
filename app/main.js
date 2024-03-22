const net = require("net");
const fs = require("fs");
const Path = require("path");

const EOL = "\r\n";
const EOF = "\r\n\r\n";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const directory = process.argv[3];

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
	socket.on("close", () => {
		socket.end();
	});
	socket.on("data", (buffer) => {
		const data = buffer.toString();
		const dataArray = data.split("\r\n");
		const [method, path, version] = dataArray[0].split(" ");

		const hostPattern = /(?<=Host: ).*?(?=\r\n)/g;
		const agentPattern = /(?<=User-Agent: ).*?(?=\r\n)/g;

		if (path === "/") socket.write("HTTP/1.1 200 OK" + EOF);
		else if (path.startsWith("/echo/")) {
			const content = path.split("/echo/")[1];
			socket.write("HTTP/1.1 200 OK" + EOL);
			socket.write("Content-Type: text/plain" + EOL);
			socket.write("Content-Length: " + content.length + EOF);
			socket.write(content + EOF);
		} else if (path.startsWith("/user-agent")) {
			const userAgent = data.match(agentPattern);
			socket.write("HTTP/1.1 200 OK" + EOL);
			socket.write("Content-Type: text/plain" + EOL);
			socket.write("Content-Length: " + userAgent[0].length + EOF);
			socket.write(userAgent[0] + EOF);
		} else if (path.startsWith("/files/")) {
			const fileName = path.split("/files/")[1];
			const resolvePath = Path.resolve(directory + "/" + fileName);
			const checkExist = fs.existsSync(resolvePath);
			if (!checkExist) {
				socket.write("HTTP/1.1 404 NOT FOUND" + EOL);
				socket.write("Content-Type: application/octet-stream" + EOF);
				return socket.end();
			}
			const fileBuffer = fs.readFileSync(resolvePath);
			socket.write("HTTP/1.1 200 OK" + EOL);
			socket.write("Content-Type: application/octet-stream" + EOL);
			socket.write("Content-Length: " + fileBuffer.length + EOF);
			socket.write(fileBuffer);
			socket.write(EOF);
		} else {
			socket.write("HTTP/1.1 404 NOT FOUND" + EOL);
			socket.write("Content-Type: text/plain" + EOF);
			return socket.end();
		}
		return socket.end();
	});
	socket.on("error", (error) => {
		console.log(error);
	});
});
server.on("connection", () => console.log("New connection received"));
server.on("error", (error) => console.log(error));

server.listen(4221, "localhost");

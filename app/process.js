const pre_process = require("./pre-process");
const buildHeader = require("./build-header");
const PATH = require("path");
const fs = require("fs");
const directory = process.argv[3];
module.exports = (requestBuffer, socket) => {
	const request = pre_process(requestBuffer);
	if (request.path === "/" && request.method === "GET") {
		const header = buildHeader(200, "text/plain", "");
		socket.write(header);
		return socket.end();
	}
	if (request.path.startsWith("/echo/") && request.method === "GET") {
		const body = request.path.split("/echo/")[1];
		const header = buildHeader(200, "text/plain", body);
		socket.write(header);
		socket.write(body + "\r\n\r\n");
		return socket.end();
	}
	if (request.path.startsWith("/user-agent") && request.method === "GET") {
		const body = request.headers["User-Agent"];
		const header = buildHeader(200, "text/plain", body);
		socket.write(header);
		socket.write(body + "\r\n\r\n");
		return socket.end();
	}
	if (request.path.startsWith("/files/") && request.method === "GET") {
		const fileName = request.path.split("/files/")[1];
		const resolvePath = PATH.resolve(directory + "/" + fileName);

		if (!fs.existsSync(resolvePath)) {
			const header = buildHeader(404, "text/plain", "");
			socket.write(header);
			return socket.end();
		}
		const fileBuffer = fs.readFileSync(resolvePath);
		const header = buildHeader(200, "application/octet-stream", fileBuffer);
		socket.write(header);
		socket.write(fileBuffer + "\r\n\r\n");
		return socket.end();
	}
	if (request.path.startsWith("/files/") && request.method === "POST") {
		const fileName = request.path.split("/files/")[1];
		const resolvePath = PATH.resolve(directory + "/" + fileName);
		fs.writeFileSync(resolvePath, request.body.toString());
		const header = buildHeader(201, "text/plain", "");
		socket.write(header);
		return socket.end();
	}

	const header = buildHeader(404, "text/plain", "");
	socket.write(header);
	return socket.end();
};

// else if (path.startsWith("/files/") && method === "POST") {
// 	const fileBuffer = dataArray[dataArray.length - 1];
// 	const fileName = path.split("/files/")[1];
// 	const resolvePath = Path.resolve(directory + "/" + fileName);
// 	fs.writeFileSync(resolvePath, fileBuffer.toString());
// 	socket.write("HTTP/1.1 201 CREATED" + EOL);
// 	socket.write("Content-Type: text/plain" + EOF);
// 	return socket.end();
// }

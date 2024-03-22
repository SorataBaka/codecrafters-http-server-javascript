module.exports = (status, content_type, body) => {
	let responseHead = "HTTP/1.1 ";
	switch (status) {
		case 200:
			responseHead += "200 OK";
			break;
		case 201:
			responseHead += "201 Created";
			break;
		default:
			responseHead += "404 Not Found";
	}
	const responseHeaders = {
		"Content-Type": content_type,
		"Content-Length": body.length,
	};
	const headerArray = Object.entries(responseHeaders)
		.map(([key, value]) => {
			return key + ": " + value;
		})
		.join("\r\n");
	return responseHead + "\r\n" + headerArray + "\r\n\r\n";
};

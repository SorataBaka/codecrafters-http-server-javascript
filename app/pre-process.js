module.exports = (requestBuffer) => {
	const requestString = requestBuffer.toString();
	//Split the request string between the header and the body
	const [headerStack, body] = requestString.split("\r\n\r\n");
	const headerSplit = headerStack.split("\r\n");
	const [method, path, version] = headerSplit[0].split(" ");
	//Remove the top layer of the header that contains the method and path. We only want pure headers
	headerSplit.shift();

	const request = {
		method,
		path,
		version,
		body,
		headers: Object.fromEntries(
			headerSplit.map((header) => {
				const splitSingleHeader = header.split(": ");
				return [splitSingleHeader[0], splitSingleHeader[1]];
			})
		),
	};
	return request;
};

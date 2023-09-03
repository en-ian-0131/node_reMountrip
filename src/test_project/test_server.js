const http = require("http");
const fs = require("fs/promises");

const server = http.createServer((req, res) => {
  res.writeHead("200", {
    "Content-type": "text/html",
  });
  res.end(`
    <h2>Hello world</h2> <p>${req.url}</p>`);
});

server.listen(3000);

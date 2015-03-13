var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var port = 9990;
var server = http.createServer(function(request, response) {

  var filepath = url.parse(request.url).pathname.replace(/^\//, "");
  if (!filepath) { filepath = "index.html"; }
  var extension = path.extname(filepath);
  console.time('serve');
  console.log('req: ', filepath);

  fs.exists(filepath, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filepath).isDirectory()) {
      response.writeHead(403, {"Content-Type": "text/plain"});
      response.write("403 Forbidden\n");
      response.end();
      return;
    }

    fs.readFile(filepath, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "application/octet-stream"});
        response.write(err + "\n");
        response.end();
        return;
      }

      if (extension === ".js") {
        response.writeHead(200, {"Content-Type": "application/javascript"});
      } else {
        response.writeHead(200);
      }
      response.write(file, "binary");
      response.end();
      console.log(filepath)
      console.timeEnd('serve');
    });
  });
});
server.listen(parseInt(port, 10));

server.on('connect', function(req, cltSocket, head) {
});

console.log("serving => http://localhost:%s \nCTRL + C to shutdown", port);
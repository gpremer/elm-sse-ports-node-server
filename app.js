var SseChannel = require('sse-channel');
var http = require('http');

var id = 0;
var dataChannel = new SseChannel({
    cors: {
        origins: '*',
        headers: 'Last-Event-Id',
        methods: 'GET,OPTIONS'
    }
});

setInterval(function () {
    dataChannel.send({data: JSON.stringify({x: Math.random(), y: Math.random()}), event: "2dpoint"});
}, 2000);
setInterval(function () {
    dataChannel.send({data: JSON.stringify({x: Math.random(), y: Math.random(), z: Math.random()}), event: "3dpoint"});
}, 5500);
setInterval(function () {
    dataChannel.send({data: 'hi there: ' + (id++)});
}, 3500);

var server = http.createServer(function (req, res) {
    if (req.url.indexOf('/events') === 0) {
        dataChannel.addClient(req, res);
        console.log("Added another client. There are now " + dataChannel.getConnectionCount())
    } else {
        res.writeHead(404, "No such end point")
    }
});

server.listen(8080, '127.0.0.1', function () {
    console.log('Listening for requests on port 8080.');
});

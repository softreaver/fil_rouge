"use-strict";

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');

server.listen(8080);

app.get('/', (req, resp) => {
    console.log("Accueil");
    fs.readFile('views/index.html', 'utf-8', function(error, content) {
        resp.writeHead(200, {"Content-Type": "text/html"});
        resp.end(content);
    });
})

.use((req, resp) => {
    resp.redirect('http://localhost:8080/');
});

// WebSocket
io.sockets.on('connection', socket => {
    console.log('An user just connect, waiting for pseudo ...');

    socket.on('pseudo', pseudo => {
        console.log('Pseudo reçu : ' + pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('connection', pseudo);
    });

    socket.on('message', message => {
        console.log('Broadcasting a message from ' + socket.pseudo + '. MESSAGE => ' + message);
        socket.broadcast.emit('message', {
            text: message,
            pseudo: socket.pseudo
        });
    });
});

console.log('Serveur en ligne ...');

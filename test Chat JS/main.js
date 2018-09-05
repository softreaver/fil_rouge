"use-strict";

//Loading modules
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var ent = require('ent'); // To avoid XSS attack by filtering HTML tags.
var channelsList = [];

//Starting the server
server.listen(3000);
/*
app.get('/', (req, resp) => {
    let ip = req.connection.remoteAddress;
    console.log(`[${ ip }] asked for index.html.`);
    fs.readFile('views/index.html', 'utf-8', function(error, content) {
        resp.writeHead(200, {"Content-Type": "text/html"});
        resp.end(content);
    });
})

.get('/sounds/:fileName', (req, resp) => {
    console.log('Fichier ' + req.params.fileName + ' demandé.');
    resp.sendFile(__dirname + '/sounds/' + req.params.fileName);
})

.use((req, resp) => {
    resp.redirect('http://192.168.10.210:3000/');
});
*/
// WebSocket
io.sockets.on('connection', socket => {
    console.log('An user just connect, waiting for pseudo ...');

    socket.on('pseudo', pseudo => {
        console.log('Pseudo reçu : ' + pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('connection', pseudo);
    });

    socket.on('message', message => {
        if(typeof socket.pseudo !== 'undefined') {
            message = ent.encode(message);
            console.log('Broadcasting a message from ' + socket.pseudo + '. MESSAGE => ' + message);
            socket.broadcast.emit('message', {
                text: message,
                pseudo: socket.pseudo
            });
        } else {
            socket.emit('error', "Vous devez avoir un pseudo!");
        }
    });

    socket.on('disconnect', () => {
        if(typeof socket.pseudo !== 'undefined') {
            console.log(socket.pseudo + " disconnect from server.");
            socket.broadcast.emit('disconnection', socket.pseudo);
        }
    });

    socket.on('joinChannel', channelName => {
        channelsList.push(channelName);
        socket.join(channelName);
    })

    socket.on('checkSocket', () => {
        console.log(io.sockets.clients());
    });
});

var nsp = io.of('private');
nsp.on('connection', socket => {
    console.log('Bienvenue dans l\'espace privé.');


});

console.log('Serveur en ligne ...');

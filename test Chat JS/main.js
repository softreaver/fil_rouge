"use-strict";

//Loading modules
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var ent = require('ent'); // To avoid XSS attack by filtering HTML tags.
var channelsList = [];
var session = require("express-session")({
    secret: "sessionSuperChat",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 259200000}
  }),
  sharedsession = require("express-socket.io-session");

//Starting the server
server.listen(3000);

app.use(session)

.get('/', (req, resp) => {
    let ip = req.connection.remoteAddress;
    console.log(`[${ ip }] asked for index.html.`);
    fs.readFile(__dirname + '/views/index.html', 'utf-8', function(error, content) {
        if(error !== null) {
            console.log(error.message);
            resp.writeHead(500, {"Content-Type": "text/plain"});
            resp.end(error.message);
        } else {
            resp.writeHead(200, {"Content-Type": "text/html"});
            resp.end(content);
        }
    });
})

.get('/css/:fileName', (req, resp) => {
    console.log('Fichier ' + req.params.fileName + ' demandé.');
    resp.sendFile(__dirname + '/css/' + req.params.fileName);
})

.get('/sounds/:fileName', (req, resp) => {
    console.log('Fichier ' + req.params.fileName + ' demandé.');
    resp.sendFile(__dirname + '/sounds/' + req.params.fileName);
});

// WebSocket
io.use(sharedsession(session));

io.sockets.on('connection', socket => {
    console.log('New socket connexion...');
    // Check if user is on session
    socket.handshake.session.reload(err => {
        let sessionIsUp = false;

        if (err) {
            console.log("ERROR occurs when retrieving session = >" + (err.message || err));
        } else {
            if (socket.handshake.session.user && socket.handshake.session.user.pseudo) {
                sessionIsUp = true;
            }
        }

        if (sessionIsUp) {
            // Welcome back
            console.log(`Welcome back ${ socket.handshake.session.user.pseudo }`);
            socket.emit('welcomeBack', socket.handshake.session.user);
        } else {
            // Ask user for his pseudo
            console.log("Request user for pseudo");
            socket.emit('whoAreYou');
        }
    });

    socket.on('pseudo', pseudo => {
        console.log('Pseudo reçu : ' + pseudo);
        socket.handshake.session.user = {pseudo: pseudo, channelsList: ['default']};
        socket.handshake.session.save();
        socket.broadcast.emit('connection', pseudo);
    });

    socket.on('message', (message, channel) => {
        if(typeof socket.handshake.session.user.pseudo !== 'undefined') {
            message = ent.encode(message);
            console.log('Broadcasting a message from ' + socket.handshake.session.user.pseudo + '. MESSAGE => ' + message);

            // Send a message to the channel
            io.to(channel).emit('message', {
                text: message,
                pseudo: socket.handshake.session.user.pseudo,
                channel: channel
            });
        } else {
            socket.emit('error', "Vous devez avoir un pseudo!");
            console.log("ERROR : User has no pseudo yet");
            socket.emit('whoAreYou');
        }
    });

    socket.on('disconnect', () => {
        if(typeof socket.pseudo !== 'undefined') {
            console.log(socket.handshake.session.user.pseudo + " disconnect from server.");
            socket.broadcast.emit('disconnection', socket.handshake.session.user.pseudo);
            delete socket.handshake.session.user;
            socket.handshake.session.save();
        }
    });

    socket.on('joinChannel', channelName => {
        channelsList.push(channelName);
        socket.join(channelName);
    })

    socket.on('createChannel', channelName => {
        channelsList.push(channelName);
        socket.join(channelName);
        socket.handshake.session.user.channelsList
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


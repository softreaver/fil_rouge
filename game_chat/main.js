"use-strict";

// Constants
const SESSION_DURATION = 259200000; // 72 hours
const CRON_TASK_FREQUENCY = 300000; // 5 min

// Globals
var channelsList = [];
var users = [];

// Loading modules
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var ent = require('ent'); // To avoid XSS attack by filtering HTML tags.
var session = require("express-session")({
    secret: "sessionSuperChat",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: SESSION_DURATION}
  }),
  sharedsession = require("express-socket.io-session");

// Cron task to clean userList
setInterval(() => {
    // Check and remove all deleted 
}, CRON_TASK_FREQUENCY);

// Starting the server
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
                if (socket.handshake.session.user.timeOutID) { clearTimeout(socket.handshake.session.user.timeOutID); }
            }
        }

        if (sessionIsUp) {
            // Welcome back
            console.log(`Welcome back ${ socket.handshake.session.user.pseudo }`);
            console.log(socket.handshake.session.user);
            socket.emit('welcomeBack', socket.handshake.session.user);
            socket.join(socket.handshake.session.user.channelsList);
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
            console.log('Broadcasting a message on channel => ' + channel + ' from ' + socket.handshake.session.user.pseudo + '. MESSAGE => ' + message);

            if (channel == 'default')  {
                // Broadcast message to every one
                socket.broadcast.emit('message', {
                    text: message,
                    pseudo: socket.handshake.session.user.pseudo,
                    channel: channel
                });
            } else {
                // Send a message to the channel
                socket.to(channel).emit('message', {
                    text: message,
                    pseudo: socket.handshake.session.user.pseudo,
                    channel: channel
                });
            }
        } else {
            socket.emit('error', "Vous devez avoir un pseudo!");
            console.log("ERROR : User has no pseudo yet");
            socket.emit('whoAreYou');
        }
    });

    socket.on('privateMessage', (pseudo, message) => {
        let socketDest = findSocketByPseudo(pseudo);
        if (socketDest !== null) {
            socketDest.emit('privateMessage', {
                text: message,
                pseudo: socket.handshake.session.user.pseudo,
                channel: null
            });
        }
    });

    socket.on('log off', callback => {
        if(typeof socket.handshake.session.user !== 'undefined') {
            console.log(socket.handshake.session.user.pseudo + " disconnect from server.");

            socket.broadcast.emit('disconnection', socket.handshake.session.user.pseudo);
            delete socket.handshake.session.user;
            socket.handshake.session.save();
            callback(null);
        }
    });

    socket.on('disconnect', () => {
        // trigered when sockets connexion closed
    });

    socket.on('joinChannel', (channelName, callback) => {
        if (channelsList.includes(channelName)) {
            socket.handshake.session.user.channelsList.push(channelName);
            socket.handshake.session.save();
            socket.join(channelName);
            callback(channelName);
        } else {
            callback(null);
        }
    })

    socket.on('createChannel', (channelName, callback) => {
        channelsList.push(channelName);
        socket.join(channelName);
        socket.handshake.session.user.channelsList.push(channelName);
        socket.handshake.session.save();
        callback(channelName);
    })

    socket.on('checkSocket', () => {
        console.log('liste des utilisateurs connectés :');
        for (let socketID in io.sockets.connected) {
            console.log((io.sockets.connected[socketID].handshake.session.user && io.sockets.connected[socketID].handshake.session.user.pseudo) || 'unknown');
        }
        console.log('liste des utilisateurs :');
        for (let socketID in io.sockets.sockets) {
            console.log((io.sockets.sockets[socketID].handshake.session.user && io.sockets.sockets[socketID].handshake.session.user.pseudo) || 'unknown');
        }
    });
});

function findSocketByPseudo (pseudo = null) {
    let socketToReturn = null;
    if (pseudo !== null) {
        for (let socketID in io.sockets.connected) {
            if (io.sockets.connected[socketID].handshake.session.user && 
                io.sockets.connected[socketID].handshake.session.user.pseudo &&
                io.sockets.connected[socketID].handshake.session.user.pseudo == pseudo
            ) {
                socketToReturn = io.sockets.connected[socketID];
                break;
            }
        }
    }

    return socketToReturn;
}

var nsp = io.of('private');
nsp.on('connection', socket => {
    console.log('Bienvenue dans l\'espace privé.');
});

console.log('Serveur en ligne ...');


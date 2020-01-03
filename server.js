// REQUIRED
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const layouts = require('express-ejs-layouts');
// APP REQUIREMENTS
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(layouts);
//  GAME VARIABLES
let choices = [];
let connections = [];
let players = [];
let rocks = 0;
let papers = 0;
let scissors = 0;
// SOCKETS: SERVER
io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log(`Connection established: ${connections.length} sockets connected`);

    socket.on('disconnect', () => {
        players.splice(players.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
        updateUsernames();
        console.log(`Disconnection: ${connections.length} connections remaining`);
    });

    socket.on('add username', (username, callback) => {
        if (players.indexOf(username) > -1) {
            callback(false);
        } else {
            players.push(username);
            console.log(players);
            console.log(players.length);
            callback(true);
            updateUsernames();
            if (Object.keys(players) === 10) {
                io.emit('connected', players);
                io.emit('game start');
            };
        };
    });

    const updateUsernames = () => {
        socket.emit('get players', players);
    };
});
// PAGE RENDER
app.get('/', (req, res) => {
    res.render('index');
});
// SERVER LISTEN
server.listen(3000, () => {
    console.log('up and running');
});
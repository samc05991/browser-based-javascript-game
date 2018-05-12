// Dependencies and classes
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

//server variables
var app = express();
var server = http.Server(app);
var io = socketIO(server);

//set up the port
app.set('port', 5000);

//set where to look for files
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/static/index.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

//List of players
var players = {};

var numberOfPlayers = 0;

//List of soldiers
var soldiers = {};

var numberOfSoldiers = 0;

//When there is a new connection set up sockets
io.on('connection', function(socket) {
    console.log(io.eio);
    socket.on('new player', function() {
        numberOfPlayers++;
        players[socket.id] = {
            id: socket.id,
            position: numberOfPlayers,
            x: 300,
            y: 300
        };
    });

    socket.on('new soldier', function() {
        numberOfSoldiers++
        soldiers[numberOfSoldiers] = {
            owner: socket.id,
            x: addSoldierPosition(socket.id),
            y: addSoldierPosition(socket.id)
        }
    });

    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        // io.sockets.emit('message',player);
        if (data.left) {
        player.x -= 5;
        }
        if (data.up) {
        player.y -= 5;
        }
        if (data.right) {
        player.x += 5;
        }
        if (data.down) {
        player.y += 5;
        }
    });
});

//emit 60times per second the position of the players
setInterval(function() {
  io.sockets.emit('state', players, soldiers);
  moveSoldiers();
}, 1000 / 60);

function addSoldierPosition(playerId){
    return players[playerId].position === 1 ? 100 : 400;
}

function moveSoldiers(){

}
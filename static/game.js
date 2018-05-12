//server variables
var socket = io();

//canvas variables
var canvas;
var context;

//user input variables
var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}

/**
 * Event Handlers
 */
function initializeEventEmitters(){
    document.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 65: // A
            movement.left = true;
            break;
            case 87: // W
            movement.up = true;
            break;
            case 68: // D
            movement.right = true;
            break;
            case 83: // S
            movement.down = true;
            break;
        }
    });
    
    document.addEventListener('keyup', function(event) {
        switch (event.keyCode) {
            case 65: // A
            movement.left = false;
            break;
            case 87: // W
            movement.up = false;
            break;
            case 68: // D
            movement.right = false;
            break;
            case 83: // S
            movement.down = false;
            break;
        }
    });
}

function initializeSockets(){
    /**
     * Sent from server to console.log()
     * param {String} data
     */
    socket.on('message', function(data) {
        console.log(data);
    });

    /**
     * Sent from server to update the screen
     * param {Array} players
     */
    socket.on('state', function(players) {
        context.clearRect(0, 0, 800, 600);
        context.fillStyle = 'green';
        
        for (var id in players) {
            var player = players[id];
            context.beginPath();
            context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
            context.fill();
        }
    });
}

function initializeCanvas(){
    // set up canvas
    canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    context = canvas.getContext('2d');
}

function initializeNewPlayer(){
    socket.emit('new player');
    
    setInterval(function() {
        socket.emit('movement', movement);
    }, 1000 / 60);
}

initializeEventEmitters();
initializeSockets();
initializeCanvas();
initializeNewPlayer();
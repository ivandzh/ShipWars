var express = require("express");
var http = require('http');
var app = express();
var server = http.createServer(app); //create a server with express included
var io = require('socket.io').listen(server); //start socket.io on server start
 
 // serves main page
app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

// serves mobile page
app.get('/mobile', function(req, res){
    res.sendFile(__dirname + '/dist/mobile.html');
});

io.on('connection', function(socket){

    //useful information to pass
    var player = {
        id : socket.id
    };

    //Use convention ON "server socketCommand" --> EMIT "client socketCommand"

    console.log("Player " + socket.id + " connected!");

    socket.on('disconnect', function(){
        console.log("Player " + socket.id + " disconnected!");

        socket.emit("client disconnected", player);
        socket.broadcast.emit("client disconnected", player);
    });

    socket.on('server check start', function(){
        socket.emit("client check start", player);
        socket.broadcast.emit("client check start", player);
        console.log("server check start");
    });

   socket.on('server check done', function(passData){
       console.log(passData);
        socket.emit("client check done", passData);
        socket.broadcast.emit("client check done", passData);
        console.log("server check done");
    });

    socket.on('server new player', function(){
        socket.emit("client new player", player);
        socket.broadcast.emit("client new player", player);
        console.log("server new player");
    });

    socket.on("server up", function () {
        socket.emit("client up", player);
        socket.broadcast.emit("client up", player);
    });

    socket.on("server left", function () {
        socket.emit("client left", player);
        socket.broadcast.emit("client left", player);
    });

    socket.on("server right", function () {
        socket.emit("client right", player);
        socket.broadcast.emit("client right", player);
    });

    socket.on("server left right break", function () {
        socket.emit("client left right break", player);
        socket.broadcast.emit("client left right break", player);
    });

    socket.on("server up left", function () {
        socket.emit("client up left", player);
        socket.broadcast.emit("client up left", player);
    });

    socket.on("server up right", function () {
        socket.emit("client up right", player);
        socket.broadcast.emit("client up right", player);
    });

    socket.on("server shoot", function () {
        socket.emit("client shoot", player);
        socket.broadcast.emit("client shoot", player);
    });

    socket.on('server shooter', function(shooterId){
        socket.emit("client shooter", shooterId);
        socket.broadcast.emit("client shooter", shooterId);
    });

    socket.on('server player win', function(winnerData){
        socket.emit("client player win", winnerData);
        socket.broadcast.emit("client player win", winnerData);
    });
});

var port = process.env.PORT || 5000;
server.listen(port);
console.log("Listening on port " + port);


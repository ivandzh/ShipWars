var express = require("express");
var http = require('http');
 var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
 
 /* serves main page */
app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

app.get('/mobile', function(req, res){
    res.sendFile(__dirname + '/dist/mobile.html');
});

io.on('connection', function(socket){

    var player = {
        id : socket.id
    };

    console.log("User: " + socket.id + " Connected");

    socket.on('disconnect', function(){
        console.log("User: " + socket.id + " Disconnected");

        socket.emit("client disconnected", player);
        socket.broadcast.emit("client disconnected", player);
    });

    socket.on('server checkStart', function(){
        socket.emit("client checkStart", player);
        socket.broadcast.emit("client checkStart", player);
        console.log("server checkStart");
    });

    socket.on('server checkDone', function(playerId, playerNum){
        socket.emit("client checkDone", playerId, playerNum);
        socket.broadcast.emit("client check", playerId, playerNum);
        console.log("server checkDone");
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

    socket.on("server up stop", function () {
        socket.emit("client up down stop", player);
        socket.broadcast.emit("client up down stop", player);
    });

    socket.on("server left right stop", function () {
        socket.emit("client left right stop", player);
        socket.broadcast.emit("client left right stop", player);
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

});

var port = process.env.PORT || 5000;
server.listen(port);
console.log("Listening on port " + port);
/*
var port = process.env.PORT || 5000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });*/

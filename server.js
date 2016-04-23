var express = require("express");
var http = require('http');
 var app = express();
 
 /* serves main page */
app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});
 
  //app.post("/user/add", function(req, res) { 
	/* some server side logic */
	//res.send("OK");
  //});
 
 /* serves all the static files 
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params);
     res.sendfile( __dirname + req.params[0]); 
 });*/
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 5000;
server.listen(port);
console.log("Listening on port " + port);
/*
var port = process.env.PORT || 5000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });*/

//on script start - add new player
Sockets.emit("server new player", null);


var playerId = null;
var spriteNum = null;

//using bean.js for event handling

//Socket handle the UP button
bean.on(document.getElementById("up"), "touchstart", function (e) {
    Sockets.emit("server up", null);
});

bean.on(document.getElementById("up"), "touchend", function (e) {
    Sockets.emit("server up stop", null);
});

//Socket handle the LEFT button
bean.on(document.getElementById("left"), "touchstart", function (e) {
    Sockets.emit("server left", null);
});

bean.on(document.getElementById("left"), "touchend", function (e) {
    Sockets.emit("server left right stop", null);
});

//Socket handle the RIGHT button
bean.on(document.getElementById("right"), "touchstart", function (e) {
    Sockets.emit("server right", null);
});

bean.on(document.getElementById("right"), "touchend", function (e) {
    Sockets.emit("server left right stop", null);
});

//Socket handle the SHOOT button
bean.on(document.getElementById("shoot"), "touchstart", function (e) {
    Sockets.emit("server shoot", null);
});

Sockets.on("client check", function (data) {
    playerId = data.id;
    console.log("Client Check called, result = " + playerId);
});

Sockets.on("client checkDone", function (socketId, socketNum) {
    if (socketId === playerId) {
        spriteNum = socketNum;
        console.log("Client checkDone called, result = " + spriteNum);
    }
});
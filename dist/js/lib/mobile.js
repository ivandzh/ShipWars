//on script start - add new player
Sockets.emit("server new player", null);

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
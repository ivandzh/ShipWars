//on script start - add new player
Sockets.emit("server new player", null);
Sockets.emit("server check start", null);

var playerId = null;
var spriteNum = null;
var shootWin = null;

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

Sockets.on("client check start", function (data) {
    playerId = data.id;
    console.log("Client Check called, result = " + playerId);
});

Sockets.once("client check done", function (passData) {
    console.log("client check done called");
    if (passData.id === playerId) {
        spriteNum = passData.num;
        console.log("Client checkDone called, result = " + spriteNum);
    }
    var imgSource = null;

    /*switch(spriteNum){
        case 1 :
            imgSource = "assets/controller/ranger1.png";
            document.getElementById("displayRanger1").src = imgSource;
            break;
        case 2 :
            imgSource = "assets/controller/ranger2.png";
            document.getElementById("displayRanger2").src = imgSource;
            break;
        case 3 :
            imgSource = "assets/controller/ranger3.png";
            document.getElementById("displayRanger3").src = imgSource;
            break;
        case 4 :
            imgSource = "assets/controller/ranger4.png";
            document.getElementById("displayRanger4").src = imgSource;
            break;
        default :
            imgSource = "";
    }*/

    switch(spriteNum){
        case 1 :
            imgSource = "assets/controller/ranger1.png";
            document.getElementById("displayRanger").src = imgSource;
            break;
        case 2 :
            imgSource = "assets/controller/ranger2.png";
            document.getElementById("displayRanger").src = imgSource;
            break;
        case 3 :
            imgSource = "assets/controller/ranger3.png";
            document.getElementById("displayRanger").src = imgSource;
            break;
        case 4 :
            imgSource = "assets/controller/ranger4.png";
            document.getElementById("displayRanger").src = imgSource;
            break;
        default :
            imgSource = "";
    }
});

Sockets.on("client shooter", function (shooterId) {
    console.log("client shooter called");
    console.log("Shooter ID " + shooterId );
    shootWin = shooterId;
});

Sockets.on("client player win", function (winnerData) {
    console.log("client check done called");
    console.log("Winner ID " + winnerData + " =?= " + shootWin + " =?= " + playerId);
    //console.log("Winner ID " + winnerData.num + " =?= " + spriteNum);
    if (winnerData == shootWin && winnerData == playerId) {
        console.log("Winner is declared!");
        document.getElementById("winnerBanner").style.visibility="visible";
    }
});

window.onbeforeunload = function(event)
{
    return "RELOADING IS CHEATING!";
};

document.getElementById('shootImg').ondragstart = function() { return false; };


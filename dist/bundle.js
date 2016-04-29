(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Player = function (player) {

    //this - reference to Player
    //player - reference to passed parameter in braces

    console.log("Start setting Player");

    var playerBoat = [
        "playerBoat_normal",
        "playerBoat_blue",
        "playerBoat_red",
        "playerBoat_green"
    ];

    //take values from passed player instance
    this.playerId = player.playerId;
    this.playerNum = player.playerNum;

    this.alpha = 1;

    Phaser.Sprite.call(this, player.game, player.x, player.y, playerBoat[player.sprite]); //make sure to limit to 4
    player.game.add.existing(this);
    player.game.physics.enable(this, Phaser.Physics.ARCADE); //enable Arcade physics for the player

    //set anchor of player
    this.anchor.setTo(0.5, 0.5);
    //this.scale.setTo(0.5,0.5);

    //set additional behavioural properties to player
    this.body.collideWorldBounds=true;
    //this.body.drag.set(200);
    this.body.maxVelocity.set(300);

    //set animation
    this.animations.add('kaboom');

    //CREATE EXPLOSION POOL
    this.explosions = player.game.add.group();
    this.explosions.createMultiple(30, 'kaboom');
    this.explosions.forEach(this.setupExplosion, this);

    //add group to game instance from passed player instance
    this.lasers = player.game.add.group();
    //player.game.gameLayers.behindTheShipLayer.add(this.lasers);

    //configure properties for the lasers group
    this.lasers.enableBody = true;
    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lasers.createMultiple(40, 'laser');
    this.lasers.setAll('checkWorldBounds', true);
    this.lasers.setAll('outOfBoundsKill', true);
    this.lasers.setAll('anchor.x', 0.5);
    this.lasers.setAll('anchor.y', 0.5);

    //set laser bullets
    this.laser = null;
    this.laserTime = 0;
    this.laserAudio = player.game.add.audio('laserAudio');

    //create emitters
    this.emitterOne = player.game.add.emitter(0, 0, 5000);
    this.emitterOne.makeParticles('bubble');

    this.emitterTwo = player.game.add.emitter(0, 0, 5000);
    this.emitterTwo.makeParticles('bubble');

    // Attach the emitter to the sprite
    //player.addChild(emitter);

    //position the emitters relative to the sprite's anchor location
    this.emitterOne.x = player.x;
    this.emitterOne.y = player.y;

    this.emitterTwo.x = player.x;
    this.emitterTwo.y = player.y;

    // setup options for the emitters
    this.emitterOne.lifespan = 300;
    this.emitterOne.maxParticleSpeed = new Phaser.Point(50,100);
    this.emitterOne.minParticleSpeed = new Phaser.Point(-50,-100);

    this.emitterTwo.lifespan = 300;
    this.emitterTwo.maxParticleSpeed = new Phaser.Point(10,100);
    this.emitterTwo.minParticleSpeed = new Phaser.Point(-10,-100);

    //swap emitter with player, place underneath
   //player.game.world.swap(this.emitterOne, this);
   //player.game.world.swap(this.emitterTwo, this);
    //player.gameLayers.behindTheShipLayer.add(this.emitterOne);
    //player.gameLayers.behindTheShipLayer.add(this.emitterTwo);

    this.playerController();
};

Player.prototype = Object.create(Phaser.Sprite.prototype); //create a custom Phaser object
Player.prototype.constructor = Player; //set its constructor to the Player function

Player.prototype.update = function() {

};

Player.prototype.playerController = function () {
    //playerObj - local reference to this, to Player
    var playerObj = this;

    //store values in variables to use later
    var acceleration =
    {
        go: 200,
        stop: 0
    };
    var angularVelocity =
    {
        stop : 0,
        neg : -100,
        pos : 100
    };

    //all responses to messages from Sockets, from the mobile controller
   Sockets.on("client check start", function (data) {
        if (data.id === playerObj.playerId) {
            var passData = {
                id: playerObj.playerId,
                num: playerObj.playerNum
            };
            console.log("server check done " + playerObj.playerId + " + " + playerObj.playerNum);
            console.log("server check done collective var ");
            console.log(passData);
            Sockets.emit("server check done", passData);
        }
    });

    Sockets.on("client up", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, acceleration.go, playerObj.body.velocity);
            playerObj.body.angularVelocity = angularVelocity.stop;
        }
    });

    Sockets.on("client left", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.body.angularVelocity = angularVelocity.neg;
        }
    });

    Sockets.on("client right", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.body.angularVelocity = angularVelocity.pos;
        }
    });

    Sockets.on("client left right stop", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.body.angularVelocity = angularVelocity.stop;
        }
    });

    Sockets.on("client up stop", function (data) {
        if (data.id === playerObj.playerId) {
            this.body.drag.set(200);
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, acceleration.stop, playerObj.body.velocity);
            playerObj.body.angularVelocity = angularVelocity.stop;
        }
    });

    Sockets.on("client up right", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, acceleration.go, playerObj.body.velocity);
            playerObj.body.angularVelocity = angularVelocity.pos;
        }
    });

    Sockets.on("client up left", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, acceleration.go, playerObj.body.velocity);
            playerObj.body.angularVelocity = angularVelocity.neg;
        }
    });

    Sockets.on("client shoot", function (data) {
        if (data.id === playerObj.playerId && playerObj.alive) {
            playerObj.fire();
        }
    });
};

Player.prototype.setupExplosion = function () {
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.animations.add('kaboom');
};

//standard shooting function
Player.prototype.fire = function () {
    if (this.game.time.now > this.laserTime) {
        this.laser = this.lasers.getFirstExists(false);
        console.log("Shoot!");
        Helper.getShooter(this.playerId);
        var shooterId = this.playerId;
        Sockets.emit("server shooter", shooterId);

        if (this.laser) {
            this.laser.reset(this.x, this.y);  //was + 25
            this.laser.lifespan = 2000;
            this.laser.rotation = this.rotation;
            this.game.physics.arcade.velocityFromRotation(this.rotation, 400, this.laser.body.velocity);
            this.laserTime = this.game.time.now + 200;
            this.laserAudio.play();
        }
    }
};

module.exports = Player;

},{}],2:[function(require,module,exports){
var Helper = {

    //helper functions accessible from everywhere

    getScreenWidth : function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    },

    getScreenHeight : function () {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    },

    getShooter : function (playerId) {
        window.shooter = playerId;
        console.log("Shooter ID = " + window.shooter);
    }
};

module.exports = Helper;
},{}],3:[function(require,module,exports){
'use strict';

window.Helper = require('./helper'); //make the Helper functions available through the window object
window.Sockets = io(); //make sockets available through the window object
//provides access to them from the whole project

if (document.getElementById("jb-deathmatch")) {

	//initiate Phaser canvas
	var game = new Phaser.Game(Helper.getScreenWidth(), Helper.getScreenHeight(), Phaser.AUTO, 'jb-deathmatch');

	game.state.add('Boot', require('./states/boot'));
	game.state.add('Load', require('./states/load'));
	game.state.add('Menu', require('./states/menu'));
	game.state.add('Play', require('./states/play'));
	game.state.add('Win', require('./states/win'));

	game.state.start('Boot');

}

},{"./helper":2,"./states/boot":4,"./states/load":5,"./states/menu":6,"./states/play":7,"./states/win":8}],4:[function(require,module,exports){
//Using variable assignment to function in order to use the "this" keyword,
// referencing to the function from which the object is called
var Boot = function () {
    console.log("Boot stage initiated!");
};

//Using JavaScript's "prototypical" inheritance system, simulating classes
Boot.prototype = {

    preload: function () {
        this.load.image('loading', 'assets/loadingBar.png');  //changed from preloader
    },

    create: function () {
        this.game.input.maxPointers = 1; //allowed pointers, cursors

        if (this.game.device.desktop) { //check if running on desktop
            this.game.stage.scale.pageAlignHorizontally = true; //center the canvas
        } else { //else set screen for mobile
            this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            this.game.stage.scale.minWidth =  480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 640;
            this.game.stage.scale.maxHeight = 480;
            this.game.stage.scale.forceLandscape = true;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.setScreenSize(true);
        }

        this.game.state.start('Load');
    }
};

module.exports = Boot;
},{}],5:[function(require,module,exports){
var Load = function () {
    this.asset = null;
    this.loadingReady = false;
    console.log("Load stage initiated!");
};

Load.prototype = {

    preload: function () {

        //center a loading bar on the screen
        var x = this.game.width / 2;
        var y = this.game.height / 2;
        this.asset = this.add.sprite(x, y, 'loading');
        this.asset.anchor.setTo(0.5, 0.5);
        var xText = x - 130;
        var yText = y - 100;
        this.text = this.add.text(xText, yText, 'Jetboat Deathmatch', { fill: '#ffffff' });

        this.load.onLoadStart.addOnce(this.onLoadStart, this);
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

        this.load.setPreloadSprite(this.asset);

        // Loading Jetboats
        this.load.image("playerBoat_normal", "assets/jetboats/neutral_ranger.png");
        this.load.image("playerBoat_blue", "assets/jetboats/blue_ranger.png");
        this.load.image("playerBoat_red", "assets/jetboats/red_ranger.png");
        this.load.image("playerBoat_green", "assets/jetboats/green_ranger.png");

        // Loading Bullets
        this.load.image('laser', 'assets/laserpng.png');

        // Loading Explosion
        this.load.spritesheet('kaboom', 'assets/boom.png', 128, 128, 14);

        //Loading Particles
        this.load.image('bubble','assets/bubble.png');

        // Loading Environment Objects
        this.load.image('rock1', 'assets/one_rock.png');
        this.load.image('rock2', 'assets/two_rock.png');
        this.load.image('rock3', 'assets/three_rock.png');
        this.load.image('rock4', 'assets/four_rock.png');
        this.load.image('container2', 'assets/container2.png');
        this.load.image('container1', 'assets/container1.png');
        this.load.image('b_blue_hor', 'assets/b_blue_hor.png');
        this.load.image('b_yellow_hor', 'assets/b_yellow_hor.png');
        this.load.image('b_blue_vert', 'assets/b_blue_vert.png');
        this.load.image('b_yellow_vert', 'assets/b_yellow_vert.png');

        // Loading Background
        this.load.image("backgroundWater", "assets/water.jpg");

        // Loading Menu Title
        this.load.image("menuTitle", "assets/menuTitle.png");
        this.load.image("winTitle", "assets/winTitle.png");

        // Loading Sounds
        this.load.audio('explode', 'assets/audio/explode.ogg');
        this.load.audio('laserAudio', 'assets/audio/laser.wav');
        this.load.audio('winScreen', 'assets/audio/winScreen.ogg');
        this.load.audio('inGameLoop', 'assets/audio/loopGame.wav');
    },

    create: function () {
        this.asset.cropEnabled = false;
    },

    update: function () {
        if (!!this.loadingReady) {
            this.game.state.start('Menu');
            //console.log("Loading completed!")
        }
    },

    onLoadStart: function () {
        this.text.setText("Loading...");
    },

    onLoadComplete: function () {
        this.loadingReady = true;
        this.text.setText("Loading completed!");
    }
};

module.exports = Load;

},{}],6:[function(require,module,exports){
var Menu = function () {
    this.title = null;
    console.log("Menu stage initiated!");
};

Menu.prototype = {

    create: function () {
        this.game.add.tileSprite(0, 0, screen.width, screen.height, "backgroundWater");

        //center image on screen
        var x = this.game.width / 2;
        var y = (this.game.height / 2) + 50;
        this.title = this.game.add.sprite(x, y, 'menuTitle');
        this.title.anchor.setTo(0.5, 0.5);

        //USE FOR IN GAME
        this.titleSequence = this.game.add.audio("inGameLoop");
        this.titleSequence.volume = 0.5;
        this.titleSequence.loop = true;
        this.titleSequence.play();

        //handle click on screen
        this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
        console.log("Start game!");
        this.game.state.start('Play');
    }
};

module.exports = Menu;
},{}],7:[function(require,module,exports){
var Player = require('../entities/player');

var Game = function () {

    this.players = null;
    this.rocks = null;
    this.barrels = null;
    console.log("Play stage initiated");
    this.playersAlive = 0;
    this.gameLayers = null;
};

Game.prototype = {

    create: function () {

        this.setLayers();
        this.setArena();
        this.setPlayers();
        this.setRocks();
        this.setBarrels();
    },

    update: function () {

        var gameObj = this;

        this.game.physics.arcade.collide(this.players, this.players);
        //this.game.physics.arcade.collide(this.players, this.rocks);
        //this.game.physics.arcade.collide(this.players, this.barrels);

        for (var i = 0; i < this.players.children.length; i++) { // for each player

            //play the emitters
            this.players.children[i].emitterOne.emitParticle();
            this.players.children[i].emitterTwo.emitParticle();

            this.players.children[i].emitterOne.x = this.players.children[i].x;
            this.players.children[i].emitterOne.y = this.players.children[i].y;

            this.players.children[i].emitterTwo.x = this.players.children[i].x;
            this.players.children[i].emitterTwo.y = this.players.children[i].y;

            //add these to a group situated behind the player sprite
            this.gameLayers.behindTheBoatLayer.add( this.players.children[i].emitterOne);
            this.gameLayers.behindTheBoatLayer.add(this.players.children[i].emitterTwo);

            this.gameLayers.behindTheBoatLayer.add(this.players.children[i].lasers);

            //in case of player hitting barrel, destroy barrel and player
            this.game.physics.arcade.overlap(this.players.children[i], this.barrels, function (player, barrel) {

                var tweenB = gameObj.game.add.tween(barrel);
                tweenB.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                tweenB.onComplete.add(function () {
                    barrel.kill();
                });
                tweenB.start();

                var tweenP = gameObj.game.add.tween(player);
                tweenP.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                tweenP.onComplete.add(function () {
                    player.kill();
                });
                tweenP.start();

                gameObj.explodeAudio.play(); //explode
                //add explosion sprite
               /* var barrelExpl = player.explosions.getFirstExists(false);
                barrelExpl.reset(player.x - 10, player.y - 10);
                barrelExpl.play('kaboom', 20, false, true);*/

            }, null, this);

            //in case of laser shot to barrel, destroy barrel and bullet
           this.game.physics.arcade.overlap(this.players.children[i].lasers, this.barrels, function (laser, barrel) {

               laser.kill();

                var tween = gameObj.game.add.tween(barrel);
                    tween.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                    tween.onComplete.add(function () {
                        barrel.kill();
                    });
                    tween.start();
               gameObj.explodeAudio.play(); //explode
                //add explosion sprite
                //var barrelExpl = player.explosions.getFirstExists(false);
               // barrelExpl.reset(barrel.x, barrel.y);
                //barrelExpl.play('kaboom', 20, false, true);

            }, null, this);

            //in case of player hitting rock, destroy only player
            this.game.physics.arcade.overlap(this.players.children[i], this.rocks, function (player) {

                var tweenP = gameObj.game.add.tween(player);
                tweenP.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                tweenP.onComplete.add(function () {
                    player.kill();
                });
                tweenP.start();

                gameObj.explodeAudio.play(); //explode
                //add explosion sprite
                /*var playerExpl = player.explosions.getFirstExists(false);
                playerExpl.reset(player.body.x, player.body.y); //experiment
                playerExpl.play('kaboom', 20, false, true);*/

            }, null, this);

            //in case of laser shot to rock, destroy only bullet
            this.game.physics.arcade.overlap(this.players.children[i].lasers, this.rocks, function (laser) {
                laser.kill();
            }, null, this);

            for (var j = 0; j < this.players.children.length; j++) { //for each other player
                if (this.players.children[i].playerId === this.players.children[j].playerId) {
                    continue; //skip if player is the exact same
                }

                this.game.physics.arcade.overlap(this.players.children[i].lasers, this.players.children[j], function (laser, player) {

                    laser.kill();

                    var tweenP = gameObj.game.add.tween(player);
                    tweenP.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                    tweenP.onComplete.add(function () {
                        player.kill();

                        //Check if there is only one player alive, if yes - move to win state.
                            if (gameObj.players.countLiving() == 1 && gameObj.players.countDead() >= 1)
                            {
                                console.log("We have a winner!");
                                console.log(gameObj.players.countDead());
                                console.log(gameObj.players.countLiving());

                                //USE getFirstAlive(), only one will be alive, will return object
                                var lastManStanding = gameObj.players.getFirstAlive();
                                console.log(lastManStanding);
                                var winnerData = {
                                    id : lastManStanding.playerId,
                                    num : lastManStanding.playerNum
                                };
                                Sockets.emit("server player win", winnerData);
                                gameObj.game.cache.removeSound('inGameLoop');
                                gameObj.game.state.start('Win'); // move to win state*/
                            }
                    });
                    tweenP.start();
                    gameObj.explodeAudio.play(); //explode
                    //add explosion sprite
                    /*var playerExpl = player.explosions.getFirstExists(false);
                    playerExpl.reset(player.x, player.y);
                    playerExpl.play('kaboom', 20, false, true);*/
                }, null, this);
            }
                //players hit players explode or not? - No, opportunity to bump a player in an obstacle

        }

    },

    //set the Arena
    setArena : function () {
        var backgroundWaterTile = this.game.add.tileSprite(0, 0, screen.width, screen.height, "backgroundWater");
        this.gameLayers.backgroundLayer.add(backgroundWaterTile);
        this.game.renderer.clearBeforeRender = true;
        this.game.renderer.roundPixels = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.explodeAudio = this.game.add.audio('explode');
    },

    setPlayers : function () {
        //theGameObj
        var gameObj = this;

        this.players = this.game.add.group();
        this.gameLayers.playerLayer.add(this.players);

        Sockets.on("client new player", function (data) {
            gameObj.playersAlive++; //add one to the counter of players alive
                gameObj.players.add(new Player({ //call the Player function from player.js
                    playerNum : gameObj.players.children.length + 1,
                    playerId : data.id,
                    sprite : gameObj.players.children.length, //assign sprite according to playerNum
                    game : gameObj.game,
                    x : gameObj.setX(), //spawning point, might be risky?
                    y : gameObj.setY()
                }));
            console.log("client connected");
        });

        Sockets.on("client disconnected", function (data) {
            for (var i = 0; i < gameObj.players.children.length; i++) {
                if (gameObj.players.children[i].playerId === data.id) {
                    gameObj.players.children[i].destroy(true);
                }
            }
            console.log("client disconnected");
        });
    },

    setX : function () {
        switch (this.playersAlive)
        {
            case 1 :
            case 2 : return 0; break;
            case 3 :
            case 4 : return Helper.getScreenWidth(); break;
        }
    },

    setY : function () {
        switch (this.playersAlive)
        {
            case 1 :
            case 4 : return 0; break;
            case 2 :
            case 3 : return Helper.getScreenHeight(); break;
        }
    },

    setRocks : function () {

        this.rocks = this.game.add.group();
        this.rocks.enableBody = true;
        this.rocks.setAll('anchor.x', 0.5);
        this.rocks.setAll('anchor.y', 0.5);
        this.gameLayers.behindTheBoatLayer.add(this.rocks);


        var SquaredRock = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "rock1");
        var TriangularRock = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "rock2");
        var SquaredRockHor = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "rock3");
        var TriangularRockHor = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "rock4");

        SquaredRock.body.immovable = true;
        TriangularRock.body.immovable = true;
        SquaredRockHor.body.immovable = true;
        TriangularRockHor.body.immovable = true;

        var GreenContainer = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "container1");
        GreenContainer.body.immovable = true;
        var RedContainer = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "container2");
        RedContainer.body.immovable = true;
    },

    setBarrels : function () {

        this.barrels = this.game.add.group();
        this.barrels.enableBody = true;
        this.barrels.setAll('anchor.x', 0.5);
        this.barrels.setAll('anchor.y', 0.5);

        this.gameLayers.behindTheBoatLayer.add(this.barrels);


        for (var i = 0; i < 2; i++) {
            var bBlueHor = this.barrels.create(this.game.world.randomX, this.game.world.randomY, "b_blue_hor");
            var bBlueVert = this.barrels.create(this.game.world.randomX, this.game.world.randomY, "b_blue_vert");
            var bYellowHor = this.barrels.create(this.game.world.randomX, this.game.world.randomY, "b_yellow_hor");
            var bYellowVert = this.barrels.create(this.game.world.randomX, this.game.world.randomY, "b_yellow_vert");

            bBlueHor.body.immovable = true;
            bBlueVert.body.immovable = true;
            bYellowHor.body.immovable = true;
            bYellowVert.body.immovable = true;
        }

    },

    //layer system for managing Z-index of sprites on the canvas
    setLayers : function () {
        this.gameLayers = {
            backgroundLayer: this.add.group(),
            behindTheBoatLayer: this.add.group(),
            playerLayer: this.add.group()
        };
    }

};

module.exports = Game;
},{"../entities/player":1}],8:[function(require,module,exports){
var Win = function () {
    this.title = null;
    console.log("Win stage initiated!");
};

Win.prototype = {

    create: function () {
        this.game.add.tileSprite(0, 0, screen.width, screen.height, "backgroundWater");

        //center image on screen
        var x = this.game.width / 2;
        var y = (this.game.height / 2) + 50;
        this.title = this.game.add.sprite(x, y, 'winTitle');
        this.title.anchor.setTo(0.5, 0.5);

        //USE FOR IN GAME
        this.winScreen = this.game.add.audio("winScreen");
        this.winScreen.volume = 0.6;
        this.winScreen.play();

        //handle click on screen
        this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
        console.log("Play again!");
        //this.game.state.start('Load');
        location.reload();
    }
};

module.exports = Win;
},{}]},{},[3]);

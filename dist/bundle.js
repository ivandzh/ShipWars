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
    this.playerNum = player.playerNum; //!!!!!! changed

    Phaser.Sprite.call(this, player.game, player.x, player.y, playerBoat[player.sprite]); //make sure to limit to 4
    player.game.add.existing(this);
    player.game.physics.enable(this, Phaser.Physics.ARCADE); //enable Arcade physics for the player

    //set anchor and scale of player
    this.anchor.setTo(0.5, 0.5);
    //this.scale.setTo(0.5,0.5);

    //set additional behavioural properties to player
    this.body.collideWorldBounds=true;
    //this.body.drag.set(500);
    //this.body.maxVelocity.set(300);

    //set animation
    this.animations.add('kaboom');
    //CREATE EXPLOSION POOL
    this.explosions = player.game.add.group();
    this.explosions.createMultiple(30, 'kaboom');
    //this.explosions.forEach(setupPlayer, this);

    this.lasers = player.game.add.group(); //add group to game instance from passed player instance

    //configure properties for the lasers group
    this.lasers.enableBody = true;
    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lasers.createMultiple(40, 'laser');
    this.lasers.setAll('checkWorldBounds', true);
    this.lasers.setAll('outOfBoundsKill', true);
    this.lasers.setAll('anchor.x', 0.5);
    this.lasers.setAll('anchor.y', 0.5);
    this.lasers.setAll("scale.x", 0.5);
    this.lasers.setAll("scale.y", 0.5);

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
   // player.game.world.swap(this.emitterOne, player);
   // player.game.world.swap(this.emitterTwo, player);

    this.playerController();
};

Player.prototype = Object.create(Phaser.Sprite.prototype); //create a custom Phaser object
Player.prototype.constructor = Player; //set its constructor to the Player function

Player.prototype.update = function() {

    //this.screenWrap(); //allows infinite traversing of the screen, if left side reached - spawn from right side
};

Player.prototype.playerController = function () {
    //playerObj - local reference to this, to Player
    var playerObj = this;

    //store values in variables to use later
    var acceleration = 200;
    var angularVelocity = {
        stop : 0,
        neg : -100,
        pos : 100
    };

    //all responses to messages from Sockets, from the mobile controller
    Sockets.on("client up", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, acceleration, playerObj.body.velocity);
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
            playerObj.body.angularVelocity = angularVelocity.stop;
        }
    });

    Sockets.on("client up right", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, acceleration, playerObj.body.velocity);
            playerObj.body.angularVelocity = angularVelocity.pos;
        }
    });

    Sockets.on("client up left", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, acceleration, playerObj.body.velocity);
            playerObj.body.angularVelocity = angularVelocity.neg;
        }
    });

    Sockets.on("client shoot", function (data) {
        if (data.id === playerObj.playerId && playerObj.alive) {
            playerObj.fire();
        }
    });
};

/*Player.prototype.screenWrap = function ( ) {
    if (this.x < 0) {
        this.x = this.game.width;
    } else if (this.x > this.game.width) {
        this.x = 0;
    }

    if (this.y < 0) {
        this.y = this.game.height;
    } else if (this.y > this.game.height) {
        this.y = 0;
    }
};*/

//standard shooting function
Player.prototype.fire = function () {
    if (this.game.time.now > this.laserTime) {
        this.laser = this.lasers.getFirstExists(false);
        console.log("Shoot!");

        if (this.laser) {
            this.laser.reset(this.body.x + 25, this.body.y + 25);  //was + 25
            this.laser.lifespan = 2000;
            this.laser.rotation = this.rotation;
            this.game.physics.arcade.velocityFromRotation(this.rotation, 400, this.laser.body.velocity);
            this.laserTime = this.game.time.now + 200;
            this.laserAudio.play();
        }
    }
};

/*Player.prototype.particleEmitter = function (player) {

    //create an emitter
    emitter = player.game.add.emitter(0, 0, 5000);
    emitter.makeParticles('fireblob');

    emitter2 = player.game.add.emitter(0, 0, 5000);
    emitter2.makeParticles('fireblob');

    // Attach the emitter to the sprite
    //player.addChild(emitter);

    //position the emitter relative to the sprite's anchor location
    emitter.x = player.x;
    emitter.y = player.y;

    emitter2.x = player.x;
    emitter2.y = player.y;

    // setup options for the emitter
    emitter.lifespan = 300;
    emitter.maxParticleSpeed = new Phaser.Point(50,100);
    emitter.minParticleSpeed = new Phaser.Point(-50,-100);

    emitter2.lifespan = 300;
    emitter2.maxParticleSpeed = new Phaser.Point(10,100);
    emitter2.minParticleSpeed = new Phaser.Point(-10,-100);

};*/

module.exports = Player;

},{}],2:[function(require,module,exports){
var Helper = {
randomNumber: function(minimum, maximum) {
    return Math.round(Math.random() * (maximum - minimum) + minimum);
},

getScreenWidth : function () {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
},

getScreenHeight : function () {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}
};

module.exports = Helper;
},{}],3:[function(require,module,exports){
'use strict'; //because referencing the window object

window.Helper = require('./helper');
window.Sockets = io();

if (document.getElementById("jb-deathmatch")) {

	//initiate Phaser canvas
	var game = new Phaser.Game(Helper.getScreenWidth(), Helper.getScreenHeight(), Phaser.AUTO, 'jb-deathmatch');

	window.playerState = {
		currentLevel: 'Play'
	};

	game.state.add('Boot', require('./states/boot'));
	game.state.add('Load', require('./states/load'));
	game.state.add('Menu', require('./states/menu'));
	game.state.add('Play', require('./states/play'));
	//game.state.add('Game', require('./states/game'));
	//game.state.add('Win', require('./states/win'));

	game.state.start('Boot');

}

},{"./helper":2,"./states/boot":4,"./states/load":5,"./states/menu":6,"./states/play":7}],4:[function(require,module,exports){
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
var Load = function (game) {
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
        this.load.spritesheet('kaboom', 'assets/boom.png', 128, 128);

        //Loading Particles
        this.load.image('bubble','assets/bubble.png');

        // Loading Environment Objects
        this.load.image('rock1', 'assets/one_rock.png');
        this.load.image('rock2', 'assets/two_rock.png');
        this.load.image('container1', 'assets/container.png');
        this.load.image('b_blue_hor', 'assets/b_blue_hor.png');
        this.load.image('b_yellow_hor', 'assets/b_yellow_hor.png');
        this.load.image('b_blue_vert', 'assets/b_blue_vert.png');
        this.load.image('b_yellow_vert', 'assets/b_yellow_vert.png');

        // Loading Background
        this.load.image("backgroundWater", "assets/water.jpg");

        // Loading Menu Title
        this.load.image("menuTitle", "assets/menuTitle.png");

        // Loading Sounds
        this.load.audio('explode', 'assets/audio/explode.ogg');
        this.load.audio('laserAudio', 'assets/audio/laser.wav');
        this.load.audio('titleSequence', 'assets/audio/titleSequence.wav');
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

        /*this.titleSequence = this.game.add.audio("titleSequence");
        this.titleSequence.volume = 0.3;
        this.titleSequence.play();*/

        this.titleImage();
        this.input.onDown.add(this.onDown, this);

        //USE FOR IN GAME
        this.titleSequence = this.game.add.audio("inGameLoop");
        this.titleSequence.volume = 0.5;
        //this.titleSequence.loop = true;
        this.titleSequence.play();
    },

    update: function () {

    },

    onDown: function () {
        this.titleSequence.loop = false;
        console.log("Start game!");
        this.game.state.start(playerState.currentLevel); //starts Play state defined in Main
    },

    titleImage : function () {
        //center image on screen
        var x = this.game.width / 2;
        var y = (this.game.height / 2) + 50;
        this.title = this.game.add.sprite(x, y, 'menuTitle');
        this.title.anchor.setTo(0.5, 0.5);
    }
};

module.exports = Menu;
},{}],7:[function(require,module,exports){
var Player = require('../entities/player');

var Game = function () {

    this.players = [];
    this.rocks = null;
    this.barrels = null;
    console.log("Play stage initiated");

};

Game.prototype = {

    create: function () {

        this.setArena();
        this.setPlayers();
        this.setRocks();
        this.setBarrels();
    },

    update: function () {

        this.game.physics.arcade.collide(this.players, this.players);
        //this.game.physics.arcade.collide(this.players, this.rocks);
        //this.game.physics.arcade.collide(this.players, this.barrels);
        //this.game.physics.arcade.collide(this.meteors, this.meteors);

        for (var i = 0; i < this.players.length; i++) { // for each player
            //play the emitters
            this.players[i].emitterOne.emitParticle();
            this.players[i].emitterTwo.emitParticle();

            this.players[i].emitterOne.x = this.players[i].x;
            this.players[i].emitterOne.y = this.players[i].y;

            this.players[i].emitterTwo.x = this.players[i].x;
            this.players[i].emitterTwo.y = this.players[i].y;

            //Swapping emitters
            //this.players[i].game.world.swap(this.emitterOne, this.players[i]);
            //this.players[i].game.world.swap(this.emitterTwo, this.players[i]);

            //in case of laser shot to barrel, destroy barrel and bullet
            this.game.physics.arcade.overlap(this.players[i], this.players[i].lasers, this.barrels, function (player, laser, barrel) {
                laser.kill();
                barrel.kill();
                this.explodeAudio.play(); //explode
                //add explosion sprite
                var barrelExpl = player.explosions.getFirstExists(false);
                barrelExpl.reset(barrel.x, barrel.y);
                barrelExpl.play('kaboom', 20, false, true);
            }, null, this);

            //in case of player hitting barrel, destroy barrel and player
            this.game.physics.arcade.overlap(this.players[i], this.barrels, function (player, barrel) {
                player.kill();
                barrel.kill();
                this.explodeAudio.play(); //explode
                //add explosion sprite
                var barrelExpl = player.explosions.getFirstExists(false);
                barrelExpl.reset(barrel.x, barrel.y);
                barrelExpl.play('kaboom', 20, false, true);
            }, null, this);

            //in case of player hitting rock, destroy only player
            this.game.physics.arcade.overlap(this.players[i], this.rocks, function (player) {
                player.kill();
                this.explodeAudio.play(); //explode
                //add explosion sprite
                var playerExpl = player.explosions.getFirstExists(false);
                playerExpl.reset(player.x, player.y);
                playerExpl.play('kaboom', 20, false, true);
            }, null, this);

            //in case of laser shot to rock, destroy only bullet
            /*this.game.physics.arcade.overlap(this.players[i].lasers, this.rocks, function (laser) {
                laser.kill();
            }, null, this);*/

            for (var j = 0; j < this.players.length; j++) { //for each other player
                if (this.players[i].playerId === this.players[j].playerId) {
                    continue; //skip if player is the exact same
                }
                this.game.physics.arcade.overlap(this.players[i].lasers, this.players[j], function (laser, player) {
                    laser.kill();
                    player.kill();
                    this.playerHitAudio.play(); //explode
                    //add explosion sprite
                    var playerExpl = player.explosions.getFirstExists(false);
                    playerExpl.reset(player.x, player.y);
                    playerExpl.play('kaboom', 20, false, true);
                }, null, this);
            }
                //players hit players explode or not?
        }

        /*this.meteors.forEachAlive(function (child) {
            if (child.x < 0) {
                child.x = this.width;
            } else if (child.x > this.width) {
                child.x = 0;
            }

            if (child.y < 0) {
                child.y = this.height;
            } else if (child.y > this.height) {
                child.y = 0;
            }
        }, this.game); //screenWrap function*/

    },

/*    screenWrap : function (sprite, game) {
        if (sprite.x < 0) {
            sprite.x = game.width;
        } else if (sprite.x > game.width) {
            sprite.x = 0;
        }

        if (sprite.y < 0) {
            sprite.y = game.height;
        } else if (sprite.y > game.height) {
            sprite.y = 0;
        }
    },*/

    //set the Arena
    setArena : function () {
        this.game.add.tileSprite(0, 0, screen.width, screen.height, "backgroundWater");
        this.game.renderer.clearBeforeRender = true; // difference ??
        this.game.renderer.roundPixels = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.playingAudio = this.game.add.audio("titleSequence"); //titleSequence  //AUDIO SHOULD BE FIXED
        this.playingAudio.volume = 0.6;
        //this.playingAudio.loop = true; //false?
        this.playingAudio.play();
    },

    setPlayers : function () {
        //theGameObj
        var gameObj = this;

        this.playerHitAudio = this.game.add.audio("explode"); //explode

        Sockets.on("client new player", function (data) {
                gameObj.players.push(new Player({ //call the Player function from player.js
                    playerNum : gameObj.players.length + 1,
                    playerId : data.id,
                    sprite : gameObj.players.length, //assign sprite according to playerNum? check
                    game : gameObj.game,
                    x : gameObj.game.world.randomX, //spawning point, might be risky?
                    y : gameObj.game.world.randomY
                }));
        });

        Sockets.on("client disconnected", function (data) {
            for (var i = 0; i < gameObj.players.length; i++) {
                if (gameObj.players[i].playerId === data.id) {
                    gameObj.players[i].destroy(true);
                    gameObj.players.splice(i, 1);
                }
            }
        });
    },

    setRocks : function () {

        this.rocks = this.game.add.group();
        this.rocks.enableBody = true;
        //this.rocks.physicsBodyType = Phaser.Physics.ARCADE;
        //this.rockHit = this.game.add.audio('explode'); //explode    DOUBLE

        var SquaredRock = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "rock1");
        var TriangularRock = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "rock2");
        var RedContainer = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "container1");

        SquaredRock.body.immovable = true;
        TriangularRock.body.immovable = true;
        RedContainer.body.immovable = true;
    },

    setBarrels : function () {

        var barrelExpl = null;

        this.barrels = this.game.add.group();
        this.barrels.enableBody = true;
        //this.barrels.physicsBodyType = Phaser.Physics.ARCADE;
        this.explodeAudio = this.game.add.audio('explode'); //explode    DOUBLE

        for (var i = 0; i < 2; i++) {
            var bBlueHor = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "b_blue_hor");
            var bBlueVert = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "b_blue_vert");
            var bYellowHor = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "b_yellow_hor");
            var bYellowVert = this.rocks.create(this.game.world.randomX, this.game.world.randomY, "b_yellow_vert");

            bBlueHor.body.immovable = true;
            bBlueVert.body.immovable = true;
            bYellowHor.body.immovable = true;
            bYellowVert.body.immovable = true;
        }

    }

};

module.exports = Game;
},{"../entities/player":1}]},{},[3]);

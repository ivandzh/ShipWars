(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
'use strict';

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

},{"./helper":1,"./states/boot":3,"./states/load":4,"./states/menu":5,"./states/play":6}],3:[function(require,module,exports){
var Boot = function () {
    console.log("Boot stage initiated!");
};

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
},{}],4:[function(require,module,exports){
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
        this.load.image('bullet', 'assets/laserpng.png');

        // Loading Explosion
        this.load.spritesheet('kaboom', 'assets/boom.png', 128, 128);

        //Loading Particles
        this.load.image('bubble','assets/bubble.png');

        // Loading Environment Objects
        this.load.image('rock1', 'assets/one_rock.png');
        this.load.image('rock2', 'assets/two_rock.png');
        this.load.image('container1', 'assets/container.png');
        this.load.image('barrel_blue', 'assets/barrel_b_small.png');
        this.load.image('barrel_yellow', 'assets/barrel_small.png');

        // Loading Background
        this.load.image("backgroundWater", "assets/water.jpg");

        // Loading Menu Title
        this.load.image("menuTitle", "assets/menuTitle.png");

        // Loading Sounds
        this.load.audio('explode', 'assets/audio/explode.ogg');
        this.load.audio('laser', 'assets/audio/laser.wav');
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

},{}],5:[function(require,module,exports){
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
        this.titleSequence.loop = true;
        this.titleSequence.play();
    },

    update: function () {

    },

    onDown: function () {
        console.log("Start game!");
        this.game.state.start(playerState.currentLevel); //starts Game state defined in Main
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
},{}],6:[function(require,module,exports){
//var Player = require('../entities/player');

var Play = function () {

    this.players = [];
    this.meteors = null;
    console.log("Play stage initiated!");
};

/*Game.prototype = {

    create: function () {

        this.setConfig();
        this.setPlayers();
        this.setMeteors();

    },

    update: function () {

        this.game.physics.arcade.collide(this.players, this.meteors);
        this.game.physics.arcade.collide(this.players, this.players);
        this.game.physics.arcade.collide(this.meteors, this.meteors);

        for (var i = 0; i < this.players.length; i++) {

            this.game.physics.arcade.overlap(this.players[i].bullets, this.meteors, function (bullet, meteor) {
                bullet.kill();
                meteor.kill();
                this.meteorAudio.play();
            }, null, this);

            for (var j = 0; j < this.players.length; j++) {
                if (this.players[i].playerId === this.players[j].playerId) {
                    continue;
                }
                this.game.physics.arcade.overlap(this.players[i].bullets, this.players[j], function (bullet, player) {
                    bullet.kill();
                    player.kill();
                    this.playerHitAudio.play();
                }, null, this);
            }

        }

        this.meteors.forEachAlive(function (child) {
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
        }, this.game);

    },

    screenWrap : function (sprite, game) {
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
    },

    setConfig : function () {
        this.game.add.tileSprite(0, 0, screen.width, screen.height, Utils.backgrounds[Utils.randomNumber(0,3)]);
        this.game.renderer.clearBeforeRender = false;
        this.game.renderer.roundPixels = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.playingAudio = this.game.add.audio("playing");
        this.playingAudio.volume = 0.3;
        this.playingAudio.loop = true;
        this.playingAudio.play();
    },

    setPlayers : function () {
        var that = this;

        this.playerHitAudio = this.game.add.audio("playerHit");

        Sockets.on("client new player", function (data) {
            that.players.push(new Player({
                playerNr : that.players.length + 1,
                playerId : data.id,
                sprite : Utils.randomNumber(0,11),
                game : that.game,
                x : that.game.world.randomX,
                y : that.game.world.randomY
            }));
        });

        Sockets.on("client disconnected", function (data) {
            for (var i = 0; i < that.players.length; i++) {
                if (that.players[i].playerId === data.id) {
                    that.players[i].destroy(true);
                    that.players.splice(i, 1);
                }
            }
        });
    },

    setMeteors : function () {

        this.meteors = this.game.add.group();
        this.meteors.enableBody = true;
        this.meteors.physicsBodyType = Phaser.Physics.ARCADE;
        this.meteorAudio = this.game.add.audio('trash');

        for (var i = 0; i < this.game.rnd.between(1,2); i++) {
            var MeteorBrownBigOne = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorBrown_big1");
            var MeteorBrownBigTwo = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorBrown_big2");
            var MeteorBrownBigThree = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorBrown_big3");
            var MeteorBrownBigFour = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorBrown_big4");
            var MeteorGrayBigOne = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorGrey_big1");
            var MeteorGrayBigTwo = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorGrey_big1");
            var MeteorGrayBigThree = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorGrey_big1");
            var MeteorGrayBigFour = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorGrey_big1");
        }

        for (var k = 0; k < this.game.rnd.between(1,3); k++) {
            var MeteorBrownMediumOne = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorBrown_med1");
            var MeteorBrownMediumTwo = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorBrown_med3");
            var MeteorGrayMediumOne = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorGrey_med1");
            var MeteorGrayMediumTwo = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorGrey_med2");
        }

        for (var l = 0; l < this.game.rnd.between(1,4); l++) {
            var MeteorBrownSmallOne = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorBrown_small1");
            var MeteorBrownSmallTwo = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorBrown_small2");
            var MeteorGraySmallOne = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorGrey_small1");
            var MeteorGraySmallTwo = this.meteors.create(this.game.world.randomX, this.game.world.randomY, "meteorGrey_small2");
        }

    }

};*/

module.exports = Play;
},{}]},{},[2]);

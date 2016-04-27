var Player = require('../entities/player');

var Game = function () {

    this.players = [];
    //this.rocks = null;
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

        var gameObj = this

        this.game.physics.arcade.collide(this.players, this.players);
        //this.game.physics.arcade.collide(this.players, this.rocks);
        //this.game.physics.arcade.collide(this.players, this.barrels);

        for (var i = 0; i < this.players.length; i++) { // for each player
            //play the emitters
            this.players[i].emitterOne.emitParticle();
            this.players[i].emitterTwo.emitParticle();

            this.players[i].emitterOne.x = this.players[i].x;
            this.players[i].emitterOne.y = this.players[i].y;

            this.players[i].emitterTwo.x = this.players[i].x;
            this.players[i].emitterTwo.y = this.players[i].y;

            //in case of player hitting barrel, destroy barrel and player
            this.game.physics.arcade.overlap(this.players[i], this.barrels, function (player, barrel) {

                //player.kill();
                //barrel.kill();

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
           this.game.physics.arcade.overlap(this.players[i].lasers, this.barrels, function (laser, barrel) {

               laser.kill();
               //barrel.kill();
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
            this.game.physics.arcade.overlap(this.players[i], this.rocks, function (player) {

                //player.kill();
                var tweenP = gameObj.game.add.tween(player);
                tweenP.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                tweenP.onComplete.add(function () {
                    player.kill();
                });
                tweenP.start();

                //this.game.add.tween(player).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);

                gameObj.explodeAudio.play(); //explode
                //add explosion sprite
                /*var playerExpl = player.explosions.getFirstExists(false);
                playerExpl.reset(player.body.x, player.body.y); //experiment
                playerExpl.play('kaboom', 20, false, true);*/

            }, null, this);

            //in case of laser shot to rock, destroy only bullet
            this.game.physics.arcade.overlap(this.players[i].lasers, this.rocks, function (laser) {
                laser.kill();
            }, null, this);

            for (var j = 0; j < this.players.length; j++) { //for each other player
                if (this.players[i].playerId === this.players[j].playerId) {
                    continue; //skip if player is the exact same
                }
                this.game.physics.arcade.overlap(this.players[i].lasers, this.players[j], function (laser, player) {
                    laser.kill();
                    //player.kill();

                    var tweenP = gameObj.game.add.tween(player);
                    tweenP.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                    tweenP.onComplete.add(function () {
                        player.kill();
                    });
                    tweenP.start();
                    gameObj.playerHitAudio.play(); //explode
                    //add explosion sprite
                    /*var playerExpl = player.explosions.getFirstExists(false);
                    playerExpl.reset(player.x, player.y);
                    playerExpl.play('kaboom', 20, false, true);*/
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

        this.explodeAudio = this.game.add.audio('explode'); //explode    DOUBLE
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
            console.log("Emit Server check!");
            Sockets.emit("server banana", null);
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

    }

};

module.exports = Game;
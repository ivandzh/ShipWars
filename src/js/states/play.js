var Player = require('../entities/player');

var Game = function () {

    this.players = null;
    //this.rocks = null;
    this.barrels = null;
    console.log("Play stage initiated");
    this.deathCounter = 0;
    this.playersAlive = 0;
    this.winnerData = null;
};

Game.prototype = {

    create: function () {

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

            this.winnerData = {
                id: this.players.children[i].playerId,
                num:this.players.children[i].playerNum
            };

            //play the emitters
            this.players.children[i].emitterOne.emitParticle();
            this.players.children[i].emitterTwo.emitParticle();

            this.players.children[i].emitterOne.x = this.players.children[i].x;
            this.players.children[i].emitterOne.y = this.players.children[i].y;

            this.players.children[i].emitterTwo.x = this.players.children[i].x;
            this.players.children[i].emitterTwo.y = this.players.children[i].y;

            //in case of player hitting barrel, destroy barrel and player
            this.game.physics.arcade.overlap(this.players.children[i], this.barrels, function (player, barrel) {

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
                    gameObj.deathCounter++;
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
            this.game.physics.arcade.overlap(this.players.children[i], this.rocks, function (player) {

                //player.kill();
                var tweenP = gameObj.game.add.tween(player);
                tweenP.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                tweenP.onComplete.add(function () {
                    player.kill();
                    gameObj.deathCounter++;
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
            this.game.physics.arcade.overlap(this.players.children[i].lasers, this.rocks, function (laser) {
                laser.kill();
            }, null, this);

            for (var j = 0; j < this.players.children.length; j++) { //for each other player
                if (this.players.children[i].playerId === this.players.children[j].playerId) {
                    continue; //skip if player is the exact same
                }
                var winnerData = {
                    //player: this.players[i],
                    id: this.players.children[i].playerId,
                    num:this.players.children[i].playerNum
                };
                this.game.physics.arcade.overlap(this.players.children[i].lasers, this.players.children[j], function (laser, player) {
                    laser.kill();
                    //player.kill();

                    var tweenP = gameObj.game.add.tween(player);
                    tweenP.to( { alpha: 0 }, 100, Phaser.Easing.Linear.None);
                    tweenP.onComplete.add(function () {
                        player.kill();
                        gameObj.deathCounter++;
                        gameObj.playersAlive--;

                        //Check if there is only one player alive, if yes - move to win state.
                        //console.log("Winner lasers " + winnerData.player.lasers + " =?= " + laser);
                        //if (winnerData.player.lasers == laser) {
                            if (gameObj.playersAlive == 1 && gameObj.deathCounter >= 1)
                            {
                                console.log("We have a winner!");
                                console.log(gameObj.players.countDead());
                                console.log(gameObj.players.countLiving());
                                /*Sockets.emit("server player win", gameObj.winnerData);
                                for (var i = 0; i < gameObj.players.length; i++) {
                                        gameObj.players[i].destroy(true);
                                        gameObj.players.splice(i, 1);
                                        gameObj.players = [];
                                }
                                gameObj.game.cache.removeSound('inGameLoop');
                                gameObj.game.state.start('Win'); // move to win state*/
                            }
                       // }
                    });
                    tweenP.start();
                    gameObj.playerHitAudio.play(); //explode
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
        this.game.add.tileSprite(0, 0, screen.width, screen.height, "backgroundWater");
        this.game.renderer.clearBeforeRender = true; // difference ??
        this.game.renderer.roundPixels = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.playingAudio = this.game.add.audio("titleSequence"); //titleSequence  //AUDIO SHOULD BE FIXED
        //this.playingAudio.volume = 0.6;
        //this.playingAudio.loop = true; //false?
        //this.playingAudio.play();

        this.explodeAudio = this.game.add.audio('explode'); //explode    DOUBLE
    },

    setPlayers : function () {
        //theGameObj
        var gameObj = this;

        this.players = this.game.add.group();

        this.playerHitAudio = this.game.add.audio("explode"); //explode

        Sockets.on("client new player", function (data) {
            gameObj.playersAlive++; //add one to the counter of players alive
                gameObj.players.push(new Player({ //call the Player function from player.js
                    playerNum : gameObj.players.children.length + 1,
                    playerId : data.id,
                    sprite : gameObj.players.children.length, //assign sprite according to playerNum? check
                    game : gameObj.game,
                    x : gameObj.setX(), //spawning point, might be risky?
                    y : gameObj.setY()
                }));

        });

        Sockets.on("client disconnected", function (data) {
            for (var i = 0; i < gameObj.players.length; i++) {
                if (gameObj.players.children[i].playerId === data.id) {
                    gameObj.players.children[i].destroy(true);
                    gameObj.players.splice(i, 1);
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
        //this.rocks.physicsBodyType = Phaser.Physics.ARCADE;
        //this.rockHit = this.game.add.audio('explode'); //explode    DOUBLE


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
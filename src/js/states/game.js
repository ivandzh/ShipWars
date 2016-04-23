//var Player = require('../entities/player');

var Game = function () {

    this.players = [];
    this.meteors = null;
    console.log("Game stage initiated!");
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

module.exports = Game;
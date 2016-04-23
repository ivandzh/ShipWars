var Player = function (player) {

    var playerBoat = [
        "playerBoat_normal",
        "playerBoat_blue",
        "playerBoat_red",
        "playerBoat_green"
    ];

    // Player Reference
    this.playerNr = player.playerNr;
    this.playerId = player.playerId;

    // Bullet Reference
    this.bullet = null;
    this.bullets = player.game.add.group();
    this.bulletTime = 0;

    // Audio Reference
    this.laserAudio = player.game.add.audio('laser');

    Phaser.Sprite.call(this, player.game, player.x, player.y, playerBoat[player.sprite]); //make sure to limit to 4
    player.game.add.existing(this);
    player.game.physics.enable(this, Phaser.Physics.ARCADE);

    this.anchor.setTo(0.5, 0.5);
    this.scale.setTo(0.5,0.5);

    this.body.drag.set(125);
    this.body.maxVelocity.set(250);

    // We create the bullets.
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(40, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll("scale.x", 0.5);
    this.bullets.setAll("scale.y", 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    // Player Controller
    this.playerController();
};

Player.prototype = Object.create(Phaser.Sprite.prototype); //create a custom Phaser object
Player.prototype.constructor = Player; //set its constructor to Player

Player.prototype.update = function() {

    this.screenWrap(); //allows infinite traversing of the screen, if left side reached - spawn from right side
};

Player.prototype.playerController = function () {
    var that = this;

    var angularVelocity = {
        pause : 0,
        negative : -200,
        positive : 200
    };

    var acceleration = {
        pause : 0,
        up : 200,
        down : -200
    };

    Sockets.on("client left", function (data) {
        if (data.id === that.playerId) {
            that.body.angularVelocity = angularVelocity.negative;
        }
    });

    Sockets.on("client right", function (data) {
        if (data.id === that.playerId) {
            that.body.angularVelocity = angularVelocity.positive;
        }
    });

    Sockets.on("client up", function (data) {
        if (data.id === that.playerId) {
            that.game.physics.arcade.accelerationFromRotation(that.rotation, acceleration.up, that.body.acceleration);
        }
    });

    Sockets.on("client down", function (data) {
        if (data.id === that.playerId) {
            that.game.physics.arcade.accelerationFromRotation(that.rotation, acceleration.down, that.body.acceleration);
        }
    });

    Sockets.on("client left right stop", function (data) {
        if (data.id === that.playerId) {
            that.body.angularVelocity = angularVelocity.pause;
        }
    });

    Sockets.on("client up down stop", function (data) {
        if (data.id === that.playerId) {
            that.body.acceleration.set(acceleration.pause);
        }
    });

    Sockets.on("client up right", function (data) {
        if (data.id === that.playerId) {
            that.body.angularVelocity = angularVelocity.positive;
            that.game.physics.arcade.accelerationFromRotation(that.rotation, acceleration.up, that.body.acceleration);
        }
    });

    Sockets.on("client up left", function (data) {
        if (data.id === that.playerId) {
            that.body.angularVelocity = angularVelocity.negative;
            that.game.physics.arcade.accelerationFromRotation(that.rotation, acceleration.up, that.body.acceleration);
        }
    });

    Sockets.on("client down right", function (data) {
        if (data.id === that.playerId) {
            that.body.angularVelocity = angularVelocity.positive;
            that.game.physics.arcade.accelerationFromRotation(that.rotation, acceleration.down, that.body.acceleration);
        }
    });

    Sockets.on("client down left", function (data) {
        if (data.id === that.playerId) {
            that.body.angularVelocity = angularVelocity.negative;
            that.game.physics.arcade.accelerationFromRotation(that.rotation, acceleration.down, that.body.acceleration);
        }
    });

    Sockets.on("client shoot", function (data) {
        if (data.id === that.playerId && that.alive) {
            that.fire();
        }
    });
};

Player.prototype.screenWrap = function ( ) {
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
};

Player.prototype.fire = function () {
    if (this.game.time.now > this.bulletTime) {
        this.bullet = this.bullets.getFirstExists(false);

        if (this.bullet) {
            this.bullet.reset(this.body.x + 25, this.body.y + 25);
            this.bullet.lifespan = 2000;
            this.bullet.rotation = this.rotation;
            this.game.physics.arcade.velocityFromRotation(this.rotation, 400, this.bullet.body.velocity);
            this.bulletTime = this.game.time.now + 200;
            this.laserAudio.play();
        }
    }
};

module.exports = Player;

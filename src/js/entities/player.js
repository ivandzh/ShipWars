var Player = function (player) {

    //this - reference to Player
    //player - reference to passed parameter in braces

    console.log("Start setting Player");

    //create an array of boat sprites
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

    //set additional behavioural properties to player
    this.anchor.setTo(0.5, 0.5);
    this.body.collideWorldBounds=true;
    this.body.drag.set(200);
    this.body.maxVelocity.set(300);

    //set animation
    this.animations.add('kaboom');

    //CREATE EXPLOSION POOL
    this.explosions = player.game.add.group();
    this.explosions.createMultiple(30, 'kaboom');
    this.explosions.forEach(this.setupExplosion, this);

    //add group to game instance from passed player instance
    this.lasers = player.game.add.group();

    //configure properties for the lasers group
    this.lasers.enableBody = true;
    this.lasers.physicsBodyType = Phaser.Physics.ARCADE;
    this.lasers.createMultiple(50, 'laser');
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

    this.playerController();
};

Player.prototype = Object.create(Phaser.Sprite.prototype); //create a custom Phaser object
Player.prototype.constructor = Player; //set its constructor to the Player function

Player.prototype.update = function() {

};

Player.prototype.playerController = function () {
    //playerObj - local reference to this, to Player
    var playerObj = this;

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
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, 200, playerObj.body.velocity);
            playerObj.body.angularVelocity = 0;
        }
    });

    Sockets.on("client left", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.body.angularVelocity = -100;
        }
    });

    Sockets.on("client right", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.body.angularVelocity = 100;
        }
    });

    Sockets.on("client left right break", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.body.angularVelocity = 0;
        }
    });

    Sockets.on("client up right", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, 200, playerObj.body.velocity);
            playerObj.body.angularVelocity = 100;
        }
    });

    Sockets.on("client up left", function (data) {
        if (data.id === playerObj.playerId) {
            playerObj.game.physics.arcade.velocityFromAngle(playerObj.angle, 200, playerObj.body.velocity);
            playerObj.body.angularVelocity = -100;
        }
    });

    Sockets.on("client shoot", function (data) {
        if (data.id === playerObj.playerId && playerObj.alive) {
            playerObj.shoot();
        }
    });
};

Player.prototype.setupExplosion = function () {
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.animations.add('kaboom');
};

//standard shooting function
Player.prototype.shoot = function () {
    if (this.game.time.now > this.laserTime) {
        this.laser = this.lasers.getFirstExists(false);
        console.log("Shoot!");
        //check who is shooting
        Helper.getShooter(this.playerId);
        var shooterId = this.playerId;
        //emit who is shooting
        Sockets.emit("server shooter", shooterId);

        if (this.laser) {
            this.laser.reset(this.x, this.y);
            this.laser.lifespan = 2000;
            this.laser.rotation = this.rotation;
            this.game.physics.arcade.velocityFromRotation(this.rotation, 400, this.laser.body.velocity);
            this.laserTime = this.game.time.now + 200;
            this.laserAudio.play();
        }
    }
};

module.exports = Player;

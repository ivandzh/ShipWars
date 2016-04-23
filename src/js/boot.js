var Boot = function () {

    function test()
    {
        console.log("Boot Module called!");
    }

var game = new Phaser.Game(getScreenWidth(), getScreenHeight(), Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    //game.load.image('sea', 'assets/water5.png');
    game.load.crossOrigin = "Anonymous";

    //new
    game.load.image('fireblob','assets/waterblob.png');
    game.load.image('sea', 'assets/ocean.jpg');
    //game.load.image('island', 'assets/meteorBrown_big1.png');
    //game.load.image('island2', 'assets/meteorGrey_big2.png');
    game.load.image('ship', 'assets/ranger.png');
    game.load.spritesheet('kaboom', 'assets/boom.png', 128, 128);

    game.load.image('rock1', 'assets/two_rock.png');
    game.load.image('rock2', 'assets/one_rock.png');
    game.load.image('container1', 'assets/container.png');

    game.load.image('island', 'assets/barrel_b_small.png');
    game.load.image('island2', 'assets/barrel_small.png');


    game.load.audio('explode', 'assets/audio/explode.ogg');
    //game.load.audio('laser', 'assets/audio/laser.ogg');
    game.load.audio('laser', 'assets/audio/laser.wav');

    game.load.image('bullet', 'assets/laserpng.png');
}

var bullets; var fireRate = 100; var nextFire = 0; var bulletTime = 0;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    tilesprite = game.add.tileSprite(0, 0, getScreenWidth(), getScreenHeight(), 'sea');

    islands = game.add.group();
    islands.enableBody = true;

    rocks = game.add.group();
    rocks.enableBody = true;


    var mainIsland = islands.create(game.world.randomX, game.world.randomY, 'island');
    mainIsland.body.immovable = true;
    var secondIsland = islands.create(game.world.randomX, game.world.randomY, 'island2');
    secondIsland.body.immovable = true;

    var rock1 = rocks.create(game.world.randomX, game.world.randomY, 'rock1');
    rock1.body.immovable = true;
    var rock2 = rocks.create(game.world.randomX, game.world.randomY, 'rock2');
    rock2.body.immovable = true;
    var container1 = rocks.create(game.world.randomX, game.world.randomY, 'container1');
    container1.body.immovable = true;

    //mainIsland.body.clearShapes();
    // mainIsland.body.loadPolygon('sprite_physics', "island");


    player = game.add.sprite(100, 100, 'ship');
    //player.anchor.setTo(0.5, 0.5);


    game.physics.enable(player, Phaser.Physics.ARCADE);
    //game.physics.p2.enable(player);

    player.body.drag.set(500);
    player.body.maxVelocity.set(300);
    player.body.collideWorldBounds=true;

    setupPlayer(player);
    function setupPlayer(player)
    {
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        player.animations.add('kaboom');
        game.playerHitAudio = game.add.audio("explode");
        game.bulletAudio = game.add.audio("laser");
    }

    //player.body.clearShapes();
    //player.body.loadPolygon("sprite_physics", "ship");

    //create an emitter
    emitter = game.add.emitter(0, 0, 5000);
    emitter.makeParticles('fireblob');

    emitter2 = game.add.emitter(0, 0, 5000);
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

    game.world.swap(emitter, player);
    game.world.swap(emitter2, player);

    game.world.swap(rocks, islands);


    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupPlayer, this);

    //fire function
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);


    game.world.swap(bullets, player);

}

function update() {

//player.body.velocity.x = 0;
    // player.body.velocity.y = 0;
    //player.body.angularVelocity = 0;

    game.physics.arcade.overlap(islands, player, playerHitsBarrel, null, this);
    game.physics.arcade.overlap(rocks, player, playerHitsRock, null, this);
    game.physics.arcade.overlap(bullets, islands, function(bullet, island)
    {
        bullet.kill();
        island.kill();

        //island.anchor.x = 0.5;
        //island.anchor.y = 0.5;

        game.playerHitAudio.play();

        var barrelexpl = explosions.getFirstExists(false);
        barrelexpl.reset(bullet.x, bullet.y);
        barrelexpl.play('kaboom', 20, false, true);
    }, null, this);

    // emit a single particle every frame that the mouse is down
    emitter.emitParticle();
    emitter2.emitParticle();

    emitter.x = player.x;
    emitter.y = player.y;

    emitter2.x = player.x;
    emitter2.y = player.y;


    //game.physics.arcade.collide(player, islands);

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        game.physics.arcade.velocityFromAngle(player.angle, 200, player.body.velocity);
        player.body.angularVelocity = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        player.body.angularVelocity = -100;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        player.body.angularVelocity = 100;
    }
    else
    {
        player.body.angularVelocity = 0;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fire();
    }

    //FIRE function

    function fire() {

        game.bulletAudio.play();

        if (game.time.now > bulletTime)
        {
            bullet = bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(player.x, player.y);
                bullet.lifespan = 2000;
                bullet.rotation = player.rotation;
                game.physics.arcade.velocityFromRotation(player.rotation, 400, bullet.body.velocity);
                bulletTime = game.time.now + 200;
                //this.laserAudio.play();
            }
        }

    }


    function playerHitsBarrel(player, islands)
    {
        islands.kill();
        player.kill();

        game.playerHitAudio.play();

        emitter.kill();
        emitter2.kill();

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.x, player.y);
        explosion.play('kaboom', 20, false, true);
        var barrelexpl = explosions.getFirstExists(false);
        barrelexpl.reset(islands.x, islands.y);
        barrelexpl.play('kaboom', 20, false, true);
    }

    function playerHitsRock(player, rocks)
    {
        player.kill();

        game.playerHitAudio.play();

        emitter.kill();
        emitter2.kill();

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.x, player.y);
        explosion.play('kaboom', 20, false, true);
    }

}

function getScreenWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
}

function getScreenHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

};

module.exports = Boot;

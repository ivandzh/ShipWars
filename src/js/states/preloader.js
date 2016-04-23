var Load = function (game) {
    this.asset = null;
    this.ready = false;
    console.log("Load stage initiated!");
};

Load.prototype = {

    preload: function () {

        //add background to the screen!

        //center a loading circle on the screen
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
        this.load.image("playerBoat_normal", "assets/jetboats/blue_ranger.png");
        this.load.image("playerBoat_normal", "assets/jetboats/red_ranger.png");
        this.load.image("playerBoat_normal", "assets/jetboats/green_ranger.png");

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

    },

    create: function () {
        this.asset.cropEnabled = false;
    },

    update: function () {
        if (!!this.ready) {
            this.game.state.start('Menu');
            //console.log("Loading completed!")
        }
    },

    onLoadStart: function () {
        this.text.setText("Loading...");
    },

    onLoadComplete: function () {
        this.ready = true;
        this.text.setText("Loading completed!");
    }
};

module.exports = Load;

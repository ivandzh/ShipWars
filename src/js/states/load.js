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

        // Loading Sounds
        this.load.audio('explode', 'assets/audio/explode.ogg');
        this.load.audio('laserAudio', 'assets/audio/laser.wav');
        //this.load.audio('titleSequence', 'assets/audio/titleSequence.wav');
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

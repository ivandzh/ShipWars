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
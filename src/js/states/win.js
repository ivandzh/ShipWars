var Win = function () {
    this.title = null;
    console.log("Win stage initiated!");
};

Win.prototype = {

    create: function () {
        this.game.add.tileSprite(0, 0, screen.width, screen.height, "backgroundWater");

        this.titleImage();
        this.input.onDown.add(this.onDown, this);

        //USE FOR IN GAME
       /* this.titleSequence = this.game.add.audio("inGameLoop");
        this.titleSequence.volume = 0.5;
        this.titleSequence.loop = true;
        this.titleSequence.play();*/
    },

    update: function () {

    },

    onDown: function () {
        //this.titleSequence.loop = false;
        console.log("Play again!");
        //this.game.state.start(playerState.currentLevel); //starts Play state defined in Main
        this.game.state.start('Menu');
    },

    titleImage : function () {
        //center image on screen
        var x = this.game.width / 2;
        var y = (this.game.height / 2) + 50;
        this.title = this.game.add.sprite(x, y, 'WinTitle');
        this.title.anchor.setTo(0.5, 0.5);
    }
};

module.exports = Win;
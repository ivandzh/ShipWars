var Win = function () {
    this.title = null;
    console.log("Win stage initiated!");
};

Win.prototype = {

    create: function () {
        this.game.add.tileSprite(0, 0, screen.width, screen.height, "backgroundWater");

        //center image on screen
        var x = this.game.width / 2;
        var y = (this.game.height / 2) + 50;
        this.title = this.game.add.sprite(x, y, 'winTitle');
        this.title.anchor.setTo(0.5, 0.5);

        //USE FOR IN GAME
        this.winScreen = this.game.add.audio("winScreen");
        this.winScreen.volume = 0.6;
        this.winScreen.play();

        //handle click on screen
        this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
        console.log("Play again!");
        //this.game.state.start('Load');
        location.reload();
    }
};

module.exports = Win;
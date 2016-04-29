var Menu = function () {
    this.title = null;
    console.log("Menu stage initiated!");
};

Menu.prototype = {

    create: function () {
        this.game.add.tileSprite(0, 0, screen.width, screen.height, "backgroundWater");

        //center image on screen
        var x = this.game.width / 2;
        var y = (this.game.height / 2) + 50;
        this.title = this.game.add.sprite(x, y, 'menuTitle');
        this.title.anchor.setTo(0.5, 0.5);

        //USE FOR IN GAME
        this.titleSequence = this.game.add.audio("inGameLoop");
        this.titleSequence.volume = 0.5;
        this.titleSequence.loop = true;
        this.titleSequence.play();

        //handle click on screen
        this.input.onDown.add(this.onDown, this);
    },

    update: function () {

    },

    onDown: function () {
        console.log("Start game!");
        this.game.state.start('Play');
    }
};

module.exports = Menu;
//Using variable assignment to function in order to use the "this" keyword,
// referencing to the function from which the object is called
var Boot = function () {
    console.log("Boot stage initiated!");
};

//Using JavaScript's "prototypical" inheritance system, simulating classes
Boot.prototype = {

    preload: function () {
        this.load.image('loading', 'assets/loadingBar.png');  //changed from preloader
    },

    create: function () {
        this.game.input.maxPointers = 1; //allowed pointers, cursors

        if (this.game.device.desktop) { //check if running on desktop
            this.game.stage.scale.pageAlignHorizontally = true; //center the canvas
        } else { //else set screen for mobile
            this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            this.game.stage.scale.minWidth =  480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 640;
            this.game.stage.scale.maxHeight = 480;
            this.game.stage.scale.forceLandscape = true;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.setScreenSize(true);
        }

        this.game.state.start('Load');
    }
};

module.exports = Boot;
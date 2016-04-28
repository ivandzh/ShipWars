'use strict';

window.Helper = require('./helper'); //make the Helper functions available through the window object
window.Sockets = io(); //make sockets available through the window object
//provides access to them from the whole project

if (document.getElementById("jb-deathmatch")) {

	//initiate Phaser canvas
	var game = new Phaser.Game(Helper.getScreenWidth(), Helper.getScreenHeight(), Phaser.AUTO, 'jb-deathmatch');

	/*window.playerState = {
		currentLevel: 'Play'
	};*/

	game.state.add('Boot', require('./states/boot'));
	game.state.add('Load', require('./states/load'));
	game.state.add('Menu', require('./states/menu'));
	game.state.add('Play', require('./states/play'));
	game.state.add('Win', require('./states/win'));

	game.state.start('Boot');

}

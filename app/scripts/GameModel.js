/**
 * Created by Miro on 27.11.2014.
 */
missing.module('HandBattle').model('GameModel', ['$scope', 'GameConfig', function($scope, GameConfig){
	var self = this,
		game = GameConfig.games[$scope.game],
		interval,

		//const
		REFRESH_INTERVAL = 20,
		COMPUTER_MODE = "computer";

	// init values
	self.player1 = {
		score : 0,
		gesture: game.options[0]
	};
	self.player2 = {
		score : 0,
		gesture: game.options[0]
	};

	// return random gesture
	self.getRandomGesture = function() {

		function getRandomInt(max) {
			return Math.floor(Math.random() * max);
		}
		return game.options[getRandomInt(game.options.length)];
	};

	// toggle game: start/pause
	self.toggleGame = function(forceStart){
		if (interval || !forceStart) {
			clearInterval(interval);
			interval = null;
			return false;
		} else {
			interval = setInterval(function () {
				self.player2.gesture = self.getRandomGesture();
				if ($scope.mode === COMPUTER_MODE) {
					self.player1.gesture = self.getRandomGesture();
				}
			}, REFRESH_INTERVAL);
			return true;
		}
	};

	// stop game
	self.stop = function(){
		clearInterval(interval);
		interval = null;
		self.player1.score = 0;
		self.player2.score = 0;
		if ($scope.mode === COMPUTER_MODE) {
			self.player1.gesture = null;
		}
		self.player2.gesture = null;
	};

	// validate current state
	self.validateGame = function(){
		if (self.player1.gesture === self.player2.gesture) {
			return 0;
		}
		if (game.superiority[self.player1.gesture] && game.superiority[self.player1.gesture].indexOf(self.player2.gesture) !== -1) {
			self.player1.score++;
			return -1;
		}
		if (game.superiority[self.player2.gesture] && game.superiority[self.player2.gesture].indexOf(self.player1.gesture) !== -1) {
			self.player2.score++;
			return 1;
		}
		throw "Invalid game state";
	};
}]);
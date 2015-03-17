/**
 * Created by Miro on 6.12.2014.
 */
describe('GameModel test: ', function () {
	var gameModel, game, $scope,
		module = missing.module('HandBattle');

	beforeEach(function () {
		$scope = module.$scope;
		gameModel = module.model('GameModel');
	});

	it('should have set initial values', function () {
		game = new gameModel();
		expect(game.player1).toBeDefined();
		expect(game.player2).toBeDefined();
		expect(game.player1.score).toEqual(0);
		expect(game.player2.score).toEqual(0);
	});
	describe('getRandomGesture', function () {
		var gameConfig;
		beforeEach(function(){
			gameConfig = module.configuration('GameConfig').games[$scope.game];
		});
		it('should return a valid gesture', function () {
			game = new gameModel();
			var random = game.getRandomGesture();
			expect(gameConfig.options.indexOf(random)).not.toEqual(-1);
		});
		it('should return first gesture', function () {
			game = new gameModel();

			spyOn(Math,'random').and.returnValue(0);
			var random = game.getRandomGesture();
			expect(random).toEqual(gameConfig.options[0]);
		});
		it('should return last gesture', function () {
			game = new gameModel();

			spyOn(Math,'random').and.returnValue(0.99999);
			var random = game.getRandomGesture();
			expect(random).toEqual(gameConfig.options[gameConfig.options.length - 1]);
		});

	});
	describe('toggleGame', function () {
		var gameConfig;

		beforeEach(function(){
			game = new gameModel();
			jasmine.clock().install();
			gameConfig = module.configuration('GameConfig').games[$scope.game];
		});
		afterEach(function() {
			jasmine.clock().uninstall();
		});

		it('should start game', function () {
			expect(game.toggleGame(true)).toEqual(true);
		});
		it('should pause game if already started', function () {
			expect(game.toggleGame(true)).toEqual(true);
			expect(game.toggleGame(true)).toEqual(false);
		});
		it('should not start game if called to pause', function () {
			expect(game.toggleGame()).toEqual(false);
			expect(game.toggleGame(false)).toEqual(false);
		});
		it('should change gesture of player 2', function () {
			spyOn(Math,'random').and.returnValue(0.99999);
			$scope.mode = "human";
			game.toggleGame(true);
			expect(game.player2.gesture).toEqual(gameConfig.options[0]);
			jasmine.clock().tick(21);
			expect(game.player2.gesture).toEqual(gameConfig.options[gameConfig.options.length - 1]);

		});
		it('should change gesture of player 1 and 2 if mode computer', function () {
			spyOn(Math,'random').and.returnValue(0.99999);
			$scope.mode = "computer";
			game.toggleGame(true);
			jasmine.clock().tick(21);
			expect(game.player2.gesture).toEqual(gameConfig.options[gameConfig.options.length - 1]);
			expect(game.player1.gesture).toEqual(gameConfig.options[gameConfig.options.length - 1]);
		});
	});
	describe('stop', function () {

		beforeEach(function(){
			game = new gameModel();
		});
		it('should reset values', function () {
			$scope.mode = "computer";
			game.player1.score = 5;
			game.player2.score = 4;
			game.player1.gesture = 'abc';
			game.player2.gesture = 'def';
			game.stop();
			expect(game.player1.score).toEqual(0);
			expect(game.player2.score).toEqual(0);
			expect(game.player1.gesture).toBeNull();
			expect(game.player2.gesture).toBeNull();
		});
		it('should not reset player1 gesture if human mode', function () {
			$scope.mode = "human";
			game.player1.gesture = 'abc';
			game.player2.gesture = 'def';
			game.stop();
			expect(game.player1.gesture).toEqual('abc');
			expect(game.player2.gesture).toBeNull();
		});
		it('should reset game to not started state', function () {
			expect(game.toggleGame(true)).toEqual(true);
			game.stop();
			expect(game.toggleGame(true)).toEqual(true);
		});
	});
	describe('validateGame', function () {
		var gamesConfig;

		beforeEach(function(){
			gamesConfig = module.configuration('GameConfig').games;

			gamesConfig.dummyGame = {
				options: ["a", "b", "c", "d"],
				superiority: {
					"a": ["b", "c"]
				}
			};
		});
		afterEach(function(){
			delete gamesConfig.dummyGame;
		});

		it('should return 0 if gestures are equal', function(){
			game = new gameModel();
			game.player1.gesture = "SameValue";
			game.player2.gesture = "SameValue";
			expect(game.validateGame()).toEqual(0);
		});
		it('should return -1 if gesture of player1 beats gesture of player2 ', function(){
			$scope.game = "dummyGame";
			game = new gameModel();
			game.player1.gesture = "a";
			game.player2.gesture = "b";
			expect(game.validateGame()).toEqual(-1);
		});
		it('should return 1 if gesture of player2 beats gesture of player1 ', function(){
			$scope.game = "dummyGame";
			game = new gameModel();
			game.player1.gesture = "b";
			game.player2.gesture = "a";
			expect(game.validateGame()).toEqual(1);
		});
		it('should throw exception if invalid game state', function(){
			$scope.game = "dummyGame";
			game = new gameModel();
			game.player1.gesture = "d";
			game.player2.gesture = "b";
			expect(function(){ game.validateGame(); }).toThrow("Invalid game state");
		});
	});
});
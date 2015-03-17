/**
 * Created by Miro on 25.11.2014.
 */
describe('GameCtrl test: ', function () {
	var ctrl = missing.module('HandBattle').controller('GameCtrl'),
		scope = missing.module('HandBattle').$scope,
		config = missing.module('HandBattle').configuration('GameConfig');

	it('should call reRoute on init', function(){
		var res;
		scope.on('reRoute', function(){res = 123;});
		ctrl.init();
		expect(res).toEqual(123);
	});

	it('should restart game on "game.restart" event', function(){
		ctrl.toggleGame(true);

		scope.player1.score = 5;
		scope.player2.score = 4;
		scope.player1.gesture = 'abc';
		scope.player2.gesture = 'def';

		scope.trigger("game.restart");

		expect(scope.started).toEqual(false);
		expect(scope.player1.score).toEqual(0);
		expect(scope.player2.score).toEqual(0);
		expect(scope.player1.gesture).toEqual(config.games[scope.game].options[0]);
		expect(scope.player2.gesture).toEqual(config.games[scope.game].options[0]);
	});

	describe('selectGesture: ', function(){
		beforeEach(function(){
			config.games.dummyGame = {
				options: ["a", "b", "c", "d"],
				superiority: {
					"a": ["b", "c"]
				}
			};
			scope.game = "dummyGame";
			ctrl.init();
		});

		afterEach(function(){
			//reset state
			scope.game = "default";
			delete config.games.dummyGame;
		});

		it('selectGesture: should set rotation based on gesture and select gesture', function(){

			scope.player1.gesture = "d";
			spyOn(missing, 'addClass').and.callThrough();;
			ctrl.selectGesture("b", 1);
			expect(missing.addClass).toHaveBeenCalledWith(null, 'rotate-3-4');
			expect(scope.player1.gesture).toEqual("b");
		});
		it('selectGesture: should toggle showGo fi visible', function(){

			scope.started = true;
			scope.resulted = true;
			scope.showGo = false;

			scope.player1.gesture = "d";
			ctrl.selectGesture("b", 1);
			expect(scope.showGo).toEqual(true);
		});
	});

	it('toggleGame: should start game when toggle true', function(){
		ctrl.init();
		ctrl.toggleGame(true);
		expect(scope.started).toEqual(true);
		expect(scope.showGo).toEqual(true);
	});
	it('toggleGame: should not start game when toggle true', function(){
		ctrl.toggleGame(false);
		expect(scope.started).toEqual(false);
		expect(scope.showGo).toEqual(false);
	});
	it('toggleGame: should pause game if already started', function(){
		ctrl.toggleGame(true);
		expect(scope.started).toEqual(true);
		ctrl.toggleGame(false);
		expect(scope.started).toEqual(false);
	});

	it('stop: should stop game', function(){
		scope.started = true;
		scope.result = "abc";
		scope.resulted = true;
		scope.showGo = "abc";
		ctrl.stop();
		expect(scope.started).toEqual(false);
		expect(scope.resulted).toEqual(false);
		expect(scope.result).toEqual(0);
		expect(scope.showGo).toEqual(false);
	});

	describe('go: ', function(){
		it('should hide go and set resulted', function(){
			ctrl.init();
			ctrl.toggleGame(true);
			ctrl.go();
			expect(scope.resulted).toEqual(true);
			expect(scope.showGo).toEqual(false);
		});
		it('should show go and reset resulted after 2000ms', function(){
			ctrl.init();
			ctrl.toggleGame(true);
			jasmine.clock().install();
			ctrl.go();

			jasmine.clock().tick(2001);
			expect(scope.resulted).toEqual(false);
			expect(scope.showGo).toEqual(true);

			jasmine.clock().uninstall();
		});
	});
});
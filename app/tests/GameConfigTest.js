/**
 * Created by Miro on 25.11.2014.
 */
describe('game config consistency test: ', function () {
	var config;

	beforeEach(function () {
		config = window.missing.module('HandBattle').configuration('GameConfig');
	});

	it('should have at least one game version', function () {
		expect(config.games).toBeDefined();
		expect(Object.keys(config.games).length).toBeGreaterThan(0);
	});
	it('should have at least one language', function () {
		expect(config.languages).toBeDefined();
		expect(config.languages.length).toBeGreaterThan(0);
	});
	it('every language should be defined in translations', function () {
		for (var i = 0; i < config.languages.length; i++) {
			expect(window.missing.module('HandBattle').translation()[config.languages[i]]).toBeDefined();
		}
	});
	it('should have at least one mode', function () {
		expect(config.modes).toBeDefined();
		expect(config.modes.length).toBeGreaterThan(0);
	});
	it('should have consistent rules in every game', function () {
		var gameKeys = Object.keys(config.games);
		for (var k = 0; k < gameKeys.length; k++) {

			var pairs = [],
				game = config.games[gameKeys[k]];
			for (var i = 0; i < game.options.length - 1; i++) {
				for (var j = i; j < game.options.length - 1; j++) {
					pairs.push([game.options[i], game.options[j+1]]);
				}
			}
			var superior1, superior2;
			for (i=0; i< pairs.length; i++) {
				superior1 = game.superiority[pairs[i][0]].indexOf(pairs[i][1]) !== -1;
				superior2 = game.superiority[pairs[i][1]].indexOf(pairs[i][0]) !== -1;
				expect(!superior1 ^ !superior2).toBeTruthy();
			}
		}
	});
});
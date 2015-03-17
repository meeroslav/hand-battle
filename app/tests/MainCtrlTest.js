/**
 * Created by Miro on 25.11.2014.
 */
describe('MainCtrl test: ', function () {
	var ctrl = missing.module('HandBattle').controller('MainCtrl'),
		scope = missing.module('HandBattle').$scope;

	it('should switch language', function(){
		ctrl.switchLanguage('abc');
		expect(scope.language).toEqual('abc');
		expect(localStorage.getItem("language")).toEqual('abc');
	});
	it('should switch mode', function(){
		var res;
		function onTrigger(){
			res = "123";
		}
		scope.on('game.restart', onTrigger);
		ctrl.switchMode('abc');
		expect(scope.mode).toEqual('abc');
		expect(localStorage.getItem("mode")).toEqual('abc');
		expect(res).toEqual("123");
		scope.off('game.restart', onTrigger);
	});
	it('should switch game', function(){
		var res;
		function onTrigger(){
			res = "123";
		}
		scope.on('game.restart', onTrigger);
		missing.module('HandBattle').configuration('GameConfig').games.abc = {
			options: [],
			superiority: {}
		};

		ctrl.switchGame('abc');
		expect(scope.game).toEqual('abc');
		expect(localStorage.getItem("game")).toEqual('abc');
		expect(res).toEqual("123");
		scope.off('game.restart', onTrigger);
	});
	it('should toggle menu', function(){
		var menuValue = scope.menuVisible;
		ctrl.toggleMenu();
		expect(menuValue).toEqual(!scope.menuVisible);
	});
	it('should toggle settings', function(){
		var settings = scope.settingsVisible;
		ctrl.toggleSettings();
		expect(settings).toEqual(!scope.settingsVisible );
	});
	it('should force value on toggle settings', function(){
		var settings = scope.settingsVisible = true;
		ctrl.toggleSettings(true);
		expect(settings).toEqual(scope.settingsVisible );
		ctrl.toggleSettings(false);
		expect(settings).toEqual(!scope.settingsVisible );
	});
});
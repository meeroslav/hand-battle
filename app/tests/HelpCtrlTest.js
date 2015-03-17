/**
 * Created by Miro on 25.11.2014.
 */
describe('HelpCtrl test: ', function () {
	var ctrl = missing.module('HandBattle').controller('HelpCtrl'),
		scope = missing.module('HandBattle').$scope,
		config = missing.module('HandBattle').configuration('GameConfig');

	it('should call reRoute on init', function(){
		var res;
		scope.on('reRoute', function(){res = 123;});
		ctrl.init();
		expect(res).toEqual(123);
	});
});
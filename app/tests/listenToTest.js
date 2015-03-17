/**
 * Created by Miro on 25.11.2014.
 */
describe('listen.to Test: ', function() {

	function callback(field, old, newValue){
		alert(field + " = " + old + " -> " + newValue);
	}

	beforeEach(function(){
		spyOn(window, 'alert');
	});

	it('should trigger callback on value change', function(){
		var a = {};
		a.listenTo('b', callback);
		a.b = 33;
		expect(window.alert).toHaveBeenCalledWith("b = undefined -> 33");
	});
	it('should not listen to constants', function(){
		var a = {};
		Object.defineProperty(a,'myConstant',{value:111});

		a.listenTo('myConstant', callback);
		a.myConstant = 123;
		expect(a.myConstant).toEqual(111);
		expect(window.alert).not.toHaveBeenCalled();
	});
	it('should properly unbind listener', function(){
		var a = {};
		a.listenTo('b', callback);
		a.b = 33;
		expect(window.alert).toHaveBeenCalledWith("b = undefined -> 33");
		a.unlistenTo('b');
		a.b = 55;
		expect(window.alert).not.toHaveBeenCalledWith("b = undefined -> 55");
	});
});

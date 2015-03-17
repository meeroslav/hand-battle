/**
 * Created by Miro on 17.11.2014.
 *
 * Inspired by object.watch polyfill by Eli Grey (http://eligrey.com)
 */

Object.defineProperty(Object.prototype, "listenTo", {
	enumerable: false
	, configurable: true
	, writable: false
	, value: function (prop, handler) {
		var
			oldval = this[prop]
			, newval = oldval
			, getter = function () {
				return newval;
			}
			, setter = function (val) {
				oldval = newval;
				newval = val;
				handler.call(this, prop, oldval, val);
				return newval;
			}
			;

		if (delete this[prop]) { // can't watch constants
			Object.defineProperty(this, prop, {
				get: getter
				, set: setter
				, enumerable: true
				, configurable: true
			});
		}
	}
});


// object.unwatch
Object.defineProperty(Object.prototype, "unlistenTo", {
	enumerable: false
	, configurable: true
	, writable: false
	, value: function (prop) {
		var val = this[prop];
		delete this[prop]; // remove accessors
		this[prop] = val;
	}
});


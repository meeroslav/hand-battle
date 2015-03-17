/**
 * Created by Miro on 25.11.2014.
 */
describe('missing Framework test: ', function(){
	var missing;

	beforeEach(function(){
		missing = window.missing;
	});

	describe('storage: ', function(){
		it('should set value to localstorage',function(){
			missing.storage.set('AAA','BBB');
			expect(localStorage.getItem('AAA')).toBe('BBB');
		});
		it('should not set new value to localstorage if not forced',function(){
			missing.storage.set('AAA','BBB', true);
			expect(localStorage.getItem('AAA')).toBe('BBB');
			missing.storage.set('AAA','CCC');
			expect(localStorage.getItem('AAA')).toBe('BBB');
		})
		it('should set new value to localstorage if forced',function(){
			missing.storage.set('AAA','BBB', true);
			expect(localStorage.getItem('AAA')).toBe('BBB');
			missing.storage.set('AAA','CCC', true);
			expect(localStorage.getItem('AAA')).toBe('CCC');
		})
		it('should return null if value not set',function(){
			expect(missing.storage.get('BBB')).toBeNull();
		});
		it('should return value from localstorage if exists',function(){
			localStorage.setItem("BBB","CCC");
			expect(missing.storage.get('BBB')).toBe("CCC");
		});
	});
	describe('addClass: ', function(){
		var el;

		beforeEach(function(){
			el = { "className" : ""};
		});

		it('should do nothing if class not defined', function(){
			expect(missing.addClass(el)).toEqual(missing);
			expect(el.className).toEqual("");
		});
		it('should add class to element', function(){
			missing.addClass(el, "AAA");
			expect(el.className).toEqual("AAA");
		});
		it('should add multiple classes to element', function(){
			missing.addClass(el, "AAA");
			missing.addClass(el, "BBB");
			expect(el.className).toEqual("AAA BBB");
		});
		it('should add every class only once', function(){
			missing.addClass(el, "AAA");
			missing.addClass(el, "AAA");
			expect(el.className).toEqual("AAA");
		});
	});
	describe('removeClass: ', function(){
		var el;

		beforeEach(function(){
			el = { "className" : "AAA BBB"};
		});

		it('should do nothing if element not defined', function(){
			expect(missing.removeClass()).toEqual(missing);
			expect(el.className).toEqual("AAA BBB");
		});
		it('should remove single class', function(){
			missing.removeClass(el, "AAA");
			expect(el.className).toEqual("BBB");
		});
		it('should remove multiple classes', function(){
			missing.removeClass(el, "AAA");
			missing.removeClass(el, "BBB");
			expect(el.className).toEqual("");
		});
		it('should remove all classes if class not provided', function(){
			missing.removeClass(el);
			expect(el.className).toEqual("");
		});
	});
	describe('toggleClass: ', function(){
		var el;

		beforeEach(function(){
			el = { "className" : "AAA"};
		});

		it('should do nothing if element not defined', function(){
			expect(missing.toggleClass()).toEqual(missing);
			expect(el.className).toEqual("AAA");
		});
		it('should do nothing if class not defined', function(){
			expect(missing.toggleClass(el)).toEqual(missing);
			expect(el.className).toEqual("AAA");
		});
		it('should toggle single class', function(){
			missing.toggleClass(el, "BBB");
			expect(el.className).toEqual("AAA BBB");
		});
		it('should toggle multiple classes', function(){
			missing.toggleClass(el, "AAA");
			missing.toggleClass(el, "BBB");
			expect(el.className).toEqual("BBB");
		});
		it('should leave unchainged if toggleParam set to true and class exists', function(){
			missing.toggleClass(el, "AAA", true);
			expect(el.className).toEqual("AAA");
		});
		it('should remove class if toggleParam set to false and class exists', function(){
			missing.toggleClass(el, "AAA", false);
			expect(el.className).toEqual("");
		});
	});
	describe('hide: ', function(){
		var el;

		beforeEach(function(){
			el = { "className" : "AAA"};
		});

		it('should do nothing if element not defined', function(){
			expect(missing.hide()).toEqual(missing);
			expect(el.className).toEqual("AAA");
		});
		it('should hide element if provided', function(){
			expect(missing.hide(el)).toEqual(missing);
			expect(el.className).toEqual("AAA hidden");
		});
		it('should set only one hidden class', function(){
			missing.hide(el).hide(el);
			expect(el.className).toEqual("AAA hidden");
		});
	});
	describe('show: ', function(){
		var el;

		beforeEach(function(){
			el = { "className" : "AAA hidden"};
		});

		it('should do nothing if element not defined', function(){
			expect(missing.show()).toEqual(missing);
			expect(el.className).toEqual("AAA hidden");
		});
		it('should show element', function(){
			missing.show(el);
			expect(el.className).toEqual("AAA");
		});
		it('should skip action if already shown', function(){
			missing.show(el).show(el);
			expect(el.className).toEqual("AAA");
		});
	});
	describe('toggleVisibility: ', function(){
		var el;

		beforeEach(function(){
			el = { "className" : "AAA hidden"};
		});

		it('should do nothing if element not defined', function(){
			expect(missing.toggleVisibility()).toEqual(missing);
			expect(el.className).toEqual("AAA hidden");
		});
		it('should show element', function(){
			missing.toggleVisibility(el);
			expect(el.className).toEqual("AAA");
		});
		it('should hide element if toggled twice', function(){
			missing.toggleVisibility(el).toggleVisibility(el);
			expect(el.className).toEqual("AAA hidden");
		});
	});
	describe('render: ', function(){
		it('should render empty template', function(){
			expect(missing.render('', { data: "data" })).toEqual('');
			expect(missing.render('')).toEqual('');
		});
		// following copied from Riot
		it("should render single token", function() {
			expect(missing.render("x")).toEqual("x");
			expect(missing.render("x", {})).toEqual("x");
			expect(missing.render("{{x}}", { x: "x" })).toEqual("x");
			expect(missing.render("{{x}}", { x: "z" })).toEqual("z");
		});
		it("should render multiple tokens", function() {
			expect(missing.render("{{x}}{{y}}", { x: "x", y: "y" })).toEqual("xy");
		});
		it("should render single quotes", function() {
			expect(missing.render("'x'")).toEqual("'x'");
			expect(missing.render("\'x.\';")).toEqual("\'x.\';");
		});
		it("should render empty values", function() {
			expect(missing.render("{{x}}", { x: undefined })).toEqual("");
			expect(missing.render("{{x}}", { x: null })).toEqual("");
			expect(missing.render("{{x}}", { x: true })).toEqual("true");
			expect(missing.render("{{x}}", { x: false })).toEqual("false");
			expect(missing.render("{{x}}", { x: 0 })).toEqual("0");
		});
		it("should render template with spaces", function() {
			expect(missing.render("{{ x }}", { x: 'x' })).toEqual("x");
			expect(missing.render("{{x }}", { x: 'x' })).toEqual("x");
			expect(missing.render("{{ x}}", { x: 'x' })).toEqual("x");
			expect(missing.render("{{  x  }}", { x: 'x' })).toEqual("x");
		});
		it("should render nearby brackets", function() {
			expect(missing.render("{{{x}}", { x: 'x' })).toEqual("{x");
			expect(missing.render("{{x}}}", { x: 'x' })).toEqual("x}");
			expect(missing.render("{{{x}}}", { x: 'x' })).toEqual("{x}");
		});
		it("should render Newline characters", function() {
			expect(missing.render("x\r")).toEqual("x\r");
			expect(missing.render("x\n")).toEqual("x\n");
		});
		it("should render Backslashes", function() {
			expect(missing.render("\\{{x}}", { x: 'x' })).toEqual("\\x");
		});
		it("should do Escaping", function() {
			expect(missing.render("{{x}}", { x: '&' }, true)).toEqual("&amp;");
			expect(missing.render("{{x}}", { x: '"' }, true)).toEqual("&quot;");
			expect(missing.render("{{x}}", { x: '<' }, true)).toEqual("&lt;");
			expect(missing.render("{{x}}", { x: '>' }, true)).toEqual("&gt;");
		});
		it("should do Escaping empty values", function() {
			expect(missing.render("{{x}}", { x: undefined }, true)).toEqual("undefined");
			expect(missing.render("{{x}}", { x: null }, true)).toEqual("");
			expect(missing.render("{{x}}", { x: true }, true)).toEqual("true");
			expect(missing.render("{{x}}", { x: false }, true)).toEqual("false");
			expect(missing.render("{{x}}", { x: 0 }, true)).toEqual("0");
		});
		it("should render Nested objects", function() {
			expect(missing.render("{{x.y}}", { x: { y: 'x' }})).toEqual("x");
		});
		it("should render Undefined properties", function() {
			expect(missing.render("{{x}}", {})).toEqual("");
		});
		it('Can be set to not escape', function(){
			var template = '{{x}}',
				data = {x: '<script>test</script>'};

			expect(missing.render(template, data)).toEqual('<script>test</script>');
		});
	});
	describe('innerHtml: ', function(){
		it('should return id if id not found',function(){
			spyOn(document, 'getElementById').and.returnValue(null);

			expect(missing.innerHtml('ABC')).toEqual('ABC');
		});
		it('should return innerHTML of element',function(){
			spyOn(document, 'getElementById').and.returnValue({innerHTML: 'text'});

			expect(missing.innerHtml('ABC')).toEqual('text');
		});
	});
	describe('module: ', function(){
		it('should create a new module', function(){
			var module = missing.module('DummyName');
			expect(module.configuration).toBeDefined();
			expect(module.translation).toBeDefined();
			expect(module.model).toBeDefined();
			expect(module.controller).toBeDefined();
			expect(module.$scope).toBeDefined();
			expect(module.run).toBeDefined();
		});
		it('should create a single module with unique name', function(){
			var module = missing.module('DummyName');
			module.testField = "ABC";
			expect(missing.module('DummyName').testField).toBeDefined();
		});

		describe('configuration: ', function() {
			it('should create new configuration', function(){
				missing.module('App').configuration('ConfigName', {a:'A'});
				expect(missing.module('App').configuration('ConfigName').a).toEqual('A');
			});
			it('should extend configuration with new data', function(){
				missing.module('App').configuration('ConfigName', {a:'A'});
				missing.module('App').configuration('ConfigName', {b:'B'});
				expect(missing.module('App').configuration('ConfigName')).toEqual({a:'A',b:'B'});
			});
		});
		describe('translation: ', function() {
			it('should add new translation', function(){
				missing.module('App').translation({a:'A'});
				expect(missing.module('App').translation().a).toEqual('A');
			});
			it('should add multiple translations', function(){
				missing.module('App').translation({a:'A'});
				missing.module('App').translation({b:'B'});
				expect(missing.module('App').translation()).toEqual({a:'A',b:'B'});
			});
		});
		describe('model: ', function() {
			it('should return undefined if no param provided', function(){
				expect(missing.module('App').model()).not.toBeDefined();
			});
			it('should add new empty model', function(){
				function foo(){};
				missing.module('App').model('ModelA', [foo]);
				var model = new missing.module('App').model('ModelA')();
				expect(model).toEqual({});
			});
			it('should add new pre-filled model', function(){
				function foo(){
					var self = this;
					self.A = "123";
					self.someMethod = function(){};
				}
				missing.module('App').model('ModelA', [foo]);
				var model = new missing.module('App').model('ModelA')();
				expect(model).not.toEqual({});
				expect(model.A).toBeDefined();
				expect(model.someMethod).toBeDefined();
			});
			it('should inject existing module parts to model', function(){
				missing.module('App').translation({a:'A'});
				missing.module('App').configuration('ConfigB', {b:'B'});
				missing.module('App').$scope.c = 'C';
				function foo(Translations, ConfigB, $scope){
					var self = this;
					self.A = Translations.a;
					self.config = ConfigB.b;
					self.c = $scope.c;
				}
				missing.module('App').model('ModelA', ['Translations','ConfigB','$scope',foo]);
				var model = new missing.module('App').model('ModelA')();
				expect(model.A).toEqual('A');
				expect(model.config).toEqual('B');
				expect(model.c).toEqual('C');
			});
		});
		describe('controller: ', function() {
			it('should return object with clear method if no param provided', function(){
				expect(missing.module('App').controller().clear).toBeDefined();
			});
			it('should add new controller', function(){
				function foo(){};
				var ctrl = missing.module('App').controller('ACtrl', [foo]);
				expect(ctrl).toEqual({});
			});
			it('should add pre-filled controller', function(){
				function foo(){
					var self = this;
					self.A = "123";
					self.someMethod = function(){};
				}
				var ctrl = missing.module('App').controller('ACtrl', [foo]);
				expect(ctrl).not.toEqual({});
				expect(ctrl.A).toBeDefined();
				expect(ctrl.someMethod).toBeDefined();
			});
			it('should inject existing module parts to controller', function(){
				missing.module('App').translation({a:'A'});
				missing.module('App').configuration('ConfigB', {b:'B'});
				missing.module('App').$scope.d = 'D';
				missing.module('App').model('ModelC', [function(){
					var self = this;
					self.c = "CCC";
				}]);
				function foo(Translations, ConfigB, ModelC, $scope){
					var self = this;
					self.A = Translations.a;
					self.config = ConfigB.b;
					self.model = new ModelC();
					self.d = $scope.d;
				}
				var ctrl = missing.module('App').controller('ACtrl', ['Translations', 'ConfigB', 'ModelC', '$scope',foo]);
				expect(ctrl.A).toEqual('A');
				expect(ctrl.config).toEqual('B');
				expect(ctrl.model.c).toEqual('CCC');
				expect(ctrl.d).toEqual('D');
			});
			it('should run $destroy function on clear', function(){
				var val = 0;

				function foo(){
					// nothing
					var self = this;
					val = 1;
					self.$destroy = function(){
						val = 2;
					};
				}
				expect(val).toEqual(0);
				missing.module('App').controller('ACtrl', [foo]);
				expect(val).toEqual(1);
				missing.module('App').controller().clear();
				expect(val).toEqual(2);
			});
		});
		describe("observer: ", function() {
			var el, counter;

			beforeEach(function(){
				counter = 0;
				el = missing.module('App').observer({});
			});

			it("should create single listener", function() {
				el.on("a", function(arg) {
					expect(arg).toEqual(true);
					counter++;
				});
				el.trigger("a", true);
				expect(counter).toEqual(1);
			});
			it("should not create listener if not function", function() {
				el.on("a", (function(arg) {
					if (arg)
						counter += arg;
				})());
				el.trigger("a", 3).trigger("a", 3);
				expect(counter).toEqual(0);
			});
			it("should not create single listener if not function", function() {
				el.one("a", (function(arg) {
					if (arg)
						counter += arg;
				})());
				el.trigger("a", 3);
				expect(counter).toEqual(0);
			});
			it("should create multiple listeners", function() {
				// try with special characters on event name
				el.on("b/4 c-d d:x", function() {
					counter++;
				});

				el.one("d:x", function(arg) {
					expect(arg).toEqual(true);
					counter++;
				});

				el.trigger("b/4").trigger("c-d").trigger("d:x", true);
				expect(counter).toEqual(4);
			});
			it("should respond to single event", function() {
				el.one("g", function() {
					counter++;
				});

				el.trigger("g").trigger("g");
				expect(counter).toEqual(1);
			});
			it("should respond to one & on", function() {
				el.one("y", function() {
					counter++;
				}).on("y", function() {
					counter++;
				}).trigger("y").trigger("y");

				expect(counter).toEqual(3);
			});
			it("should not respond after remove listeners", function() {
				function r() {
					counter++;
				}

				el.on("r", r).on("s", r).off("s", r).trigger("r").trigger("s");
				expect(counter).toEqual(1);
			});
			it("should remove just one listener", function() {
				function r() {
					counter++;
				}
				function r2() {
					counter++;
				}

				el.on("s", r).on("s", r2).off("s", r2).trigger("s");
				expect(counter).toEqual(1);
			});
			it("should remove multiple listeners", function() {
				function fn() {
					counter++;
				}

				el.on("a1 b1", fn).on("c1", fn).off("a1 c1").trigger("a1").trigger("b1").trigger("c1");
				expect(counter).toEqual(1);
			});
			it("should not create duplicate callbacks", function() {
				function fn() {
					counter++;
				}

				el.on("a1", fn).on("a1", fn).trigger("a1");
				expect(counter).toEqual(1);
			});
			it("does not call trigger infinitely if first call is ongoing", function() {
				var otherEl = missing.module('App').observer({});

				el.on("update", function(value) {
					if (counter++ < 2) { // 2 calls are enough to know the test failed
						otherEl.trigger("update", value);
					}
				});
				otherEl.on("update", function(value) {
					el.trigger("update", value);
				});
				el.trigger("update", "foo");

				expect(counter).toEqual(1);
			});
			it("should be able to trigger events inside a listener", function() {
				var e2 = false;

				el.on("e1", function() { this.trigger("e2"); });
				el.on("e2", function() { e2 = true; });
				el.trigger("e1");

				expect(e2).toBeTruthy();
			});
			it("should accept multiple arguments", function() {
				el.on("e1", function(a, b) {
					expect(a).toEqual(1);
					expect(b).toEqual([2]);
					counter++;
				});

				el.trigger("e1", 1, [2]);
				expect(counter).toEqual(1);
			});
			it("should remove all listeners with *", function() {
				function fn() {
					counter++;
				}
				el.on("aa", fn).on("aa", fn).on("bb", fn);
				el.off("*")

				el.trigger("aa").trigger("bb");

				expect(counter).toEqual(0);
			});
			it("should remove specific listener", function() {
				var one = 0,
					two = 0;

				function fn() {
					one++;
				}

				el.on("bb", fn).on("bb", function() {
					two++;
				});

				el.trigger("bb");
				el.off("bb", fn);
				el.trigger("bb");

				expect(one).toEqual(1);
				expect(two).toEqual(2);

				// should not throw internal error
				el.off("non-existing", fn);
			});
		});
		describe('redraw bindings [mBind] ', function() {
			var module;

			beforeEach(function(){
				jasmine.clock().install();
				module = missing.module('DummyName');
				module.translation({'klingon':{'test':'waH', 'notFail':'not vIyajbe\'', 'deep':{'link':'Value'}}});
			});
			afterEach(function() {
				jasmine.clock().uninstall();
			});
			it('should do nothing if value not in scope or translation', function(){
				var html = '<div id="location" m-bind="location"></div>';
				document.body.innerHTML = html;
				module.$scope.location = "Neverland";
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").innerHTML).toEqual('');
			});
			it('should replace translation deep value in binding after digest', function(){
				var html = '<div id="location" m-bind="Translation.deep.link"></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				expect(document.getElementById("location").innerHTML).toEqual('');
				jasmine.clock().tick(51);
				expect(document.getElementById("location").innerHTML).toEqual('Value');
			});
			it('should not replace translation deep value in binding if not found', function(){
				var html = '<div id="location" m-bind="Translation.deep.link."></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				expect(document.getElementById("location").innerHTML).toEqual('');
				jasmine.clock().tick(51);
				expect(document.getElementById("location").innerHTML).toEqual('');
			});
			it('should replace scope value in binding after digest', function(){
				var html = '<div id="location" m-bind="Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.location = "Neverland";
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				expect(document.getElementById("location").innerHTML).toEqual('');
				jasmine.clock().tick(51);
				expect(document.getElementById("location").innerHTML).toEqual('Neverland');
			});
			it('should not replace value if not in scope', function(){
				var html = '<div id="location" m-bind="Scope.unknown"></div>';
				document.body.innerHTML = html;
				module.$scope.location = "Neverland";
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").innerHTML).toEqual('');
			});
			it('should replace translation in binding', function(){
				var html = '<div id="location" m-bind="Translation.notFail"></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").innerHTML).toEqual("not vIyajbe'");
			});
			it('should not replace translation in binding if not found', function(){
				var html = '<div id="location" m-bind="Translation.unknown"></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").innerHTML).toEqual("");
			});
			it('should evaluate only first binding if multiple found on element', function(){
				var html = '<div id="location" m-bind="Translation.notFail" m-bind="Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.location = "Neverland";
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").innerHTML).toEqual("not vIyajbe'");
			});
		});
		describe('redraw classes [mClass] ', function() {
			var module;

			beforeEach(function(){
				document.body.innerHTML = "";
				jasmine.clock().install();
				module = missing.module('DummyName');
				module.translation({'klingon':{'test':'waH', 'notFail':'not vIyajbe\''}});
			});
			afterEach(function() {
				jasmine.clock().uninstall();
			});
			it('should throw exception if invalid m-class definition - missing ":"', function(){
				var html = '<div id="location" m-class="location"></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				expect(function(){ module.$scope.$redraw(); jasmine.clock().tick(51); }).toThrow("Invalid m-class definition");
			});
			it('should throw exception if invalid m-class definition - missing "=="', function(){
				var html = '<div id="location" m-class="location:Neverland"></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				expect(function(){ module.$scope.$redraw(); jasmine.clock().tick(51); }).toThrow("Invalid m-class definition");
			});
			it('should throw exception if invalid m-class definition - missing "Scope"', function(){
				var html = '<div id="location" m-class="location:Neverland==location"></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				expect(function(){ module.$scope.$redraw(); jasmine.clock().tick(51); }).toThrow("Invalid m-class definition");
			});
			it('should set class if expression is truthy', function(){
				var html = '<div id="location" m-class="selected:Neverland==Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.location = "Neverland";
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").className).toEqual("selected");
			});
			it('should not set class if expression is falsy', function(){
				var html = '<div id="location" m-class="selected:Neverland==Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.location = "NotNeverland";
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").className).toEqual("");
			});
			it('should not set class if expression is false', function(){
				var html = '<div id="location" m-class="selected:false==Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").className).toEqual("");
			});
			it('should set class if expression is not false', function(){
				var html = '<div id="location" m-class="selected:false!=Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").className).toEqual("selected");
			});
			it('should set class if expression is true', function(){
				var html = '<div id="location" m-class="selected:true==Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.location = true;
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").className).toEqual("selected");
			});
			it('should set class if scope value equals given number', function(){
				var html = '<div id="location" m-class="selected:13==Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.location = 13;
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").className).toEqual("selected");
			});
			it('should remove class if expression is falsy', function(){
				var html = '<div id="location" class="selected" m-class="selected:Neverland==Scope.location"></div>';
				document.body.innerHTML = html;
				module.$scope.location = "NotNeverland";
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").className).toEqual("");
			});
			it('should toggle multiple classes', function(){
				var html = '<div id="location" class="selected" m-class="selected:Neverland==Scope.location;correct:Scope.letter==b"></div>';
				document.body.innerHTML = html;
				module.$scope.location = "NotNeverland";
				module.$scope.letter = "b";
				module.$scope.language = 'klingon';
				module.$scope.$redraw();
				jasmine.clock().tick(51);
				expect(document.getElementById("location").className).toEqual("correct");
			});
		});
		describe('$scope $save ', function() {
			var module;

			beforeEach(function () {
				document.body.innerHTML = "";
				module = missing.module('DummyName');
			});

			it('should save new parameter to scope', function(){
				module.$scope.$save('ABC', 'DEF');
				expect(module.$scope.ABC).toEqual('DEF');
			});
			it('should save new parameter to storage', function(){
				module.$scope.$save('ABC', 'DEF');
				expect(missing.storage.get('ABC')).toEqual('DEF');
			});

		});
	});


});
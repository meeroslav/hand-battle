/**
 * Created by Miro on 17.11.2014.
 * Simple framework inspired by Angular.JS and Riot.JS
 */
(function(window){
    'use strict';

    var missing = window.missing || (window.missing = {}),
        doc = document,

        modules = {},
        templates = {},
        // constants
        DIGEST_INTERVAL = 50,
        TEMPLATE_ESCAPE = {"\\": "\\\\", "\n": "\\n", "\r": "\\r", "'": "\\'"},
        RENDER_ESCAPE = {'&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;'};

    //////////////////////////////////////
    // Helper internal methods
    /////////////////////////////////////
    // Simple object extension
    function extend(result){
        var obj;
        result = result || {};

        for (var i = 1; i < arguments.length; i++) {
            obj = arguments[i];

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) ) {
                        result[key] = extend(result[key], obj[key]);
                    } else {
                        result[key] = obj[key];
                    }
                }
            }
        }
        return result;
    }
    // escape function
    function default_escape_fn(str) {
        return str === null ? '' : (str+'').replace(/[&"<>]/g, function(char) {
            return RENDER_ESCAPE[char];
        });
    }
    //////////////////////////////////////
    // Helper external methods
    /////////////////////////////////////

    // Local storage handler
    missing.storage = {
        get: function(key){
            return localStorage.getItem(key)
        },
        set: function(key, value, force){
            if (force || !missing.storage.get(key)) {
                localStorage.setItem(key, value);
            }
            return localStorage.getItem(key);
        }
    };

    // Class manipulation
    // Add class to element
    missing.addClass = function(el, className){
        if (!el || !className) {
            return missing;
        }
        if (el.className.indexOf(className) !== -1) {
            return;
        }
        el.className = (el.className + " " + className).trim();
        return missing;
    };
    // Remove class from element
    missing.removeClass = function(el, className){
        if (!el) {
            return missing;
        }
        className = className || el.className;
        el.className = el.className.replace(className,"").replace("  "," ").trim();
        return missing;
    };
    // Toggle class
    missing.toggleClass = function(el, className, toggleParam){
        if (!el || !className) {
            return missing;
        }
        if (typeof toggleParam === 'undefined' && el.className.indexOf(className) !== -1) {
            toggleParam = false;
        }
        if (typeof toggleParam === 'undefined' && el.className.indexOf(className) === -1) {
            toggleParam = true;
        }
        if (toggleParam) {
            missing.addClass(el, className);
        } else {
            missing.removeClass(el, className);
        }
        return missing;
    };
    // Hide element by applying class 'hidden'
    missing.hide = function(el){
        if (el) {
            missing.addClass(el,'hidden');
        }
        return missing;
    };
    // Show element by removing class 'hidden'
    missing.show = function(el){
        if (el) {
            missing.removeClass(el, 'hidden');
        }
        return missing;
    };
    // Toggle element's visibility by modifying existence of 'hidden' class
    missing.toggleVisibility = function(el){
        if (el) {
            missing.toggleClass(el, 'hidden');
        }
        return missing;
    };

    // Template rendering
    missing.render = function(tmpl, data, escape_fn) {
        if (escape_fn === true) {
            escape_fn = default_escape_fn;
        }
        tmpl = tmpl || '';

        return (templates[tmpl] = templates[tmpl] || new Function("_", "e", "return '" +
        tmpl.replace(/[\\\n\r']/g, function(char) {
            return TEMPLATE_ESCAPE[char];
        }).replace(/{{\s*([\w\.]+)\s*}}/g, "' + (e?e(_.$1,'$1'):_.$1||(_.$1==undefined?'':_.$1)) + '") + "'")
        )(data, escape_fn);
    };
    missing.innerHtml = function(id){
        var el = doc.getElementById(id);
        return el ? el.innerHTML : id;
    };
    missing.injectTemplate = function(parentId, templateId, data, append){
        var parent = doc.getElementById(parentId);
        parent && (parent.innerHTML = (append ? parent.innerHTML : '') +
            missing.render(missing.innerHtml(templateId), data));
    };

    //////////////////////////////////////
    // Module, core of framework
    /////////////////////////////////////

    function Module(name){
        var self = {},
            configurations = {},
            models = {},
            translations,
            controllers = {},
            digestCycle;

        self.configuration = function(name, data) {
            if (data) {
                configurations[name] = extend(configurations[name] || {}, data);
            } else {
                return configurations[name];
            }
        };

        self.translation = function(data) {
            if (data) {
                translations = extend(translations || {}, data);
            } else {
                return translations;
            }
        };

        self.model = function(name, fn){
            if (fn){
                var params;
                params = fn.splice(0, fn.length - 1);
                models[name] = function(){
                    var replacedParams = [],
                        scope = {};
                    // replace named dependencies with actual data
                    for (var i=0; i<params.length; i++){
                        if (params[i] === "$scope") {
                            replacedParams.push(self.$scope);
                        }
                        if (configurations[params[i]]) {
                            replacedParams.push(configurations[params[i]]);
                        }
                        if (params[i] === "Translations") {
                            replacedParams.push(translations);
                        }
                    }

                    fn[0].apply(scope, replacedParams);
                    return scope;
                };
            }
            if (name){
                return models[name];
            }
        };

        self.controller = function(name, fn) {
            if (fn) {
                var params;
                params = fn.splice(0, fn.length - 1);
                controllers[name] = (function(){
                    var replacedParams = [],
                        scope = {};
                    // replace named dependencies with actual data
                    for (var i=0; i<params.length; i++){
                        if (params[i] === "$scope") {
                            replacedParams.push(self.$scope);
                        }
                        if (configurations[params[i]]) {
                            replacedParams.push(configurations[params[i]]);
                        }
                        if (models[params[i]]) {
                            replacedParams.push(models[params[i]]);
                        }
                        if (params[i] === "Translations") {
                            replacedParams.push(translations);
                        }
                    }

                    fn[0].apply(scope, replacedParams);
                    return scope;
                })();
            }
            if (name) {
                return controllers[name];
            } else {
                return {
                    clear: function(){
                        for (var controllerName in controllers){
                            if (controllers.hasOwnProperty(controllerName) && controllers[controllerName].$destroy) {
                                controllers[controllerName].$destroy();
                            }
                        }
                    }
                }
            }
        };

        function findDeepValue(obj, value) {
            if (value === "") {
                return null;
            }
            if (obj.hasOwnProperty(value)) {
                return obj[value];
            }
            var slices = value.split('.',1);
            if (obj.hasOwnProperty(slices[0])) {
                return findDeepValue(obj[slices[0]], value.slice(slices[0].length + 1));
            }
            return null;
        }

        // binds value to element from scope or translation
        // usage <div m-bind="Translation.key">...</div> -> <div m-bind="Translation.key">Value from translation</div>
        // usage <div m-bind="Scope.field">...</div> -> <div m-bind="Scope.field">Field value</div>
        function _mBind(translation){
            var elements = doc.querySelectorAll('[m-bind]'),
                attributeValue;
            for(var i=0; i < elements.length; i++){
                attributeValue = elements[i].getAttribute("m-bind");

                if (attributeValue.indexOf('Translation') === 0){
                    elements[i].innerHTML = findDeepValue(translation, attributeValue.slice(12));
                }
                if (attributeValue.indexOf('Scope') === 0){
                    elements[i].innerHTML = findDeepValue(self.$scope, attributeValue.slice(6));
                }
            }
        }

        // binds class to element if condition is satisfied
        // Expects following attribute:
        // [m-class="className1:valueToCheck==valueToCompare"] or
        // [m-class="className1:valueToCompare==valueToCheck"] where at least one should be from Scope
        //
        // usage <div m-class="className1:Scope.field==someValue">...</div> -> when condition is satisfied
        // returns <div m-class="className1:Scope.field==someValue" class="className1">...</div>
        function _mClass(){
            var elements = doc.querySelectorAll('[m-class]'),
                attributeValues, parts, expressionParts, equalityIndicator;
            for(var i=0; i < elements.length; i++) {
                attributeValues = elements[i].getAttribute("m-class").split(';');
                for(var j=0; j < attributeValues.length; j++){
                    parts = attributeValues[j].split(':');
                    if (parts.length !== 2) {
                        throw "Invalid m-class definition";
                    }
                    equalityIndicator = false;
                    expressionParts = parts[1].split('==');
                    if (expressionParts.length !== 2) {
                        expressionParts = parts[1].split('!=');
                        if (expressionParts.length !== 2) {
                            throw "Invalid m-class definition";
                        } else {
                            equalityIndicator = true;
                        }
                    }
                    if (expressionParts[0].indexOf('Scope') === 0) {
                        missing.toggleClass(elements[i], parts[0],
                            findDeepValue(self.$scope, expressionParts[0].slice(6)) === convertToType(expressionParts[1]) ^ equalityIndicator);
                    } else if (expressionParts[1].indexOf('Scope') === 0) {
                        missing.toggleClass(elements[i], parts[0],
                            findDeepValue(self.$scope, expressionParts[1].slice(6)) === convertToType(expressionParts[0]) ^ equalityIndicator);
                    } else {
                        throw "Invalid m-class definition";
                    }
                }
            }
        }

        function convertToType(value){
            if (value === "true") {
                return true;
            }
            if (value === "false") {
                return false;
            }
            if (Number(value)){
                return Number(value);
            }
            return value;
        }

        // observable function, possibility to callbacks to events
        self.observer = function(el) {
            var callbacks = {}, slice = [].slice;

            el.on = function(events, fn) {
                if (typeof fn === "function") {
                    events.replace(/[^\s]+/g, function(name, pos) {
                        callbacks[name] = callbacks[name] || [];
                        if (callbacks[name].indexOf(fn) === -1) {
                            callbacks[name].push(fn);
                            fn.typed = pos > 0;
                        }
                    });
                }
                return el;
            };

            el.off = function(events, fn) {
                if (events == "*") {
                    callbacks = {};
                } else if (fn) {
                    var arr = callbacks[events];
                    for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
                        if (cb === fn) {
                            arr.splice(i, 1);
                        }
                    }
                } else {
                    events.replace(/[^\s]+/g, function(name) {
                        callbacks[name] = [];
                    });
                }
                return el;
            };

            // only single event supported
            el.one = function(name, fn) {
                if (fn) {
                    fn.one = true;
                }
                return el.on(name, fn);
            };

            el.trigger = function(name) {
                var args = slice.call(arguments, 1),
                    fns = callbacks[name] || [];
                for (var i = 0, fn; (fn = fns[i]); ++i) {
                    if (!fn.busy) {
                        fn.busy = true;
                        try {
                            fn.apply(el, fn.typed ? [name].concat(args) : args);
                            if (fn.one) {
                                fns.splice(i, 1);
                                i--;
                            }
                        } finally {
                            fn.busy = false;
                        }
                    }
                }
                return el;
            };
            return el;
        };

        // create scope as observable object
        self.$scope = self.observer({});

        self.$scope.$redraw = function(){
            self.$scope.trigger('redraw');
        };
        self.$scope.$save = function(name, value) {
            missing.storage.set(name, value, true);
            self.$scope[name] = value;
        };

        // set redraw listener
        self.$scope.on('redraw', function(){
            if (!digestCycle) {
                digestCycle = setTimeout(function() {
                    try {
                        _mBind(translations[self.$scope.language]);
                        _mClass();
                    } catch(ex){
                        throw ex;
                    } finally{
                        digestCycle = null;
                    }
                }, DIGEST_INTERVAL);
            }
        });
        self.$scope.on('reRoute', function(){
            self.controller().clear();
        });

        // start once function
        self.run = function(){
            self.$scope.$redraw();
        };

        // add it to the modules
        // thou in this case we work with single module
        // left for extension, cross module component access
        modules[name] = self;

        return self;
    }

    missing.module = function(name){
        return modules[name] || new Module(name);
    };
})(window);
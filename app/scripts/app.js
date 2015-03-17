/**
 * Created by Miro on 17.11.2014.
 */
(function(missing){
    'use strict';

    var app = missing.module('HandBattle');

    // initialize basic values and listeners
    app.$scope.language = missing.storage.set("language", "en", false);
    app.$scope.game = missing.storage.set("game", "default", false);
    app.$scope.mode = missing.storage.set("mode", "human", false);
    app.$scope.listenTo('language', app.$scope.$redraw);
    // loading indicator
    app.$scope.listenTo('loaded', app.$scope.$redraw);

    // init controllers
    MainCtrl.init();
    GameCtrl.init();

    // run first draw
    app.run();
}(window.missing));
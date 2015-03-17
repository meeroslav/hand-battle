/**
 * Created by Miro on 20.11.2014.
 */
var HelpCtrl = missing.module('HandBattle').controller('HelpCtrl', ['$scope', 'Translations', 'GameConfig', function($scope, Translations, GameConfig){
    'use strict';

    var self = this;

    self.init = function() {
        $scope.trigger('reRoute');
        missing.injectTemplate("content", "help_template");

        for (var game in GameConfig.games) {
            missing.injectTemplate("help-games", "<h3 m-bind='Translation.{{name}}'></h3>", {"name": game}, true);

            GameConfig.games[game].options.forEach(function(gesture){
                missing.injectTemplate("help-games", "help_gesture_template", {"name": gesture}, true);
                GameConfig.games[game].superiority[gesture].forEach(function(inferiorGesture){
                    missing.injectTemplate("help-games", "<span><i class='icon-{{name}}'></i></span>", {"name": inferiorGesture}, true);
                })
            });
        }

        $scope.$redraw();
    };
}]);
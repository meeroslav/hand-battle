/**
 * Created by Miro on 18.11.2014.
 */
var MainCtrl = missing.module('HandBattle').controller('MainCtrl', ['$scope', 'GameConfig', 'Translations', function($scope, GameConfig, Translations){
    'use strict';

    var self = this;

    self.init = function() {
        // render languages option
        GameConfig.languages.forEach(function(lang){
            missing.injectTemplate("languages", "language_template", {"longName": Translations[lang].long, "name": lang}, true);
        });

        GameConfig.modes.forEach(function(mode){
            missing.injectTemplate("modes", "mode_template", {"name": mode}, true);
        });

        for (var game in GameConfig.games) {
            missing.injectTemplate("games", "game_template", {"name": game}, true);
        }

        // switch on visibility
        $scope.loaded = true;

        $scope.menuVisible = false;
        $scope.settingsVisible = false;

        $scope.listenTo('menuVisible', $scope.$redraw);
        $scope.listenTo('settingsVisible', $scope.$redraw);
        $scope.listenTo('game', $scope.$redraw);
        $scope.listenTo('mode', $scope.$redraw);

        $scope.$redraw();
    };

    self.switchLanguage = function(value) {
        $scope.$save("language", value);
    };
    self.switchGame = function(value) {
        $scope.$save("game", value);
        $scope.trigger('game.restart');
    };
    self.switchMode = function(value) {
        $scope.$save("mode", value);
        $scope.trigger('game.restart');
    };
    self.toggleMenu = function(){
        $scope.menuVisible = !$scope.menuVisible;
    };
    self.toggleSettings = function(value){
        $scope.settingsVisible = typeof value === "undefined" ?
            !$scope.settingsVisible :
            value;
    };
}]);
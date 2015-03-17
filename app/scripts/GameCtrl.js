/**
 * Created by Miro on 20.11.2014.
 */
var GameCtrl = missing.module('HandBattle').controller('GameCtrl', ['$scope', 'GameConfig', 'GameModel', function($scope, GameConfig, GameModel){
    'use strict';

    var self = this,
        game,
        timeout,
        HUMAN_MODE = "human",
        RESULT_VISIBLE_DURATION = 2000;

    self.$destroy = function(skipEventUnsign){
        if (game) {
            game.stop();
            game.player1.unlistenTo('score');
            game.player2.unlistenTo('score');
            game.player1.unlistenTo('gesture');
            game.player2.unlistenTo('gesture');
            game = null;
        }
        $scope.unlistenTo('started');
        $scope.unlistenTo('resulted');
        $scope.unlistenTo('showGo');

        if (!skipEventUnsign) {
            $scope.off('game.restart', restartGame);
        }
    };

    self.init = function(skipEventSign) {
        if (!skipEventSign) {
            $scope.trigger('reRoute');
        }
        $scope.started = false;
        $scope.resulted = false;
        $scope.result = 0;
        $scope.showGo = false;
        missing.injectTemplate("content", "main_template");

        game = new GameModel();
        setGameListeners();
        if ($scope.mode === HUMAN_MODE) {
            renderGame();
        }

        // set global listeners
        if (!skipEventSign) {
            $scope.on('game.restart', restartGame)
        };

        $scope.$redraw();
    };

    function setGameListeners(){
        // link scope to game
        $scope.player1 = game.player1;
        $scope.player2 = game.player2;
        $scope.listenTo('started', $scope.$redraw);
        $scope.listenTo('resulted', $scope.$redraw);
        $scope.listenTo('showGo', $scope.$redraw);
        // add listeners
        game.player1.listenTo('score', $scope.$redraw);
        game.player2.listenTo('score', $scope.$redraw);
        game.player1.listenTo('gesture', function(property, _old, _new){
            if ($scope.mode !== HUMAN_MODE) {
                missing.injectTemplate("computer-left", "static_gesture_template", {gesture: _new});
            }
            $scope.$redraw();
        });
        game.player2.listenTo('gesture', function(property, _old, _new){
            missing.injectTemplate("computer-right", "static_gesture_template", {gesture: _new});
            $scope.$redraw();
        });
    }

    function renderGame(){
        GameConfig.games[$scope.game].options.forEach(function(gesture, index, list){
            missing.injectTemplate("gestures", "gesture_template", {
                name: gesture,
                player: 'player1',
                index: index,
                count: list.length
            }, true);
        });
    }

    function restartGame(){
        self.$destroy(true);
        self.init(true);
    }

    self.selectGesture = function(gesture, index) {
        var elem, rotation;
        if ($scope.resulted) {
            self.toggleGame();
        }
        rotation = GameConfig.games[$scope.game].options.length - parseInt(index);
        game.player1.gesture = gesture;
        elem = document.getElementById("gestures");
        missing.removeClass(elem).addClass(elem, 'rotate-' + rotation + '-' + GameConfig.games[$scope.game].options.length);
    };

    self.toggleGame = function(start){
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
            $scope.resulted = false;
            $scope.result = 0;
        }
        if (typeof start !== 'undefined') {
            $scope.started = start;
        }

        $scope.showGo = game.toggleGame($scope.started);
    };

    self.stop = function(){
        game.stop();
        $scope.started = false;
        $scope.resulted = false;
        $scope.result = 0;
        $scope.showGo = false;
    };

    self.go = function(){
        self.toggleGame();

        $scope.result = game.validateGame();
        missing.injectTemplate("notification", "<span m-bind='Translation.result.{{res}}'></span>", {res: $scope.result});
        missing.injectTemplate("result", "<i class='icon-result{{res}}'></i>", {res: $scope.result});
        $scope.resulted = true;

        timeout = setTimeout(function(){
            timeout = null;
            $scope.resulted = false;
            $scope.result = 0;
            self.toggleGame();
        }, RESULT_VISIBLE_DURATION);
    };
}]);
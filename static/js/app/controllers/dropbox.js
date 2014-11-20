var app = angular.module('app');


app.controller('dropboxCtrl', function ($scope, dbService, $manager, $location, sieService, $log, $user, $util) {
    $log.info("init dropboxCtrl");
    $scope.load = function () {
        $log.info("login");
        $manager.login().then(function () {
            $location.path('/desktop/overview');
        });
    }

});


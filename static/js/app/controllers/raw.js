var app = angular.module('app');



app.controller('rawCtrl', function ($scope, $manager, $log, $user, dbService) {
    $log.info("init rawCtrl");
    
    $scope.load = function () {
        $scope.all = $user.poster;
        var i = 0;
    };
       
});


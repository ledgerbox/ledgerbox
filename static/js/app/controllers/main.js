var app = angular.module('app');



app.controller('mainCtrl', function ($scope, $http, $location, $manager, $util, $log, $timeout) {
    $log.debug("init mainCtrl")

    
    $scope.show = {};
    $scope.sie = {}

    $scope.cleanError = function () {
        $scope.errors = 0;
    }

    $scope.logout = function () {
        $manager.logout();
    }

    $scope.removeFile = function(index){
        $scope.p.file.splice(index, 1);
    }

    $scope.addValue = function (val) { 
        $scope.value = val;
    }  ;

    $scope.mobile = function () {
        $scope.show.switch = "on";
        $timeout( function(){
            $location.path('/mobile');
        }, 400);
    }
    
    $scope.errors = $util.errors;
    $scope.checkbox = true;

});


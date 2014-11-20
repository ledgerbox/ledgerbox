var app = angular.module('app');

app.controller('bookCtrl', function ($scope, $manager, $log, $util, $user) {
    $log.info("init book");

    $scope.showFilter = true;
    $scope.showAdvFilter = true; 
    $scope.konton =  $user.getKonton() ;
    $scope.date = {};
    $scope.balances = [];
    $scope.balances.push({});
    $scope.balances.push({});
    $scope.balances.push({});
    $scope.balances.push({});
    $scope.edit = true;
    $scope.done = false;


    $scope.label = function (nr, name) {
        return nr + " (" + name + ")";
    }

    $scope.save = function () {
        var book = $manager.createNewBook($util.dateToSie(new XDate($scope.date.startDate)), $util.dateToSie(new XDate($scope.date.endDate)), $scope.balances);
        $scope.edit = false;
        $scope.done = true;
    }

});


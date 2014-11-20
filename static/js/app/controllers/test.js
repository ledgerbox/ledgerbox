var app = angular.module('app');

app.controller('testCtrl', function ($scope, dbService, $log, $util, $user) {
    $log.info("init test");


    $scope.init = function(){
        $scope.test = [];
        $scope.test.push({name : "1", result : $scope.test1()});
        $scope.test.push({name : "1", result : $scope.test2()});
        $scope.test.push({name : "1", result : $scope.test3()});
    }


    $scope.test1 = function () {
        $.get("/js/test/sie/prova.js", function(data){
            var file = $util.sieToString($util.str2ab(data))
            var json = parserService.sieToJson(file);
            var vers = _.where(json.poster, { etikett: 'ver'});
            var table = $result.calculate(new Date("2010-01-01"), new Date("2010-12-31"),
                vers);
            var i = _.findWhere(table, {kontonr: 3010})
            equal(i.belopp, 6398286, '');
            var i = _.findWhere(table, {kontonr: 3021})
            equal(i.belopp, 1824736, '');
            i = _.findWhere(table, {nr: 10})
            equal(i.belopp, 6899206, '');
            i = _.findWhere(table, {nr: 11})
            equal(i.belopp, 85, '');
            i = _.findWhere(table, {nr: 48})
            equal(i.belopp, -2092545, '');
            i = _.findWhere(table, {nr: 49})
            equal(i.belopp, 1309723 , '');

            start();
        })

        return true;
    }

    $scope.test2 = function () {
        dbService.deleteAll();
        return true;
    }

    $scope.test3 = function () {

    }
});


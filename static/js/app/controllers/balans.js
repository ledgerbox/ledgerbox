var app = angular.module('app');



app.controller('balansCtrl', function ($scope, $http, $location, $manager, $util, $user, $log) {
    $log.info("init balans");
    
    $scope.newDate = function () {
        $scope.result = $scope.balansRapport($scope.search.startDate, $scope.search.endDate);
    }

    //coded in a tent in Tasmania
    $scope.balansRapport = function(start, end) {
        var all = [];
        var result = {};
        result.till = [];
        result.cost = [];
        var start = new Date(start);
        var end = new Date(end);

        _.each($user.getIB(), function(p){
            if (p.kontonr > 3000) {
                return;
            }
            var k = {"text": $user.getKontoNamn(p.konto), "konto": p.konto, "ing": Math.abs(p.saldo) , "period": 0};
            all.push(k);
        });

        _.each($user.getVer(), function (v) {
            var date = new XDate($util.sieToDate(v.verdatum));
            _.each(v.poster, function (p) {

                if (p.kontonr > 3000) {
                    return;
                }

                var k = _.findWhere(all, { konto: p.kontonr });
                if (!k) {
                    k = {"text": $user.getKontoNamn(p.kontonr), "konto": p.kontonr, "ing": 0, "period": 0};

                    all.push(k);
                }

                if (date < start) {
                    if (k) {
                        k.ing += Math.abs(p.belopp);
                    }
                    k.tot += Math.abs(p.belopp);
                }

                if (date > start && date < end) {
                    if (k) {
                        k.period += Math.abs(p.belopp);
                    }
                    k.tot += Math.abs(p.belopp);
                }
            });
        });

        result.tillInTot = 0;
        result.tillPeriodTot = 0;
        result.costInTot = 0;
        result.costPeriodTot = 0;

        _.each(all, function (a) {
            if (a.konto < 2000) {
                result.till.push(a);
                result.tillInTot += a.ing + a.ing ;
                result.tillPeriodTot += a.period;

            }else {
                result.cost.push(a);
                result.costInTot += a.ing + a.ing ;
                result.costPeriodTot += a.period;
            }
            a.saldo = $util.stringToNr(a.saldo);
        })
        return result;
    }
    
    $scope.search = {};
    var book = $user.getBook();
    $scope.search.startDate = $util.sieToDate(angular.copy(book.start));
    $scope.search.endDate = $util.sieToDate(angular.copy(book.slut));
    $scope.result = $scope.balansRapport($scope.search.startDate, $scope.search.endDate);
});


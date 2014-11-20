var app = angular.module('app');

app.controller('resultatCtrl', function ($scope, $log, $user, $util) {
    $log.info("init resultatCtrl");

    $scope.bas = [
     {typ : "sub", title : "Nettoomsättning", start : 3000, end : 3899 },
     {typ : "sub",title : "Övriga rörelseintäkter", start : 3900, end : 3999},
     {typ : "head",title : "Rörelsens intäkter", sum :  [{start : 3000, end : 3999}]},
     {typ : "sub",title : "Material och varor", start : 4000, end : 4960 },
     {typ : "head",title : "Bruttovinst", sum :  [{start : 3000, end : 3999}, {start : 4000, end : 4999}] },
     {typ : "sub",title : "Övriga externa kostnader", start : 5000, end : 6999 },
     {typ : "sub",title : "Personalkostnader", start : 7000, end : 7699 },
     {typ : "head",title : "Rörelsens kostnader", sum :  [{start : 5000, end : 7799}] },
     {typ : "head",title : "Rörelseresultat före avskrivningar", sum :  [{start : 3000, end : 3999}, {start : 4000, end : 7799}] },
     {typ : "sub",title : "Avskrivningar", start : 7820, end : 7899 },
     {typ : "head",title : "Rörelseresultat efter avskrivningar", sum :  [{start : 3000, end : 3999}, {start : 4000, end : 7899}] },
     {typ : "sub",title : "Finansiella intäkter och kostnader", start : 8300, end : 8499 },
     {typ : "head",title : "Resultat efter finansiella poster",  sum :  [{start : 3000, end : 3999}, {start : 4000, end : 8499}]},
     {typ : "sub",title : "Bokslutsdispositioner", start : 8800, end : 8850 },
     {typ : "head",title : "Resultat efter bokslutsdispositioner", sum :  [{start : 3000, end : 3999}, {start : 4000, end : 8850}]},
     {typ : "sub",title : "Skatt", start : 8910, end : 8910 },
     {typ : "head",title : "Årets resultat", sum :  [{start : 3000, end : 3999}, {start : 4000, end : 8899}]}];

    
    $scope.newDate = function () {
        $scope.result = $scope.resultatrapport($scope.search.startDate, $scope.search.endDate);
    }
    
    function calculate(start, end){
        var all = [];
        start = new XDate(start);
        end = new XDate(end);

        _.each($user.getVer(), function (v) {
            var date = new Date($util.sieToDate(v.verdatum));
            if (date >= start && date <= end) {
                _.each(v.poster, function (p) {
                    var k = _.findWhere(all, { kontonr: p.kontonr })
                    if (k) {
                        k.belopp += p.belopp;
                    } else {
                        all.push({"text": $user.getKontoNamn(p.kontonr), kontonr: p.kontonr, "belopp": p.belopp  });
                    }
                })
            }
        });
        return all;
    }


    $scope.resultatrapport = function result(start, end) {
        $scope.all = calculate(start, end);
        _.each($scope.bas, function(b){
            b.belopp= 0;
            b.konton = [];
            _.each($scope.all, function(a){
                if(b.typ == "sub" && b.start < a.kontonr && a.kontonr < b.end ){
                    b.konton.push(a);
                    b.belopp += a.belopp;
                }

                if(b.typ == "head" && b.sum[0].start < a.kontonr && a.kontonr < b.sum[0].end ){

                    b.belopp += a.belopp;
                }
                if (b.typ == "head" && b.sum.length == 2 && b.sum[1].start < a.kontonr && a.kontonr < b.sum[1].end ){

                    b.belopp += a.belopp;
                }
            })
        })
        return result;
    }
    
    $scope.search = {};
    var book = $user.getBook();
    $scope.search.startDate = $util.sieToDate(angular.copy(book.start));
    $scope.search.endDate = $util.sieToDate(angular.copy(book.slut));
    $scope.resultatrapport($scope.search.startDate, $scope.search.endDate);


});

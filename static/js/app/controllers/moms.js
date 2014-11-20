var app = angular.module('app');
 


app.controller('momsCtrl', function ($scope, $manager, $log, $user, $http, $location, $util) {
    $log.info("init momsCtrl");

    $scope.momsperiod = $user.getInfo().momsperiod;
});

app.service('$moms', function () {

    var momsTable = [
        {"typ" : "a", "nr" : 5, "text" : "Momspliktig försäljning som inte ingår i ruta 06, 07 eller 08"},
        {"typ" : "a", "nr" : 6, "text" : "Momspliktiga uttag"},
        {"typ" : "a", "nr" : 7, "text" : "Beskattningsunderlag vid vinstmarginalbeskattning"},
        {"typ" : "a", "nr" : 8, "text" : "Hyresinkomster vid frivillig skattskyldighet"},


        {"typ" : "b", "nr" : 10, "text" : "Utgående moms 25%", start : 2611, end : 2611},
        {"typ" : "b", "nr" : 11, "text" : "Utgående moms 12%", start : 2621, end : 2611 },
        {"typ" : "b", "nr" : 12, "text" : "Utgående moms 6%", start : 2631, end : 2611},

        {"typ" : "c", "nr" : 20, "text" : "Inköp av varor från ett annat EU-land"},
        {"typ" : "c", "nr" : 21, "text" : "Inköp av tjänster från ett annat EU-land enligt huvudregel"},
        {"typ" : "c", "nr" : 22, "text" : "Inköp av tjänster från ett land utanför EU"},
        {"typ" : "c", "nr" : 23, "text" : "Inköp av varor i Sverige "},
        {"typ" : "c", "nr" : 24, "text" : "Övriga inköp av tjänster "},

        {"typ" : "d", "nr" : 30, "text" : "Utgående moms 25%"},
        {"typ" : "d", "nr" : 31, "text" : "Utgående moms 12%"},
        {"typ" : "d", "nr" : 32, "text" : "Utgående moms 6%"},

        {"typ" : "e", "nr" : 35, "text" : "Försäljning av varor till ett annat EU-land"},
        {"typ" : "e", "nr" : 36, "text" : "Försäljning av varor utanför EU"},
        {"typ" : "e", "nr" : 37, "text" : "Mellanmans inköp av varor vid trepartshande"},
        {"typ" : "e", "nr" : 38, "text" : "Mellanmans försäljning av varor vid trepartshande"},
        {"typ" : "e", "nr" : 39, "text" : "Försäljning av tjänster till näringsidkare i annat EU- land enligt huvudregeln"},
        {"typ" : "e", "nr" : 40, "text" : "Övrig försäljning av tjänster omsatta utanför Sverige"},
        {"typ" : "e", "nr" : 41, "text" : "Försäljning när köparen är skattskyldig i Sverige"},
        {"typ" : "e", "nr" : 42, "text" : "Övrig försäljning m.m"},

        {"typ" : "f", "nr" : 48, "text" : "Ingående moms att dra av", start : 2641, end :2641},

        {"typ" : "g", "nr" : 49, "text" : "Moms att betala eller få tillbaka"}
    ];


    this.calculate = function (start, end, vers) {
        var table = angular.copy(momsTable);
        var all = [];
        _.each(vers, function(v){
            if(start <= new Date($util.sieToDate(v.verdatum)) && new Date($util.sieToDate(v.verdatum) <= end )) {

                 $scope.all.push(v);
            }
        });
        return table;
    }

    this.show = function(){
        this.calculate(new Date(m.start), new Date(m.end), $user.getVer());
        $('#myModal').modal('show');
    }


});

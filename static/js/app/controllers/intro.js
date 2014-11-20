var app = angular.module('app');

app.controller('introCtrl', function ($scope, $location, $log, $user, $manager, dbService, $util, $http) {
    $log.info("init, introCtrl");
    $scope.show = {};
    $scope.show.create = false;

    $scope.create = function () {

    }

    $scope.login = function () {
        if(dbService.isAuth()) {
            $location.path('/main');
        } else {
            dbService.remoteAuth();
        }
    }

    $scope.demo = function () {
        $user.mockDB();
        $user.createUser();
      /*  $http.get("/js/test/sie/test2.js").success( function(data){
            _.each(eval(data),function(p){
                $user.addVer(p);
            })
            $user.addInvoice({ "num": null, "date": "2014-11-01", "maturity": "2014-12-01", "ref": "David Larsson", "penaltyInterest": "", "customer": { "name": "Matbutiken", "address": "Nyvägen 2", "street": "4732", "city": "Göteborg" }, "lines": [ { "text": "Dator", "qty": "1", "unitPrice": "200", "VATRate": 0.25, "priceExclTax": 200, "VAT": 50 } ], "VATGroups": [ { "VATRate": 0.25, "priceExclTax": 200, "VAT": 50, "rounding": 0, "total": 250 } ], "totalExlTax": 200, "totalVAT": 50, "totalIncTax": 250, "toBePaid": 250, "book": 422, "etikett": "invoice" });
            $location.path('/main');
        })
        */
         $http.get("/js/test/sie/prova.js", {responseType: "arraybuffer"}).success( function(data){
            $manager.uploadSie(data);

            $location.path('/main');
        })

    }

});


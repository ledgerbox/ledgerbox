var app = angular.module('app');


app.controller('overviewCtrl', function ($scope, $filter, $http, $user, $util, $location, $manager, $log, sharedObject) {
    $log.info("init overviewCtrl");
    $(".navbar-nav li a").click(function (event) {
        // check if window is small enough so dropdown is created
        var toggle = $(".navbar-toggle").is(":visible");
        if (toggle) {
            $(".navbar-collapse").collapse('hide');
        }
    });

    $scope.init = function() {
        $scope.konton = $user.getKonton();
        $scope.series = $user.getInfo().series;
        $scope.uploadme = {};

        if(!$util.started){
            $util.started = true;
            $user.getDBmail().then(function(dbMail) {
                $scope.dbMail = dbMail;
                $http.get("/api/haveuser?email=" +dbMail).then(function(){
                    //hide
                }, function(){
                    $('#myModal').modal('show');
                })
            });

        }

        if($util.isOldBrowser()){
            $util.error("", "Du verkar använda en äldre web läsare ledgerbox fungerar bäst med Chrome eller Firefox.");
        }

    }

    $scope.create = function(){
        $http.get("/api/create?name=" +$scope.name +"&company=" +$scope.company  +"&dbMail=" +$scope.dbMail +"&email=" +$scope.email +"&tel=" +$scope.tele)
        $('#myModal').modal('hide');

    }



    $scope.label = function (nr, name) {
        return nr + " (" + name + ")";
    }
    
    $scope.show = function(v){
        sharedObject.setv(v.id, v);
        $location.path("/desktop/bookkeeping/show/"+v.id);
    }
    
    $scope.revert = function(v){
        sharedObject.setv(v.id, v);
        $location.path("/desktop/bookkeeping/revert/"+v.id);
    }
    
    $scope.search = function (v) {
        var vDate = new Date($filter('siedate')(v.ver.verdatum));
        var search = $scope.g.search;
        
        if(search.freeText) {
            if(JSON.stringify(v.ver).toLowerCase().indexOf($scope.g.search.freeText.trim().toLowerCase()) < 0) {
                return false;
            }
        }
        
        if (search.konto) {
            var w = _.where(v.ver.poster, { kontonr: search.konto.kontonr });
            if (!w.length) {
                return false;
            }
        }
        if (search.startDate) {
            if (new XDate(search.startDate) > vDate) {
                return false;
            }
        }
        if (search.endDate) {
            if (new XDate(search.endDate) < vDate) {
                return false;
            }
        }

        if (search.serie) {
            if (!(search.serie.namn == v.ver.serie)) {
                return false;
            }
        }
        
        return true;
    }
    
    $scope.verfikationer = [];
    _.each($user.getVer(), function(v) {
        var extra = {};
        extra.date = new Date($filter('siedate')(v.verdatum)).getTime();
        extra.dateString = $util.sieToDate(v.verdatum);
        extra.vernr = parseInt(v.vernr);
        extra.text = $util.getVerNameText(v.vertext);
        extra.files = $util.getVerNameFiles(v.vertext);
        extra.sum = $util.sumBelopp(v);
        extra.sumFixed = $util.toFixed(extra.sum);
        extra.ver = v;
        $scope.verfikationer.push(extra);
    });



});


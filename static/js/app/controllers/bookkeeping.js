var app = angular.module('app');



app.controller('bookkeepingCtrl', function ($scope, $http, $location, $manager, $util, $user, $log, $routeSegment, sharedObject) {
    $log.info("init bookkeepingCtrl");

    $scope.mode = {};
    $scope.konton = $user.getKonton();
    $scope.hideSerie = $user.getInfo().hideSerie;
    $scope.series = $user.getInfo().series;



    $scope.load = function(){
        $scope.clear();
        $scope.mode.param = $routeSegment.$routeParams.mode;
        var id = $routeSegment.$routeParams.id;

        if ($scope.mode.param == "show") {
            $scope.mode.view = true;
            $scope.verification = $user.getPost(id);
            _.each($scope.verification.poster, function (p) {
                if(!_.findWhere($scope.konton,{kontonr : p.kontonr})){
                    $scope.konton.push({kontonr : p.kontonr, kontonamn : "Okänd"});
                }
                if (p.belopp > 0) {
                    p.debit = p.belopp;
                } else {
                    p.credit = -p.belopp;
                }
            })
        } else if ($scope.mode.param == "revert") {
            $scope.mode.view = false;
            $scope.verification = angular.copy($user.getPost(id));
            $scope.verification.vertext = "Ny post till ver : " + $scope.verification.vernr;
            $scope.verification.verdatum = $util.sieToDate($scope.verification.verdatum);
            _.each($scope.verification.poster, function (p) {
                if(!_.findWhere($scope.konton,{kontonr : p.kontonr})){
                    $scope.konton.push({kontonr : p.kontonr, kontonamn : "Okänd"});
                }
                if (p.belopp > 0) {
                    p.credit = p.belopp;
                } else {
                    p.debit = -p.belopp;
                }
            })
        }


        $scope.$watch('verification', function () {
            $scope.sumDebit  = 0;
            $scope.sumCredit = 0;
            $scope.form.isValid = true;
            var count = 0;

            _.each($scope.verification.poster, function (a) {

                if (!$scope.verification.serie) {
                    $scope.form.isValid = false;
                }
                if (!$scope.verification.verdatum) {
                    $scope.form.isValid = false;
                }
                if (!$scope.verification.vertext) {
                    $scope.form.isValid = false;
                }

                if (a.kontonr) {
                    count++;
                    a.sum = $user.getSumKonton(a.kontonr);
                }

                if (a.debit) {
                    a.sum += parseFloat(a.debit);
                }else if (a.credit) {
                    a.sum += parseFloat(-a.credit);
                }

                if (a.debit) {
                    $scope.sumDebit += parseFloat(a.debit) ;
                }
                if (a.credit) {
                    $scope.sumCredit += parseFloat(a.credit) ;
                }

                if (a.debit || a.credit) {
                    $scope.diff = ($scope.sumDebit - $scope.sumCredit)
                }
                if (a.debit && a.credit) {
                    a.error = true;
                } else {
                    a.error = false;
                }

            });

            if ($scope.verification.poster.length - count < 2) {
                $scope.verification.poster.push({ 'text': '' });
            }

        }, true);
    }
    $scope.label = function (nr, name) {
        return nr + " (" + name + ")";
    }


    $scope.clear = function () {
        $scope.verification = {};
        $scope.verification.poster = [];
        $scope.verification.poster.push({ 'text': '' });
        $scope.verification.poster.push({ 'text': '' });
        $scope.verification.poster.push({ 'text': '' });
        $scope.verification.poster.push({ 'text': '' });
        $scope.files = [];
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if (month < 10) month = "0" + month;
        if (day < 10) day = "0" + day;
        var today = year + "-" + month + "-" + day;
        $scope.verification.verdatum = today;

    }
     

    $scope.remove = function (array, index) {
        array.splice(index, 1);
    }

    $scope.validate = function () {
        if($scope.diff != 0){
            $util.info("", "Differensen mellan debet och kredit måste vara noll");
            return false;
        }

        return true;
    }

    $scope.save = function () {
        if(!$scope.validate()){
            return;
        }

        var ver = {}; 
        if($scope.verification.serie){
            ver.serie = $scope.verification.serie.namn;
        }
        ver.verdatum = $util.dateToSie(new XDate($scope.verification.verdatum));
        ver.vernr = $user.getNextNr(ver.serie);
        ver.vertext = $scope.verification.vertext +$util.getArryToPipe($scope.files);
        ver.poster = [];
        _.each($scope.verification.poster, function (a) {
            if (a.kontonr && (a.debit || a.credit)) {
                var p = {};
                if(a.debit){
                    p.belopp = parseFloat(a.debit);
                } else {
                    p.belopp = -parseFloat(a.credit);
                }
                p.etikett = "trans";	
                p.kontonr = a.kontonr;
                if (a.debit || a.credit) {
                    ver.poster.push(p);
                }
            }
        });
        $user.addVer(ver);
        $util.info("Verifikation " +$util.getVerNameText(ver.vertext) +" är skapad" );
        $scope.clear();

    }

    $scope.addFile = function(){
        options = {
            success: function(files) {
                var fs = _.pluck(files, "link");
                $scope.$apply(function(){
                    $scope.files = fs;
                });
            },
            cancel: function() {
            },
            linkType: "preview", // or "direct"
            multiselect: true  // or true
        };
        Dropbox.choose(options );
    }
    
    
    $scope.load();

});


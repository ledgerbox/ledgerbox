﻿var app = angular.module('app');
app.controller('settingCtrl', function ($scope, $http, $location, $util, $user, dbService) {
   
   $scope.show = {};
   $scope.show.info = true;
   $scope.show.addSerie = false;
   $scope.show.konto = false;
   $scope.common = {};
   $scope.info = $user.getInfo();
   $scope.logo = $user.getLogo();
   $scope.konton = _.where($user.poster, { etikett: 'konto' });
   $scope.series = $scope.info.series;
   $scope.moms = $user.getInfo().moms;


    $scope.deleteKonto = function ( idx ) {
        var konto = $scope.konton[idx];
        $user.deletePost(konto);
        $scope.konton.splice(idx, 1);
    };

    $scope.deleteSerie = function ( idx ) {
        $scope.info.series.splice(idx, 1);
        $user.update($user.getInfo());
    };

    $scope.addSerie = function(){
        if($scope.serieName && $scope.serieInfo){
            var s = {namn: $scope.serieName, info : $scope.serieInfo};
            $scope.info.series.push(s);
            $scope.show.addSerie = false;
        }
    }

    $scope.addKonto = function() {
        if($scope.kontonamn && $scope.kontonr){
            var s = {kontonamn: $scope.kontonamn, kontonr : $scope.kontonr,  etikett : "konto"};
            $user.addKonto(s);
            $scope.konton = _.where($user.poster, { etikett: 'konto' });
            $scope.show.addKonto = false;
        }
    }

   $scope.save = function () {
       $user.update($scope.info)
       $user.update($scope.logo);
       _.each($scope.konton, function (a) {
           $user.update(a)
       });

   }

    $scope.changeMoms  = function () {
        $user.update($user.getInfo());
    }


});


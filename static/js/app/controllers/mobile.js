var app = angular.module('app');

app.controller('mobileCtrl', function ($scope, $location, $log, $mobile, $timeout, $util) {
    $log.info("init, mobileCtrl");

    $scope.paginator = false;

    $scope.desktop = function () {
        $scope.show.switch = "";
        $timeout( function(){
            $location.path('/desktop/overview');
        }, 400);
    }

    $scope.addFile = function(){
        options = {
            success: function(files) {
                var fs = _.pluck(files, "link");
                $scope.$apply(function(){
                    $scope.p.files = fs;
                });
            },
             cancel: function() {
            },
              linkType: "preview", // or "direct"
              multiselect: true  // or true
        };
        Dropbox.choose(options );
    }

    $scope.clearIn = function () {
        $scope.p = $mobile.getNewPayment();
    }

    $scope.undoClick = function () { 
        $mobile.undo();
        $scope.undo = false;
        $scope.setView("oversikt");
    }



    $scope.menuClick = function (r) {
        $scope.show.menu = false;
        $scope.paginator = false;
        $scope.setView(r.href);

    }

    $scope.inbetClear = function () {
        var ver = $mobile.sell($scope.p);
        $user.addVer(ver);
    }

    $scope.repAvdrag = function () {
        $mobile.repAvdrag($scope.p);
    }

    $scope.save = function () {
        if ($scope.page == "inbet") {
            var ver = $mobile.inbet($scope.p);
            $scope.setView("oversikt");
        } else if ($scope.page == "utbet") {
            var ver = $mobile.utbet($scope.p);
            $scope.setView("oversikt");
        } else if ($scope.page == "overforing") {
            var ver = $mobile.overforing($scope.p);
            $scope.setView("oversikt");
        }
        $scope.undo = true;
    }
 
     
    $scope.setView = function (page) {
        $scope.page = page;
        if (page == "hem") {
            $scope.title = "Hem"; 
        } else if (page == "inbet") {
            $scope.title = "Ny inbetalning";
            $scope.p = $mobile.getNewPayment();
        } else if (page == "utbet") {
            $scope.title = "Ny utbetalning";
            $scope.p = $mobile.getNewPayment();
        } else if (page == "overforing") {
            $scope.title = "Överföring";
            $scope.p = $mobile.getNewPayment();
        } else if (page == "oversikt") {
            $scope.title = "Översikt";
            $scope.verfikationer  = $mobile.oversikt();
        } else if (page == "avslut") {
            $scope.title = "Avsluta";
        }

        $scope.show.path = '/html/mpage/' +page  + '.html';
    }
    
    $log.info("load");
    $scope.undo = false;
    $scope.utkassakonton = $mobile.kassakonton;

    $scope.inkassakonton = $scope.utkassakonton.slice(1, $scope.utkassakonton.length);

    $scope.invoices = [];
    $scope.moms = [{'typ' : 25 } ]
    $scope.show.menu = true;
    $scope.setView('hem');

    $scope.rows = [{ "icon": "fa fa-home ", "text": "Hem", "href": "hem" },
                   { "icon": "fa fa-sign-in ", "text": "Inbetalning", "href": "inbet" },
                   { "icon": "fa fa-sign-out", "text": "Utbetalning", "href" : "utbet" },
                   { "icon": "fa fa-exchange", "text": "Överföring", "href": "overforing" },
                   { "icon": "fa fa-eye ", "text": "Översikt", "href": "oversikt" },
                   { "icon": "fa fa-calendar", "text": "Avsluta år", "href": "avslut" }
    ];


    $scope.intyp = $mobile.intyp;

    $scope.uttyp = $mobile.uttyp;
 

});


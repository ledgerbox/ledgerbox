var app = angular.module('app');



app.controller('sieCtrl', function ($scope, $manager, $log, $http, $location, $util, $user) {
    $log.info("init sieCtrl");

    $scope.done = function (res) {
       $manager.uploadSie(res);
       $scope.getBooks();
    }

    $scope.getBooks = function () {
        $scope.rows = [];
        var books = $user.getBooks();
        var aktiv = $user.getInfo().aktiv;
        _.each(books, function (b) {
            var row = {};
            row.start = $util.sieToDate(b.start);
            row.slut = $util.sieToDate(b.slut);
            row.ver = $user.getVerByBook(b).length;
            row.show = true;
            row.bookId = b.id;
            if (aktiv == b.id) {
                row.aktiv = true;
            }
            $scope.rows.push(row);
        });
    }

    $scope.active = function (b) {
        $user.activeBook(b.book);
        $scope.getBooks();
    }


    $scope.viewSIE = function (b) {
        $scope.sieText = $manager.getSieFile(b.book);
        $('#sieModal').modal();
    }

    $scope.remove = function (b) {
        if($user.getBooks().length == 1) {
            alert("Du måste minsta ha ett räkenskapsår");
            return;
        }
        if(b.bookId == $user.getInfo().aktiv){
            alert("Du kan inte ta bort ett aktivt räkenskapsår")
            return;
        }
        $user.removeBook(b.bookId);
        b.show = false;
    }

    $scope.downloadSIE = function (b) {
        $util.downloadSIE(b);
    }
    
    $scope.getBooks();
});


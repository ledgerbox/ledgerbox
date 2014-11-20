var app = angular.module('app');



app.service('$manager', function ($http, $util, $q, $timeout,  $user, $log, $location, parserService, dbService) {
    var self = this;

    this.login = function () {
        return $user.login() 
    }

    this.logout = function () {
        $user.logout();
        $location.path('/intro')
        //location.reload();
    }

    this.isAuth = function () {
        return $user.login();
    }

    this.getSieFile = function (book) {
        var list = $user.getHeader(book)
        list = list.concat($user.getKonton());
        list = list.concat($user.getVerByBook(book));

        return parserService.jsonToSie(list);
    }

    this.uploadSie = function (res) {
        var file = $util.sieToString(res)
        var json = parserService.sieToJson(file);
    
        var rar = _.findWhere(json.poster, { etikett: 'rar' });
        var balanser = _.where(json.poster, { etikett: 'ib' });

        var ver = _.where(json.poster, { etikett: 'ver' });
        var info = $user.getInfo();
        $util.addSeries(ver, info);
        $user.update(info);
  
        var book = $user.createBook(rar.start, rar.slut, balanser, ver);
 
    }
 
     


    this.createNewBook = function (start, end, balances) { 
        var balanser = [];
        _.each(balances, function (b) {
            var post = {
                "etikett": "IB",
                "årsnr": 0,
                "kontonr": b.konto,
                "saldo": b.saldo 
            }; 
            balanser.push(post)
        }); 
        $user.createBook(start, end, balanser, []);

    }

    this.getBooks = function(){
        return $user.getBooks();
    };


});


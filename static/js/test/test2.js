var myApp = angular.module('app');


var injector = angular.injector(['ngMock', 'ng', 'app']);
var sieService
var dbService;
var $user;
var $mobile;
var $http;
var $manager;
var $util;
var $moms;
var bookkeeping;
var parserService;
var $result;

var init = {
    setup: function () {

        sieService = injector.get('sieService');
        $mobile = injector.get('$mobile');
        $util = injector.get('$util');
        $moms = injector.get('$moms');
        dbService = injector.get('dbService');
        $http = injector.get('$http');
        parserService = injector.get('parserService');
        $user = injector.get('$user');
 
    }
};

module('tests', init);

test("db test ", function () {

        $user.mockDB();
        $user.poster = $user.createUser();

        var konton = $user.getKonton()

        equal(konton.length, 407, '');
        var info = $user.getInfo()
        equal(info.aktiv, 0, '');
        var fname = _.findWhere($user.poster, { etikett: "fnamn" })
        fname.företagsnamn = "123";
        $user.update(fname);

        equal(fname.företagsnamn, "123", '');
        var vers = $user.getVer();
        equal(vers.length, 0, '');
        var book = $user.createBook("20140101", "20141201", []);
        equal($user.getBooks().length, 2, "")
        $user.activeBook(book);
        
        $user.removeBook(book);
        equal(_.where($user.poster, { etikett: "rar" }).length, 1, "")
        equal($user.getInfo().aktiv, _.findWhere($user.poster, { etikett: "rar" }).id, '');

        $http.get("/js/test/sie/MAMUT_SIE4_EXPORT.js").success( function(data){
            $manager.uploadSie($util.str2ab(data));
            equal($user.getInfo().aktiv, $user.getBooks()[1].id, '');
            equal($user.getVer().length, 168, '');
            equal($user.getInfo().series.length, 6, '');
            equal($user.getKonton().length, 407, '');
            $manager.getSieFile(2);
            dbService.deleteAll()
            start();
        })

    stop();
})
 
 


test("db test mobile ", function () {



    $user.login().then(function () {
        //clear user
        dbService.deleteAll();
        $user.poster = $user.createUser();

        var p = $mobile.getNewPayment();
        p.typ = _.findWhere($mobile.intyp, { kontotext : "Försäljning" });
        p.date = "2014-11-10";
        p.text = "test";
        p.konto = "1940";
        p.moms[0].belopp = 7;
        p.moms[0].moms = 3;
        p.moms[1].belopp = 0;
        p.moms[1].moms = 0;
        $mobile.inbet(p);
        equal($user.getVer().length, 1, '');
        equal($user.getVer()[0].vertext, "test", '');
        equal($user.getVer()[0].poster.length, 3, '');
        equal($user.getVer()[0].poster[0].belopp, -3, '');
        equal($user.getVer()[0].poster[0].kontonr, '2611', '');
        equal($user.getVer()[0].poster[1].belopp, -7, '');
        equal($user.getVer()[0].poster[1].kontonr, '3010', '');
        equal($user.getVer()[0].poster[2].belopp, 10, '');
        equal($user.getVer()[0].poster[2].kontonr, '1940', '');

        var p = $mobile.getNewPayment();
        p.typ = _.findWhere($mobile.intyp, { kontotext: "Övriga inkomster" })
 
        p.date = "2014-10-10";
        p.moms = 10;
        p.belopp = 100;
        p.konto = "1940";
        $mobile.inbet(p);
        equal($user.getVer().length, 2, 'Övriga inkomster');
        equal($user.getVer()[1].poster.length, 3, 'Övriga inkomster');
        equal($user.getVer()[1].poster[0].kontonr, '2611', 'Övriga inkomster');
        equal($user.getVer()[1].poster[0].belopp, 10, 'Övriga inkomster');
        equal($user.getVer()[1].poster[1].belopp, 100, 'Övriga inkomster');
        equal($user.getVer()[1].poster[1].kontonr, '3900', 'Övriga inkomster');
        equal($user.getVer()[1].poster[2].belopp, 110, 'Övriga inkomster');
        equal($user.getVer()[1].poster[2].kontonr, '1940', 'Övriga inkomster');
 
        var p = $mobile.getNewPayment();
        p.typ = _.findWhere($mobile.uttyp, { kontotext: "Varuinköp" })
         
        p.date = "2014-10-10";
        p.typ.moms = 10;
        p.typ.belopp = 100;
        p.konto = "1940";

        $mobile.utbet(p);
        equal($user.getVer().length, 3, 'Varuinköp');
        equal($user.getVer()[2].poster.length, 3, 'Varuinköp');
        equal($user.getVer()[2].poster[0].kontonr, '2641', 'Varuinköp');
        equal($user.getVer()[2].poster[0].belopp, 10, 'Varuinköp');

        equal($user.getVer()[2].poster[1].kontonr, '4000', 'Varuinköp');
        equal($user.getVer()[2].poster[1].belopp, 90, 'Varuinköp');

        equal($user.getVer()[2].poster[2].kontonr, '1940', 'Varuinköp');
        equal($user.getVer()[2].poster[2].belopp, -100, 'Varuinköp');

        var p = $mobile.getNewPayment();
        p.typ = _.findWhere($mobile.uttyp, { kontotext: "Förbrukningsinventarier" })

        p.typ.kontotext = 'normal';
        p.date = "2014-10-10";
        p.moms[0].belopp = 10;
        p.belopp = 100;
        $mobile.utbet(p);
        equal($user.getVer().length, 4, '');
        equal($user.getVer()[3].poster.length, 3, '');

        var p = $mobile.getNewPayment();
  
        p.date = "2014-10-10";
        p.text = "test";
        p.till = { 'konto': '1940' };
        p.fran = { 'konto': '1941' };
        p.belopp = 100;
        $mobile.overforing(p);
        equal($user.getVer().length, 5, '');
        equal($user.getVer()[4].poster[0].kontonr, '1940', '');
        equal($user.getVer()[4].poster[0].belopp, 100, '');

 
        var res = $mobile.oversikt();
        equal(res[4].typ, '(Plusgiro till Bankgiro)', '');
        equal(res[4].text, 'test', '');
        equal(res[4].belopp, 100, '');
        equal(res[4].date, "2014-10-10", '');


        var p = $mobile.getNewPayment();
        p.typ = _.findWhere($mobile.uttyp, { kontotext: "Representation" })

        p.date = "2014-10-10";
        p.repAvdragMoms = 10;
        p.repAvdrag = 90;
        p.typ.belopp = 100;
        p.konto = "1940";

        $mobile.utbet(p);
        equal($user.getVer().length, 6, 'Representation');
        equal($user.getVer()[5].poster.length, 3, 'Representation');
        equal($user.getVer()[5].poster[0].kontonr, '2641', 'Representation');
        equal($user.getVer()[5].poster[0].belopp, 10, 'Representation');

        equal($user.getVer()[5].poster[1].kontonr, '6071', 'Representation');
        equal($user.getVer()[5].poster[1].belopp, 90, 'Representation');

        equal($user.getVer()[5].poster[2].kontonr, '1940', 'Representation');
        equal($user.getVer()[5].poster[2].belopp, -100, 'Representation');

        var p = $mobile.getNewPayment();
        p.typ = _.findWhere($mobile.uttyp, { kontotext: "Representation" })

        p.date = "2014-10-10";
        p.repAvdragMoms = 10;
        p.repAvdrag = 90;
        p.typ.belopp = 100;
        p.konto = "1940";

        $mobile.utbet(p);
        equal($user.getVer().length, 7, 'Representation');
        equal($user.getVer()[5].poster.length, 3, 'Representation');
        equal($user.getVer()[5].poster[0].kontonr, '2641', 'Representation');
        equal($user.getVer()[5].poster[0].belopp, 10, 'Representation');

        equal($user.getVer()[5].poster[1].kontonr, '6071', 'Representation');
        equal($user.getVer()[5].poster[1].belopp, 90, 'Representation');

        equal($user.getVer()[5].poster[2].kontonr, '1940', 'Representation');
        equal($user.getVer()[5].poster[2].belopp, -100, 'Representation');



        start();

    });
    stop();
})


 test("moms ", function () {
     $http.get("/js/test/sie/prova.js").success( function(data){
         var file = $util.sieToString($util.str2ab(data))
         var json = parserService.sieToJson(file);
         var vers = _.where(json.poster, { etikett: 'ver'});
         var table = $moms.calculate(new Date("2010-01-01"), new Date("2010-12-31"),
             vers);
         var i = _.findWhere(table, {nr: 5})
         equal(i.belopp, 8536479, '');
         i = _.findWhere(table, {nr: 10})
         equal(i.belopp, 3402184, '');
         i = _.findWhere(table, {nr: 11})
         equal(i.belopp, 85, '');
         i = _.findWhere(table, {nr: 48})
         equal(i.belopp, -2092545, '');
         i = _.findWhere(table, {nr: 49})
         equal(i.belopp, 1309723, '');

         start();
     })

     stop();
 });

 test("moms 2", function () {
     $http.get("/js/test/sie/prova.js").success( function(data){
         var file = $util.sieToString($util.str2ab(data))
         var json = parserService.sieToJson(file);
         var vers = _.where(json.poster, { etikett: 'ver'});
         var table = $moms.calculate(new Date("2010-06-01"), new Date("2010-09-31"),
             vers);
         var i = _.findWhere(table, {nr: 5})
         equal(i.belopp, 8536479, '');
         i = _.findWhere(table, {nr: 10})
         equal(i.belopp, 3402184, '');
         i = _.findWhere(table, {nr: 11})
         equal(i.belopp, 85, '');
         i = _.findWhere(table, {nr: 48})
         equal(i.belopp, -2092545, '');
         i = _.findWhere(table, {nr: 49})
         equal(i.belopp, 1309723 , '');

         start();
     })

     stop();
 });


 test("result", function () {
     $.get("/js/test/sie/prova.js", function(data){
         var file = $util.sieToString($util.str2ab(data))
         var json = parserService.sieToJson(file);
         var vers = _.where(json.poster, { etikett: 'ver'});
         var table = $result.calculate(new Date("2010-01-01"), new Date("2010-12-31"),
             vers);
         var i = _.findWhere(table, {kontonr: 3010})
         equal(i.belopp, 6398286, '');
         var i = _.findWhere(table, {kontonr: 3021})
         equal(i.belopp, 1824736, '');
         i = _.findWhere(table, {nr: 10})
         equal(i.belopp, 6899206, '');
         i = _.findWhere(table, {nr: 11})
         equal(i.belopp, 85, '');
         i = _.findWhere(table, {nr: 48})
         equal(i.belopp, -2092545, '');
         i = _.findWhere(table, {nr: 49})
         equal(i.belopp, 1309723 , '');

         start();
     })

     stop();
 });
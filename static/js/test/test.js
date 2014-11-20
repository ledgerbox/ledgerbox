 
var myApp = angular.module('app');


myApp.config(function ($provide) {
    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
});

var injector = angular.injector(['ngMock','ng', 'app']);
var sieService;
var dbService;
var $httpBackend;
var $manager;
var parserService;
var $user;
var $util;
var $defaultData;

var init = {
    setup: function () {
        $httpBackend = injector.get('$httpBackend');
        $util = injector.get('$util');
        sieService = injector.get('sieService');
        dbService = injector.get('dbService');
        $user = injector.get('$user');
        parserService = injector.get('parserService');
        $defaultData = injector.get('$defaultData'); 
        
    }
};

module('tests', init);

test("get all verifkationer", function () {
    $user.poster = [{
        "etikett": "info",
        "books": [],
        "aktiv": 0,
        "series": [{ 'namn': 'A', 'info': '' }]
    }
        , { "etikett": "ver", "book": 0 }]
    var result = $user.getVer(); 
    equal(result.length, 1, "next ver!");
}); 

test("get next nr  ", function () {
    $user.poster = [{ "etikett": "ver", "book": "0" }, { "etikett": "info", "aktiv": "0" }]
    var result = $user.getNextNr();
    equal(result, 2, "next ver!");
    var result = $user.getNextNr('A');
    equal(result, 1, "next ver!");
});

 
 

test("to sie", function () {
    var sie = parserService.jsonToSie([{"etikett":"flagga","x":"1","id":"_17uq3ct61m8_js_pQN0F"},{"etikett":"format","PC8":"PC8","id":"_17uq3ct63ko_js_E_cvN"},{"etikett":"sietyp","id":"_17uq3ct64k0_js_RilJ-"},{"etikett":"program","programnamn":"Eboxen","version":"1.00","id":"_17uq3ct65j8_js_l7RJJ"},{"etikett":"gen","id":"_17uq3ct67ho_js_N7uvQ"},{"etikett":"fnamn","företagsnamn":"test","id":"_17uq3ct68h0_js_sc-Om"},{"etikett":"orgnr","orgnr":"","id":"_17uq3ct68h1_js_Xtio0"},{"etikett":"adress","kontakt":"","utdelningsadr":"","postadr":"","tel":"","id":"_17uq3ct69g8_js_2-MD3","orgnr":"123"},null,{"etikett":"kptyp","typ":"EUBAS97","id":"_17uq3ct6ce0_js_m02gS"},{"etikett":"konto","kontonr":"1060","kontonamn":"Hyresrtter m m","id":"_17uq3ct6dd8_js_ijKDO","aktiv":true}]);
    equal(sie.indexOf('#KONTO') > -1, true, '');
});

test("to json", function () {
    var json = parserService.sieToJson("#FLAGGA 0\n#FORMAT PC8 \n#SIETYP 1");
    equal(1, true, '');
});


test("add Series", function () {
    var info = { "series": [] };
    var serier = $util.addSeries([{ "serie": "A" }], info);
    equal("A", info.series[0].namn, '');
});

test("test files ", function () {
    equal("a|a", $util.getArryToPipe(["a", "a"]));
    equal("a", $util.getVerNameText("a|http"));
    equal(["https"][0], $util.getVerNameFiles('asd|https|aa')[0]);
});














 

  


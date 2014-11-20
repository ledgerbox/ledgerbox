
var injector = angular.injector(['ngMock','ng', 'app']);
var sieService
var dbService;
var userService;
var $http;
var $util;
var bookkeeping;
var parserService;

var init = {
    setup: function () {
         
        this.$scope = injector.get('$rootScope').$new();
        sieService = injector.get('sieService');
        dbService = injector.get('dbService');
        $http = injector.get('$http');
        parserService = injector.get('parserService');
        $util = injector.get('$util');
        userService = injector.get('$user');
        var $controller = injector.get('$controller');
        }
};

module('tests', init); 
test("decode js file", function () {
    $http.get('/js/test/sie/MAMUT_SIE4_EXPORT.js').then(function (data) {
        var json = parserService.sieToJson(data.data);
        var res = parserService.jsonToSie(json.poster);
        console.log(res)

        equal(res, data.data, '');
        start();
    })

    stop();
}) 
 
test("decode js vimsa", function () {
    $http.get('/js/test/sie/visma.js').then(function (data) {
        var json = parserService.sieToJson(data.data);
        json.poster[2].book = 1;
        json.poster[2].poster[0].book = 1;
        var res = parserService.jsonToSie(json.poster);

        equal(res, data.data, '');
        start();
    })

    stop();
})


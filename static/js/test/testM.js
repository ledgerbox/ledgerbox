 
var myApp = angular.module('app');

myApp.config(function ($provide) {
    $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
});

var injector = angular.injector(['ng', 'app', 'localytics.directives', 'lr.upload']);
var sieService;
var dbService;
var $httpBackend;
var $manager;
var parserService;
var $user;
var $util;
var $defaultData;
var $mobile;

var init = {
    setup: function () {

        $httpBackend = injector.get('$httpBackend');
        this.$scope = injector.get('$rootScope').$new();
        sieService = injector.get('sieService');
        dbService = injector.get('dbService');
        $manager = injector.get('$manager');
        $user = injector.get('$user');
        $util = injector.get('$util'); 
        parserService = injector.get('parserService');
        $defaultData = injector.get('$defaultData');
        $mobile = injector.get('$mobile');
        
    }
};

module('tests', init);
 
 

test("sell", function () {
    $user.login().then(function () {
        $mobile.sell(p);
        var ver = $user.getVer();
        equals(ver[ver.length].text, p.text);
    })
}); 
 






 

  


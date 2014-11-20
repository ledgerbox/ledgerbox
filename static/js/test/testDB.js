
var myApp = angular.module('app');

myApp.config(function ($provide) {

});

var injector = angular.injector(['ng', 'app', 'localytics.directives', 'lr.upload']);
var sieService
var dbService;
var userService;
var $http;
var $manager;
var $util;
var bookkeeping;
var parserService;

var init = {
    setup: function () {

        this.$scope = injector.get('$rootScope').$new();
        sieService = injector.get('sieService');
        $manager = injector.get('$manager');
        $util = injector.get('$util');
        dbService = injector.get('dbService');
        $http = injector.get('$http');
        parserService = injector.get('parserService');
        userService = injector.get('$user');
        var $controller = injector.get('$controller');
    }
};

module('tests', init);


test("db test ", function () {

    var client = new Dropbox.Client( { key: "rp9t9fhygr0jij8" } );

    // Try to finish OAuth authorization.
    client.authenticate({ interactive: false }, function (error) {
        if (error) {
            alert('Authentication error: ' + error);
        }
    });

    if (client.isAuthenticated()) {
        var datastoreManager = client.getDatastoreManager();
        datastoreManager.openDefaultDatastore(function (error, datastore) {
            if (error) {
                alert('Error opening default datastore: ' + error);
            } else {
                var taskTable = datastore.getTable('tasks4');
                var list= []
                for (var i = 0; i < 100; i++) {
                    list.push({'text' :
                        '{ "etikett": "ktyp", "kontonr": "2940", "asdf": { "asdf": "234" } }'
                    })
                }
                _.each(list, function (l, i) {
                    var i = taskTable.insert(l);

                })
                list = taskTable.query();
                equal(list.length, 100, '');
            }
        })
    }

})
/*
test("test cridetnals db ", function () {

    var client = new Dropbox.Client({ key: "rp9t9fhygr0jij8" });
    client.setCredentials({ "key": "rp9t9fhygr0jij8", "token": "rT160CGPbOkAAAAAAAADtliVugjcUoVr8vQ-sMIHKekfaIaNcYmbodjfpRsZtRtm", "uid": "19376108" })
    var datastoreManager = client.getDatastoreManager();
    datastoreManager.openDefaultDatastore(function (error, datastore) {
        if (error) {
            alert('Error opening default datastore: ' + error);
        } else {
            var taskTable = datastore.getTable('tasks');
            var firstTask = taskTable.insert({
                taskname: 'Buy milk',
                completed: false,
                created: new Date()
            });
        }
    })
 

})
 */
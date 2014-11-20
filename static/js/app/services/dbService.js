var app = angular.module('app');

 

app.service('dbService', function ($http, $util, $q, $log, sieService) {
    var self = this;
    var client = new Dropbox.Client({ key: "24nnxqff25hbfqu" });
    var datastore;

    this.remoteAuth = function () {
        client.authenticate();
    }

    this.getEmail = function(){
        var deferred = $q.defer();
        client.getAccountInfo(function (error, info) {
            deferred.resolve(info.email);
        });
        return deferred.promise;
    }

    this.logout = function () {
        client.signOff(); 
    }

    this.localAuth = function () {
        var deferred = $q.defer();
        client.authenticate({ interactive: false }, function (error) {
            if (error) {
                window.location= "/";
                //alert('Authentication error: ' + error);
            }
        });
        if (client.isAuthenticated()) {
            var datastoreManager = client.getDatastoreManager();
            datastoreManager.openDefaultDatastore(function (error, ds) {
                if (error) {
                    window.location= "/";
                    //alert('Error opening default datastore: ' + error);
                } else {
                    datastore = ds;
                    deferred.resolve(true);
                }
            })
        } else {
            deferred.reject('no local login');
        } 
        return deferred.promise;
    }
    
    
    
    this.isAuth = function() {
        return client.isAuthenticated();
    }

    this.delete = function (post) { 
        var taskTable = datastore.getTable('user');
        var list = taskTable.query();
        _.each(list, function (l) {
            if (post.id == l.getId()) {
                l.deleteRecord();
            }
        });
    }

    this.deleteAll = function () {
        var taskTable = datastore.getTable('user');
        var list = taskTable.query();
        _.each(list, function (l) {
            l.deleteRecord();

        })
    }


    this.add = function (post) { 
        var taskTable = datastore.getTable('user');
        var inserted = taskTable.insert({ 'typ': post.etikett, 'text': JSON.stringify(post) });
        post.id = inserted.getId();
    }

    this.update = function (post) {
        var taskTable = datastore.getTable('user');
        delete post.$$hashKey;
        taskTable.get(post.id).update({ 'typ': post.etikett, 'text': JSON.stringify(post) });
    }

    this.get = function () { 
        var taskTable = datastore.getTable('user');
        var list = taskTable.query();
        var poster = [];
        _.each(list, function (l) {
            var p = angular.fromJson(l.get('text'))
            p.id = l.getId();
            poster.push(p);
            
        })
        return poster;
    }


     

});


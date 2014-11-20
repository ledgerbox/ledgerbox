var app = angular.module('app');

 

app.service('dbMock', function ($http, $util, $q, $log, sieService) {
    var self = this;
    var nil = function() {};
    var poster = [];
    
    self.sendToDb = nil;
    self.logout = nil;
    
    function indexById(id) {
        for (var i = 0; i < poster.length; i++) {
            if(poster[i].id === id) return i;
        }
        return -1;
    }

    self.delete = function (post) { 
        poster = _.reject(poster, function(p) {
            return post.id === p.id;
        }) 
    }

    self.deleteAll = function () {
        poster = [];
    }

    var id =0;
    self.add = function (post) {
        post.id = (++id) +"";
        poster.push({ typ: post.etikett, text: JSON.stringify(post) });
    }

    self.update = function (post) {
        delete post.$$hashKey;
        var index = indexById(post.id);
        if(index >= 0) {
            poster[index] = post;
        }
    }

    self.get = function () { 
        return _.map(poster, function (l) {
            var p = angular.fromJson(l.text)
            p.id = l.id;
            return p;
            
        })
    }


    self.haveUser = function () {
        return true;
    }

     

});


var app = angular.module('app');

 

app.service('sieService', function ($http, parserService) {
    var self = this;
  
  

    this.getSieFile = function (user, index) {
        var file = {};
        file.poster = [];
        file.poster = file.poster.concat(self.getSieInfo(user));
        file.poster = file.poster.concat(user.books[index].info);
        var konton = [];
        _.each(user.sie.konton, function (k) {
            if (k.aktiv) {
                var n = angular.copy(k);
                delete n.aktiv;
                konton.push(n);
            }
        });
        file.poster = file.poster.concat(konton);
        file.poster = file.poster.concat(user.books[index].ver);
        return parserService.json2sie(file);
    }

});


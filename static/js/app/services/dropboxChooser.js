angular.module('app')

.factory('dropboxChooser', function($q) {
    return function(options) {
        var deferred = $q.defer();
        options.success = deferred.resolve;
        options.cancel = deferred.reject;
        Dropbox.choose(options);
        return deferred.promise;
    }
})
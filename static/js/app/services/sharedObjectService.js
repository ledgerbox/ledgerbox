angular.module('app')

.service('sharedObject', function () {

    var data = {};

    return {
        setv: function (key, value) {
            data[key] = value;
        },
        getv: function (key) {
            var obj = data[key];
            delete data[key];
            return obj;
        }
    }
});
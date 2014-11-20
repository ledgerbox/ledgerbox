angular.module('app')

.factory('searchText', function() {
    
    function searchTextInObj(obj, text) {
        for(var key in obj){
            if( obj.hasOwnProperty(key) ) {
                var val = obj[key];
                if(typeof val === "object") {
                    if( searchTextInObj(val, text) ) return true;
                } else {
                    val = ( (val !== null && val !== undefined) ? val.toString() : '' ).trim().toLowerCase();
                    if( val.indexOf(text) >= 0) return true;
                }
            }
        }
        return false;
    }
    
    return searchTextInObj;
})
var app = angular.module('app');

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});


app.directive('ngActive', ['$animate', function ($animate) {
    return function (scope, element, attr) {
        scope.$watch(attr.ngActive, function ngActiveWatchAction(value) {
            $animate[value ? 'addClass' : 'removeClass'](element, 'active');
        });
    };
}]);

app.directive('aDisabled', function ($compile) {
    return {
        restrict: 'A',
        priority: -99999,
        link: function (scope, element, attrs) {
            var oldNgClick = attrs.ngClick;
            if (oldNgClick) {
                scope.$watch(attrs.aDisabled, function (val, oldval) {
                    console.log(val);
                    if ( !! val) {
                        element.unbind('click');
                    } else if (oldval) {
                        attrs.$set('ngClick', oldNgClick);
                        element.bind('click', function () {
                            scope.$apply(attrs.ngClick);
                        });
                    }
                });
            }
        }
    };
});

app.directive('isDisabled', ['$animate', function ($animate) {
    return function (scope, element, attr) {
        scope.$watch(attr.isDisabled, function isDisabled(value) {
            $animate[value ? 'addClass' : 'removeClass'](element, 'disabled');
        });
    };
}]);

app.filter('siedate', function () {
    return function (value) {
        if (!value) return '';

        var year = value.substring(0, 4);
        var mm = value.substring(4, 6);
        var dd = value.substring(6, 8);
        return year +"-" +mm  +"-" +dd;
    };
});

app.filter('float', function () {
    return function (input) {
        if(input){
            return input.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').replace('.', ',');
        }
        return ""
    };
});


app.filter('showIfPosetive', function () {
    return function (input) {
        if(input){
            return input > 0 ? input : "";
        }
        return ""
    };
});

app.filter('showIfNegative', function () {
    return function (input) {
        if(input){
            return input < 0 ? input : "";
        }
        return ""
    };
});




app.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

app.directive('uiBlur', function() {
    return function( scope, elem, attrs ) {
        elem.bind('blur', function() {
            scope.$apply(attrs.uiBlur);
        });
    };
});

app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return; 

  
            ctrl.$parsers.unshift(function (viewValue) {
                viewValue = viewValue || '';
                var plainNumber = viewValue.replace(/[^\d|\-+|\,+]/g, '');
                var showVal = ("" + plainNumber).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                elem.val(showVal);
                return plainNumber.replace(",", ".");
            });
        }
    };
}]);



app.directive("dropzone", function () {
    return {
        restrict: "A",
        link: function (scope, elem) {
            elem.bind('drop', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();

                var files = evt.dataTransfer.files;
                for (var i = 0, f; f = files[i]; i++) {
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(f);

                    reader.onload = (function (theFile) {
                        return function (e) {
                            var newFile = {
                                name: theFile.name,
                                type: theFile.type,
                                size: theFile.size,
                                lastModifiedDate: theFile.lastModifiedDate
                            }

                            scope.addfile(newFile);
                        };
                    })(f);
                }
            });
        }
    }
});

app.filter('sum', function() {
    return function(arr, item) {
        var tot = 0;
        _.each(arr, function (a) {
             tot += a[item];
        });
        return tot;
    };
});

app.filter('kontonrFilter', function () {
    return function( items, start, end ) {
        var res = _.filter(items, function(item){

            if(start <= parseInt(item.kontonr) && parseInt(item.kontonr) <= end){
                return true;
            }
            return false;
        })
        return res;
    }
});

app.filter('kontonrSum', function () {
    return function( items, start, end ) {
        var belopp = 0;
        var res = _.each(items, function(item){

            if(start <= parseInt(item.kontonr) && parseInt(item.kontonr) <= end){
                belopp += item.belopp;
            }
        })

        return belopp;
    }
});

app.directive("fileread", function ($util) {
    return { 
        scope: { 
            read: '&'
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) { 
                    scope.read({ arg: loadEvent.target.result })
                    scope.$apply();
                }
                reader.readAsArrayBuffer(changeEvent.target.files[0]);
            });
        }
    }
});
 
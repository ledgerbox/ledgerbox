angular.module('app')
    .directive('datagrid', function() {
        return {
            restrict: 'A',
            controller: function($scope, $element, $attrs) {
                // create a namespace to host the different sort bindings
                this.name = $attrs.datagrid;
                var ns = this.ns = $scope[this.name] = {};
                
                ns.predicate = '';
                ns.reverse = false;
                ns.orderBy = '';
                ns.search = {};
                ns.hiddenCols = [];
                
                ns.range = function (total) {
                    var r = [];
                    for (var i = 0; i < total; i++) {
                        r.push(i);
                    }
                    return i;
                }
                
                // method called by child sort-by directives
                ns.toggleSort = this.toggleSort = function(column, order) {
                    if(order) {
                        ns.predicate = column;
                        ns.reverse = (order === '-');
                    } else {
                        if (column === ns.predicate) {
                        ns.reverse = !ns.reverse;
                        }
                        else {
                            // new column, sort asc
                            ns.predicate = column;
                            ns.reverse = false;
                        }    
                    }
                    
                    ns.orderByExp = (ns.reverse ? '-':'+') + ns.predicate;
                };
                
                ns.cssShowHide = function(cols) {
                    var classes = [];
                    for (var i = 0; i < cols; i++) {
                        classes.push( ns.isColHidden(i) ? 'hide-'+i : 'show-'+i);
                    }
                    return classes.join(" ");
                }
                
                ns.isColHidden = this.isColHidden = function(column) {
                    return ns.hiddenCols.indexOf(column) >= 0;
                }
                
                ns.toggleDisplay = this.toggleDisplay = function(column, show) {
                    var index = ns.hiddenCols.indexOf(column), 
                                isHidden = (index >= 0);
                    if(show === undefined) {
                        show = isHidden;
                    }
                    if(show && isHidden) {
                        ns.hiddenCols.splice(index, 1);
                    } else if(!show && !isHidden) {
                        ns.hiddenCols.push(column);
                    }
                }
                
                var paginator = this.paginator = ns.paginator = {};
                paginator.start = paginator.numberOfPages = 0;
                paginator.currentPage = 0;
                paginator.pageSize = $attrs.datagridPageSize || 10;
                paginator.paginate = function paginate(array) {
                    array = array || [];
                    paginator.numberOfPages = Math.max(Math.ceil(array.length/paginator.pageSize), 1);
                    paginator.start = paginator.currentPage * paginator.pageSize;
                    paginator.end = paginator.start + paginator.pageSize - 1;
                    paginator.data = array.slice(paginator.start , paginator.start + paginator.pageSize);
                    return paginator.data;
                };
            }
        }
    })
    .directive('sortBy', function () {
        return {
            restrict: 'A',
            require: '^datagrid',
            templateUrl: '/html/partials/sortable.html',
            transclude: true,
            scope: {},
            link: function(scope, el, attrs, ctrl) {
                scope.ns = ctrl.ns;
                scope.column = attrs.sortBy;
                if(attrs.defaultSort) {
                    ctrl.toggleSort(scope.column, attrs.defaultSort);
                }
                scope.toggleSort = function () {
                    ctrl.toggleSort(scope.column);
                }
            }
        }
    })
    .directive('paginator', function () {
        return {
            restrict: 'E',
            require: '^datagrid',
            templateUrl: '/html/partials/paginator.html',
            scope: {},
            link: function(scope, el, attrs, ctrl) {
                scope.ns = ctrl.paginator;
            }
        }
    })
    .directive('toggleColDisplay', function () {
        return {
            restrict: 'A',
            require: '^datagrid',
            transclude: true,
            templateUrl: '/html/partials/toggleColDisplay.html',
            scope: {},
            link: function(scope, el, attrs, ctrl) {
                scope.ns = ctrl.ns;
                scope.column = parseInt(attrs.toggleColDisplay);
                scope.toggleDisplay = function () {
                    ctrl.toggleDisplay(scope.column);
                }
            }
        }
    })
    .directive('colIndex', function () {
        return {
            restrict: 'A',
            require: '^datagrid',
            link: function(scope, el, attrs, ctrl) {
                attrs.$addClass('col-'+attrs.colIndex);
            }
        }
    })
    .directive('colHide', function () {
        return {
            restrict: 'A',
            require: '^datagrid',
            link: function(scope, el, attrs, ctrl) {
                var col = parseInt(attrs.colIndex);
                if( !isNaN(col) ) {
                    ctrl.toggleDisplay(col, false);
                }
            }
        }
    })
    .filter('paginate', function() {
        return function (data, grid) {
            return grid.paginate(data);
        }
    })
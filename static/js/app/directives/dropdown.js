angular.module('app')
.directive('dropdown', function () {
        return {
            restrict: 'E',
            require: '^datagrid',
            templateUrl: '/html/partials/dropdown.html',
            transclude: true,
            scope: {
                icon: '@', title: '@'
            }
        }
    })
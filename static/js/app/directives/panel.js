angular.module('app')
.directive('panel' ,function($timeout) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: '/html/partials/panel.html',
		scope: { 
		    title: '@'
		},
		link: function(scope, el, attrs) {
		    scope.collapse = false;
		    $timeout(function () {
                scope.collapse = attrs.collapse;
		    })
		}
	}
})

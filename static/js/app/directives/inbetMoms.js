angular.module('app')
.directive('momsinbet' ,function($timeout) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: '/html/partials/momsinbet.html'
	}
})

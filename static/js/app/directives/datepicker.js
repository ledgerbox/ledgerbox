angular.module('app')
.directive('datepicker' ,function() {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: '/html/partials/datepicker.html',
		link: function(scope, el, attrs) {
			el.find('.input-group.date').datepicker({
				format: attrs.dateFormat || 'yyyy-mm-dd'
			});
		}
	}
})
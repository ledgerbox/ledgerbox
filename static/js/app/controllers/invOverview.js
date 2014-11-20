var app = angular.module('app');


app.controller('invOverviewCtrl', function (
                                    $scope, $filter, $user,
                                    $util, $window, $location, $manager, $log, 
                                    pdfMake, ddInvoice, sharedObject, searchText) {
                    
    $log.info("init invOverviewCtrl");


    $scope.show = function(inv){
        sharedObject.setv(inv.id, inv);
        $location.path("/desktop/invoices/show/"+inv.id);
    }
    
    $scope.edit = function(inv){
        sharedObject.setv(inv.id, inv);
        $location.path("/desktop/invoices/edit/"+inv.id);
    }
    
    $scope.remove = function(v){
        var i = $scope.invoices.indexOf(v);
        if(i >= 0) {
            $user.removeInvoice(v);
            $scope.invoices.splice(i,1);
        }
    }
    
    $scope.generatePdf = function(inv) {
        $scope.companyData = $user.getCompanyData();
        $scope.companyData.logo = _.findWhere( $user.poster, { etikett: 'logo' } )['src'];
        ddInvoice( inv, $scope.companyData )
		.then(function (result) {
			$window.open(result);  
		});
	}
    
    $scope.search = function (inv) {
        var search = $scope.g.search;
        if(search.freeText) {
            if( !searchText(inv, search.freeText.trim().toLowerCase()) ) {
                return false;
            }
        } else {
            var customer = search.customer ? search.customer.trim().toLowerCase() : '';
            var date = new Date(inv.date);
            if(customer && inv.customer.name.toLowerCase().indexOf(customer) < 0 ) {
                return false;
            }
            if(search.startDate && date < new XDate(search.startDate) ) {
                return false
            }
            if(search.endDate &&  date > new XDate(search.endDate)) {
                return false;
            }
        }
         return true;
    }
    
    $scope.invoices = $user.getInvoice();

});
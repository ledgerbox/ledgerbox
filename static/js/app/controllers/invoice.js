
angular.module('app')
.controller('invoiceLineCtrl', function($scope, $user, $location){
		
	function priceExclTax() {
		return $scope.line.qty * $scope.line.unitPrice;
	}
	
	function VAT() {
		return $scope.line.priceExclTax * $scope.line.VATRate;
	}
	
	$scope.$watch(priceExclTax, function(newValue) {
		$scope.line.priceExclTax = newValue;	
	})
	
	$scope.$watch(VAT, function(newValue) {
		$scope.line.VAT =newValue;	
	})
})

.controller('invoiceCtrl', function(
				$scope, $routeSegment, $util, $user, $window,
				sharedObject, pdfMake, ddInvoice) {
	var now = $util.getStringDate(new Date());
    var d = new Date();

    d.setMonth( d.getMonth( ) + 1 )
    var nowPlus30 = $util.getStringDate(d);
    var faktura = _.findWhere( $user.poster, { etikett: 'invoice' })

    var fakturaNr = 1;
    if(faktura){
	    fakturaNr = 1 + faktura.length;
    }
    $scope.companyData = $user.getCompanyData();
	$scope.companyData.logo = _.findWhere( $user.poster, { etikett: 'logo' }).src;
	
    $scope.inv = {};
    $scope.mode = {};
    
    
    $scope.clear = function() {
    	$scope.inv = {
			num: fakturaNr, date: now, maturity: nowPlus30, ref: '', penaltyInterest: '' ,
			customer: {
				name: '',
				address: '', street: '', city: ''
			},
			lines: [
				{ text: '', qty: 0, unitPrice: 0, VATRate: 0.25 }
			],
			VATGroups: [
				{ VATRate: 0.25, priceExclTax: 0, VAT: 0, rounding: 0, total: 0 }
			]
		};
    }
    
    $scope.addLine = function() {
		$scope.inv.lines.push({ text: 'Ny...', qty: 0, unitPrice: 0, VATRate: 0.25 });
	}
		
	$scope.removeLine = function(item) {
	   var index = $scope.inv.lines.indexOf(item);
        if(index >= 0) {
            $scope.inv.lines.splice( index, 1 );
	    }
	}
	
	$scope.generatePdf = function() {
		ddInvoice( $scope.inv, $scope.companyData )
		.then(function (result) {
			$window.open(result);
		})
	}
	
	$scope.save = function() {
        $util.info("Invoice " + $scope.inv.num +" är skapad" );
        
		if($scope.inv.id) {
			$user.updateInvoice($scope.inv);
		} else {
			$user.addInvoice($scope.inv);
		}
		$scope.clear();
		$scope.frmInv.$setPristine();
        $location.path('/desktop/invoices')
	}
	    
    function VATGroups() {
		var vg = {};
		var lines = $scope.inv.lines;
		for(var i=0; i<lines.length; i++) {
			var item = lines[i]; 
			var rate = item.VATRate;
			var vgi = vg[ ''+rate ];
			if( ! vgi ) {
				vgi = vg[ ''+rate ] = { VATRate: item.VATRate, priceExclTax: 0, VAT: 0, rounding: 0, total: 0 };
			}
			vgi.priceExclTax += item.qty * item.unitPrice;
		}
		var res = [];
		for(var k in vg) {
			var vgii = vg[k];
			vgii.VAT = vgii.priceExclTax * vgii.VATRate;
			vgii.total = vgii.priceExclTax + vgii.VAT;
			res.push(vgii);
		}
		return res;
	}
	
	function totalExlTax() {
		var total = 0;
		var lines = $scope.inv.lines;
		for(var i=0; i<lines.length; i++) {
			var item = lines[i];
			total += item.qty * item.unitPrice;
		}
		return total;
	};
	
	function totalVAT() {
		var totalVAT = 0;
		var lines = $scope.inv.lines;
		for(var i=0; i<lines.length; i++) {
			var item = lines[i];
			totalVAT += item.priceExclTax * item.VATRate;
		}
		return totalVAT;
	};
	
	
	
	$scope.$watch('inv.lines', function() {
		$scope.inv.VATGroups = VATGroups();
		$scope.inv.totalExlTax = totalExlTax();
		$scope.inv.totalVAT = totalVAT();
		$scope.inv.totalIncTax = $scope.inv.totalExlTax + $scope.inv.totalVAT;
		$scope.inv.toBePaid = Math.floor($scope.inv.totalIncTax);
	}, true);
	
	var mode = $routeSegment.$routeParams.mode;
    var id = $routeSegment.$routeParams.id;
    $scope.clear();
    if (mode == "show") {
        $scope.mode.view = true;
        $scope.inv = sharedObject.getv(id);
    } else if (mode == "edit") {
        $scope.mode.view = false;
        $scope.inv = angular.copy(sharedObject.getv(id));
    }

    $scope.moms = $user.getInfo().moms;

    
});
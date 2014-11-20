var app = angular.module('app');

app.controller('autokonteraCtrl', function ($scope, $log, $user, $util, $http) {
    $log.info("init, autokonteraCtrl");
    
    $scope.error = ''
    
    function parseBankFile(txt, fields) {
        var res = [];
    	var numFields = fields.length;
    	var idx = txt.indexOf(fields[0]);
    	if(idx >= 0) {
    		txt = txt.substr(idx).split('\n');
    		for(var i=1; i<txt.length; i++) {
    			var line = txt[i];
    			if(line && line.trim() ) {
    				line = line.split('\t');
    				if(numFields !== line.length) {
    				    $scope.error = 'Invalid bank transaction file';
    				    return;
    				}
    				var item = {};
    				for(var j=0; j<fields.length; j++) {
    					item[fields[j]] = line[j];
    				}
    				res.push(item);
    			}			
    		}
    		return res;
    	} else {
    		$scope.error = 'Invalid bank transaction file';
    	}
    }
    
    function getVerBankTrans(vers) {
        var res = [];
        for(var i=0, l=vers.length; i<l; i++) {
            var ver = vers[i];
            var poster = ver.poster;
            for(var ii=0, ll=poster.length; ii<ll; ii++) {
                var p = poster[ii];
                if(p.kontonr === '1930' || p.kontonr === '1940') {
                    res.push({
                        date:    $util.sieToDate(ver.verdatum),
                        kontonr :   p.kontonr,
                        name:    ver.vertext,
                        amount:  p.belopp 
                    });
                }
            }
        }
        return res;
    }
    
    function findMatchVer(bankTrans, vers) {
        bankTrans.Belopp = +(bankTrans.Belopp.replace(',', '.').replace(/\s+/g, ''));
        for(var i=0, l=vers.length; i<l; i++) {
            var v = vers[i];
            if(bankTrans.Transdag === v.date && bankTrans.Belopp === v.amount) {
                return i;
            }
        }
        return -1;
    }
    
    function matchBankTrans(transList, vers) {
        var matchList = [];
        for(var i=transList.length-1; i>=0; i--) {
            var bt = transList[i];
            var matchIndex = findMatchVer(bt, vers);
            matchList.push({
                date: bt.Transdag,
                acc: ( matchIndex >= 0 ? vers[matchIndex]: null ),
                bank: bt
            });
            // since it's a 1<->1 match no need to keep the matched ver
            if(matchIndex >= 0) {
                vers.splice(matchIndex, 1);
            }
        }
        
        // add all remaining (unmatched) vers
        for(var i=0, l=vers.length; i<l; i++) {
            var v = vers[i];
            matchList.push({
                date: v.accDate,
                acc: v,
                bank: null
            })
        }
        return matchList;
    }
    
    var fields = ['Radnr', 'Clnr', 'Kontonr', 'Produkt', 'Valuta', 'Bokfdag', 'Transdag', 'Valutadag', 'Referens', 'Text', 'Belopp', 'Saldo'];
    $scope.doDiff = function () {
        $http.get("/js/test/banktransaction.txt").success( function(data){
            var btrans = parseBankFile(data, fields);

            // filter out transaction with bank accounts
            var bankVers = getVerBankTrans($user.getVer());
            $scope.matchList = matchBankTrans(btrans, bankVers);
            
        })
    }
    
    

});


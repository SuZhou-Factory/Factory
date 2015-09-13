(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BillHistoryViewController', BillHistoryViewController);

    /** @ngInject */
    function BillHistoryViewController($scope, $rootScope, $http, $timeout, Tools, DataService) {
        if ($scope.$parent.$parent.data.viewBillid) {
	        $scope.viewBillid = $scope.$parent.$parent.data.viewBillid;
	        // getBillView(265);
        }

        $scope.back = function() {
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.viewPageShow = false;
            $scope.$parent.$parent.data.viewBill = null;
        };
        $scope.print = function(selector) {
            var options = {
            	mode : 'iframe',
            	popClose : false,
            	extraCss : 'print'
            };
        	$(selector).printArea(options);
        };
        $scope.printAll = function() {
        	var html = $('.print').html();
        	$scope.print('<div class="print">' + html + '</div>');
        };
        $scope.printNoMoney = function() {
        	$scope.hideMoney = true;
        	var html = $('.print').html();
        	$scope.print('<div class="print">' + html + '</div>');
        	$scope.hideMoney = true;
        };
        $scope.printMilt = function() {
        	$('.print-right').addClass('noPrint');
        	var html = $('.print').html();
        	$scope.print('<div class="print">' + html + '</div>');
        	$('.print-right').removeClass('noPrint');
        };

        $scope.getBillView = function() {
            $http.post(Setting.host + 'billHistory/historyDetail', {bill: {id: $scope.viewBillid}}).success(function(data){
                if (data.bills && !(data.bills instanceof Array)) {
                    data.bills = [data.bills];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {

            });
        };
        $scope.getBillView();
    }
})();

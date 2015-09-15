(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BillViewController', BillViewController);

    /** @ngInject */
    function BillViewController($scope, $rootScope, $timeout, Http, Tools, DataService) {
        if ($scope.$parent.$parent.data.viewBill) {
	        $scope.data = {bill: $scope.$parent.$parent.data.viewBill};
            $scope.data.bill.ordersTotlemoney = 0;
	        for (var i = 0; i < $scope.data.bill.orders.length; i++) {
                $scope.data.bill.ordersTotlemoney += $scope.data.bill.orders[i].orderamount;
            }
            $scope.data.bill.unpaidmoney = ($scope.data.bill.unpaidmoney - 0).toFixed(2);
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
            	extraCss : 'print',
                retainAttr : ["id","class","style","value"]
            };
        	$(selector).printArea(options);
        };
        $scope.printAll = function() {
            $('span[name="unpay"]').show();
            $('input[name="unpay"]').addClass('noPrint');
        	var html = $('.print').html();
        	$scope.print('<div class="print">' + html + '</div>');

            $('span[name="unpay"]').hide();
            $('input[name="unpay"]').removeClass('noPrint');
        };
        $scope.save = function() {
            var info = {
                bill:{
                    name: $scope.data.bill.name,
                    billendtime: $scope.data.bill.billendtime,
                    peopletype: $scope.data.bill.peopletype,
                    unpaidmoney: $scope.data.bill.unpaidmoney
                }
            }

            Http.post('bill/save', info).success(function(data){
                if (data.result.code == '000000') {
                    Tools.alert({
                        data: {
                            message: '保存成功'
                        },
                        success: function() {
                            $scope.back();
                        },
                        error: function() {
                            $scope.back();
                        }
                    });
                } else {
                    Tools.alert({
                        data: {
                            message: '保存失败'
                        },
                        success: function() {
                            $scope.back();
                        },
                        error: function() {
                            $scope.back();
                        }
                    });
                }
            });
        };
    }
})();

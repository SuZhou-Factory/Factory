(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('OrderViewController', OrderViewController);

    /** @ngInject */
    function OrderViewController($scope, $rootScope, $timeout, Http, Tools, DataService) {
        if ($scope.$parent.$parent.data.viewOrderid) {
	        getOrderView($scope.$parent.$parent.data.viewOrderid);
        }

        function getOrderView(id) {
            Http.post('order/detail', {order: {id: id}}).success(function(data) {
                var stateList = ['待发货', '已发货', '推迟处理'];
                data.order.orderstatus = stateList[data.order.orderstatus];
                $scope.data = {order: data.order};
            });
        }

        $scope.back = function() {
            $scope.$parent.$parent.updatePageShow = false;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.updatePageShow = false;
            $scope.$parent.$parent.data.viewPageShow = false;
            $scope.$parent.$parent.data.viewOrderid = null;
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
            $('.money').addClass('noPrint');
        	var html = $('.print').html();
        	$scope.print('<div class="print">' + html + '</div>');
            $('.money').removeClass('noPrint');
        };
        $scope.printMilt = function() {
        	$('.print-right').addClass('noPrint');
            // $('#orderstatus').addClass('noPrint');
        	var html = $('.print').html();
        	$scope.print('<div class="print">' + html + '</div>');
        	$('.print-right').removeClass('noPrint');
            // $('#orderstatus').removeClass('noPrint');
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('WujinViewController', WujinViewController);

    /** @ngInject */
    function WujinViewController($scope, $rootScope, $http, $timeout, Tools, DataService) {
        if ($scope.$parent.$parent.data.viewOrder) {
            $scope.order = $scope.$parent.$parent.data.viewOrder;
	        getWujinView($scope.order.id);
        }

        function getWujinView(id) {
            $http.post(Setting.host + 'wujin/detail', {orderItem: {id: id}}).success(function(data) {
                if (data.result.code == '000000') {
                    // var stateList = ['待发货', '已发货', '推迟处理'];
                    // data.order.orderstatus = stateList[data.order.orderstatus];
                    $scope.data = {orderItem: data.orderItem};
                } else {
                }
            }).error(function(data) {
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
    }
})();

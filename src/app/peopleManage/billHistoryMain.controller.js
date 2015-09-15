(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BillHistoryMainController', BillHistoryMainController);

    /** @ngInject */
    function BillHistoryMainController($scope, $state, $modal, Http, DataService, Tools) {
        $scope.tableHead = ['日期', '姓名', '类型', '总计金额（元）', '实付金额（元）', '欠款金额（元）', '操作'];

        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };
        // -- 网络请求相关定义
        $scope.searchInfo = {
            bill: {
                name: '',
                billstarttime: '',
                billendtime: '',
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            Http.post('billHistory/index', $scope.searchInfo).success(function(data){
                if (data.bills && !(data.bills instanceof Array)) {
                    data.bills = [data.bills];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            });
        };

        $scope.search();

        $scope.view = function() {
            $scope.$parent.$parent.data.viewBillid = this.bill.id;
            $scope.$parent.$parent.viewPageShow = true;
            $scope.$parent.$parent.data.viewPageShow = true;
        };
    }
})();

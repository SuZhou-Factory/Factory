(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BillMainController', BillMainController);

    /** @ngInject */
    function BillMainController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.tableHead = ['日期', '名称', '名称类型', '总计金额（元）', '实付金额（元）', '欠款金额（元）', '操作'];

        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };
        // -- 网络请求相关定义
        $scope.searchInfo = {
            bill: {
                name: '',
                billendtime: new Date(),
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'bill/index', $scope.searchInfo).success(function(data){
                if (data.bills && !(data.bills instanceof Array)) {
                    data.bills = [data.bills];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {

            });
        };

        // // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        // $scope.data = DataService.fetch($state.current.name);
        // if (_.isEmpty($scope.data)) {
        //     $scope.search(function() {
        //         DataService.mount($state.current.name, $scope.data);
        //     });
        // }
        $scope.search();

        $scope.view = function() {
            $scope.$parent.$parent.data.viewBill = this.bill;
            $scope.$parent.$parent.viewPageShow = true;
            $scope.$parent.$parent.data.viewPageShow = true;
        };

    }
})();

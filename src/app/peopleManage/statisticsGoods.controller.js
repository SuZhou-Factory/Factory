(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('StatisticsGoodsController', StatisticsGoodsController);

    /** @ngInject */
    function StatisticsGoodsController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.tableHead = ['材料名称', '数量', '金额（元）'];

        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };

        // -- 网络请求相关定义
        $scope.searchInfo = {
            orderItem: {
                name: '',
                startTime: '',
                endTime: ''
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'tongjiGoods/index', $scope.searchInfo).success(function(data){
                if (data.goodsList && !(data.goodsList instanceof Array)) {
                    data.goodsList = [data.goodsList];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {

            });
        };
        $scope.search();
    }
})();

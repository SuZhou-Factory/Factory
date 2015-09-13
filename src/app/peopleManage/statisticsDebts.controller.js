(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('StatisticsDebtsController', StatisticsDebtsController);

    /** @ngInject */
    function StatisticsDebtsController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.tableHead = ['姓名', '现欠总额'];

        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.page.pageNo = pageNo;
            $scope.data.resultList = $scope.alldata.resultList.slice($scope.page.pageSize*(pageNo-1), $scope.page.pageSize*pageNo);
        };

        $scope.page = {
            pageNo: 1,
            pageSize: 15,
        };

        // $scope.totalItems = 75;



        // -- 网络请求相关定义
        $scope.searchInfo = {
            order:{
            	startMoney: '',
            	endMoney: ''
            },
        };
        $scope.search = function() {
            $http.post(Setting.host + 'tongji/index', $scope.searchInfo).success(function(data){
                if (data.resultList && !(data.resultList instanceof Array)) {
                    data.resultList = [data.resultList];
                }
                $scope.alldata = data;
                $scope.data = {
                	resultList: data.resultList.slice(0, $scope.page.pageSize),
                };
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {

            });
        };
        $scope.search();
    }
})();

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('StatisticsDebtsController', StatisticsDebtsController);

    /** @ngInject */
    function StatisticsDebtsController($scope, $state, $modal, Http, DataService, Tools) {
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

        // -- 网络请求相关定义
        $scope.searchInfo = {
            order:{
            	startMoney: '',
            	endMoney: ''
            },
        };
        $scope.search = function() {

            Http.post('tongji/index', $scope.searchInfo).success(function(data){
                if (data.resultList && !(data.resultList instanceof Array)) {
                    data.resultList = [data.resultList];
                }
                $scope.alldata = data;
                if (data.resultList) {
                    if (data.resultList.length < $scope.page.pageSize) {
                        $scope.data = {
                            resultList: data.resultList.slice(0, data.resultList.length),
                        };
                    }else{
                        $scope.data = {
                            resultList: data.resultList.slice(0, $scope.page.pageSize),
                        };
                    };
                    /*$scope.data = {
                        resultList: data.resultList.slice(0, $scope.page.pageSize),
                    };*/
                    $scope.totalItems = $scope.data.totalNum;
                } else {
                    $scope.data = {
                        resultList: [],
                    };
                }
                
               
            });
        };
        $scope.search();
    }
})();

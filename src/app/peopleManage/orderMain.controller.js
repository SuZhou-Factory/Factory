(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('OrderMainController', OrderMainController);

    /** @ngInject */
    function OrderMainController($scope, $state, $modal, Http, DataService, Tools) {
        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };

        // -- 网络请求相关定义
        $scope.searchInfo = {
            order: {
                peoplename: '',
                ordername: '',
                orderstatus: '',
                startTime: '',
                endTime: ''
            },
            page: {
            	pageNo: 1,
            	pageSize: 15,
            }
        };
        $scope.search = function(callback) {
            Http.post('order/index', $scope.searchInfo).success(function(data){
                if (data.orders && !(data.orders instanceof Array)) {
                    data.orders = [data.orders];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
                if (callback) {
                    callback();
                }
            });
        };

        $scope.search();

        // -- 页面相关数据以及控制
        $scope.add = function() {
            $scope.$parent.$parent.updatePageShow = true;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.updatePageShow = true;
            $scope.$parent.$parent.data.viewPageShow = false;
        };
        $scope.edit = function(order) {
            $scope.$parent.$parent.data.editOrderid = order.id;
            $scope.$parent.$parent.updatePageShow = true;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.updatePageShow = true;
            $scope.$parent.$parent.data.viewPageShow = false;
            // $state.go('main.orderupdate', {orderid: order.id});
        };
        $scope.view = function(order) {
            // $scope.$parent.$parent.data.editOrderid = order.id;
            $scope.$parent.$parent.data.viewOrderid = order.id;
            $scope.$parent.$parent.updatePageShow = false;
            $scope.$parent.$parent.viewPageShow = true;
            $scope.$parent.$parent.data.updatePageShow = false;
            $scope.$parent.$parent.data.viewPageShow = true;
        };
        $scope.delete = function(order) {
            Tools.alert({
                data: {
                    // title: '提示',
                    message: '确认删除？',
                },
                success: function() {
                    var info = {
                        order: {
                            id: order.id,
                            peoplename: '',
                            ordername: '',
                            orderstatus: '',
                            startTime: '',
                            endTime: ''
                        },
                        page: {
                            pageNo: 1,
                            pageSize: 15,
                        }
                    };
                    Http.post('order/delete', info).success(function(data){
                        $scope.search();
                    });
                },
                error: function() {

                }
            });
        }
        $scope.updateState = function(order) {
            if (order.orderstatus != order.orderstatus0) {

            }
            Tools.alert({
                data: {
                    // title: '提示',
                    message: '确认修改当前订单状态？',
                },
                success: function() {
                    var info = {
                        order: {
                            id: order.id,
                            orderstatus: order.orderstatus,
                        }
                    };
                    Http.post('order/updateStatus', info).success(function(data){
                        order.orderstatus0 == order.orderstatus;
                        $scope.search();
                    }).error(function(data) {
                        order.orderstatus == order.orderstatus0;
                        $scope.search();
                    });
                },
                error: function() {
                    order.orderstatus == order.orderstatus0;
                    $scope.search();
                }
            });

        };
    }

})();

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('OrderMainController', OrderMainController);

    /** @ngInject */
    function OrderMainController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.orderHead = ['时间', '名称', '产品', '金额', '状态', '最后修改', '明细', '操作'];
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
            $http.post(Setting.host + 'order/index', $scope.searchInfo).success(function(data){
                if (data.orders && !(data.orders instanceof Array)) {
                    data.orders = [data.orders];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
                if (callback) {
                    callback();
                }
            }).error(function(data) {

            });
        };
        // $scope.search();
        // // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        // $scope.data = DataService.fetch($state.current.name);
        // if (_.isEmpty($scope.data)) {
        //     $scope.search(function() {
        //         DataService.mount($state.current.name, $scope.data);
        //     });
        // }

        // // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        // $scope.data = $scope.$parent.$parent.data.mainPageData;
        // if (!$scope.data && _.isEmpty($scope.data)) {
        //     $scope.search(function() {
        //         $scope.$parent.$parent.data.mainPageData = $scope.data;
        //     });
        // }
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
                    $http.post(Setting.host + 'order/delete', info).success(function(data){
                        $scope.search();
                    }).error(function(data) {

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
                    $http.post(Setting.host + 'order/updateStatus', info).success(function(data){
                        order.orderstatus0 == order.orderstatus;
                        $scope.search();
                    }).error(function(data) {
                        order.orderstatus == order.orderstatus0;
                    });
                },
                error: function() {
                    order.orderstatus == order.orderstatus0;
                }
            });

        };
        // // -- 旧的 页面相关数据以及控制
        // $scope.add = function() {
        //     var addorder = {
        //         id: '',
        //         name: '',
        //         price: '',
        //         ordertype: '0'
        //     };
        //     var modal = {
        //         title: '添加材料',
        //         order: addorder,
        //     };

        //     openModal(modal, function(data) {
        //         //刷新页面
        //         $scope.search();
        //     }, function(data) {

        //     });
        // };
        // $scope.edit = function(order) {
        //     $state.go('main.orderupdate', {orderid: order.id});
        // };
    }

})();

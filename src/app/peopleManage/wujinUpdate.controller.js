(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('WujinUpdateController', WujinUpdateController);

    /** @ngInject */
    function WujinUpdateController($scope, $http, $state, DataService, Tools) {
        var newOrder = {
            id: '',
            peoplename: '',
            ordertime: new Date(),
            orderItems: {
                id: '',
                name: '',
                count: '',
                price: '',
                totalmoney: '',
                note: '',
                unit: '',
                detailSize: '',
                itemDetails: []
            }
        };

        // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        $scope.data = $scope.$parent.$parent.data.updatePageData;
        if (!$scope.data || _.isEmpty($scope.data)) {
            $scope.data = {};
            if ($scope.$parent.$parent.data.editInfo) {
                $scope.isEdit = true;
                $scope.data.order = $scope.$parent.$parent.data.editInfo;
                // getEditOrder($scope.$parent.$parent.data.editInfo);
            } else {
                $scope.data.order = newOrder;
            }
            $scope.$parent.$parent.data.updatePageData = $scope.data;
        }

        function getSelectOption() {
            var info = {
                goods: {
                    goodstype: '-7',
                },
                page: {
                    pageNo: 1,
                    pageSize: 1000
                }
            };
            $http.post(Setting.host + 'goods/index', info).success(function(data){
                if (data.goods && !(data.goods instanceof Array)) {
                    data.goods = [data.goods];
                }
                // $scope.data.options = [{
                //     key: '11',
                //     value: '1111',
                // },{
                //     key: '22',
                //     value: '2222',
                // },{
                //     key: '33',
                //     value: '3333',
                // }];
                $scope.data.options = data.goods;
                // for (var i = 0; i < data.goods.length; i++) {
                //     $scope.data.options.push({
                //         id: data.goods[i].id,
                //         name: data.goods[i].name,
                //         details: data.goods[i].childGoodsList,
                //     });
                // }
                if ($scope.data.options.length > 0) {
                    $scope.goodsIndex = 0;
                    ChangeDetailsT($scope.data.options[0]);
                }
            }).error(function(data) {

            });
        }
        getSelectOption();


        $scope.getAssociatedOrder = function() {
            if (!$scope.data.order.peoplename || $scope.data.order.peoplename == '') {
                Tools.alert({
                    data: {
                        message: '请输入名称',
                    },
                    success: function() {
                    },
                    error: function() {
                    }
                });
                return;
            }
            if (!$scope.data.order.ordertime || $scope.data.order.ordertime == '') {
                Tools.alert({
                    data: {
                        message: '请选择日期',
                    },
                    success: function() {
                    },
                    error: function() {
                    }
                });
                return;
            }
            var info = {
                order: {
                    peoplename: $scope.data.order.peoplename,
                    time: $scope.data.order.ordertime
                }
            };
            $scope.data.associatedOrders = [];
            $http.post(Setting.host + 'order/search', info).success(function(data){
                if (data.orders && !(data.orders instanceof Array)) {
                    data.orders = [data.orders];
                }
                $scope.data.associatedOrders = data.orders;
                // $scope.data.associatedOrders = [{
                //     id: '11',
                //     ordername: '1111'
                // },{
                //     id: '22',
                //     ordername: '2222'
                // },{
                //     id: '33',
                //     ordername: '3333'
                // },{
                //     id: '44',
                //     ordername: '4444'
                // }];

                if ($scope.data.associatedOrders.length > 0) {
                    $scope.data.associatedOrderIndex = 0;
                    $scope.ChangeAssociatedOrder();
                }
            }).error(function(data) {

            });
        }

        $scope.ChangeAssociatedOrder = function() {
            var order = $scope.data.associatedOrders[$scope.data.associatedOrderIndex];
            $scope.data.order.id = order.id;
        }
        function ChangeDetailsT() {
            var option = $scope.data.options[$scope.goodsIndex];
            // newOrder.orderItems.id = option.id;
            newOrder.orderItems.name = option.name;

            var details = [];
            for (var i = 0; i < option.childGoodsList.length; i++) {
                details.push({
                    id: '',
                    detaila: '',
                    detailb: option.childGoodsList[i].price,
                    detailc: '',
                    detaild: option.childGoodsList[i].name,
                    detaile: option.childGoodsList[i].unit,
                });
            }
            newOrder.orderItems.itemDetails = details;
        }
        // this.order.ordertime = Tools.fixJavaTime(this.order.ordertime);

        $scope.back = function() {
            if ($scope.isEdit && $scope.originalDataStr == 'xxxx') {

            } else {
                Tools.alert({
                    data: {
                        // title: '提示',
                        message: '当前页面数据未保存，若不保存并离开，请点击确认',
                    },
                    success: function() {
                        $scope.$parent.$parent.updatePageShow = false;
                        $scope.$parent.$parent.viewPageShow = false;
                        $scope.$parent.$parent.data.updatePageShow = false;
                        $scope.$parent.$parent.data.viewPageShow = false;
                        $scope.$parent.$parent.data.updatePageData = null;
                        $scope.$parent.$parent.data.editInfo = null;
                    },
                    error: function() {

                    }
                });
            }
        };
        $scope.save = function() {
            $scope.data.order.orderItems.detailSize = $scope.data.order.orderItems.itemDetails.length;
            $http.post(Setting.host + 'wujin/update', {order: $scope.data.order}).success(function(data){
                $scope.$parent.$parent.updatePageShow = false;
                $scope.$parent.$parent.viewPageShow = false;
                $scope.$parent.$parent.data.updatePageShow = false;
                $scope.$parent.$parent.data.viewPageShow = false;
                $scope.$parent.$parent.data.updatePageData = null;
                $scope.$parent.$parent.data.editInfo = null;
            }).error(function(data) {

            });
        };
        $scope.sum = function(item) {
            if(angular.isNumber(item.detaila) && angular.isNumber(item.detailb)) {
                item.detailc = item.detaila * item.detailb;
                item.detailc = item.detailc.toFixed(2) - 0;
            }
        };
        $scope.sum2 = function(order) {
            var list = order.orderItems.itemDetails;
            var sum = 0;
            for (var i = 0; i < list.length; i++) {
                if (angular.isNumber(list[i].detailc)) {
                    sum += list[i].detailc;
                }
            }
            // order.orderamount = sum.toFixed(2) - 0;
            order.orderItems.totalmoney = sum.toFixed(2) - 0;
        };
    }

})();

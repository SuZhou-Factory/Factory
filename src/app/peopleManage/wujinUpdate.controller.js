(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('WujinUpdateController', WujinUpdateController);

    /** @ngInject */
    function WujinUpdateController($scope, $http, $state, DataService, Tools) {
        var newOrder = {
            id: '',
            orderamount: '',
            orderItems: {
                id: '',
                name: '',
                count: '',
                price: '',
                totalmoney: '',
                note: '',
                unit: '',
                detailSize: '',
                itemDetails: [{
                    id: '',
                    detaila: '',
                    detailb: '',
                    detailc: '',
                    detaild: '',
                    detaileb: ''
                }, {
                    id: '',
                    detaila: '',
                    detailb: '',
                    detailc: '',
                    detaild: '',
                    detaileb: ''
                }]
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
                    goodstype: '-4',
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
                $scope.data.options = [];
                for (var i = 0; i < data.goods.length; i++) {
                    $scope.data.options.push({
                        key: data.goods[i].id,
                        value: data.goods[i].name,
                        details: data.goods[i].childGoodsList,
                    });
                };
            }).error(function(data) {

            });
        }
        getSelectOption();

        function ChangeDetailsT(option) {
            newOrder.orderItems.id = options.id;
            newOrder.orderItems.name = options.name;

            var details = [];
            for (var i = 0; i < option.details.length; i++) {
                details.push({
                    id: '',
                    detaila: '',
                    detailb: option.details[i].price,
                    detailc: '',
                    detaild: option.details[i].name,
                    detaile: option.details[i].unit,
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
    }

})();

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('WujinMainController', WujinMainController);

    /** @ngInject */
    function WujinMainController($scope, $state, $modal, Http, DataService, Tools) {
        $scope.tableHead = ['时间', '姓名', '产品名称', '金额', '详情', '操作'];

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
                startTime: '',
                endTime: ''
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            Http.post('wujin/index', $scope.searchInfo).success(function(data) {
                if (data.orders && !(data.orders instanceof Array)) {
                    data.orders = [data.orders];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
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
        $scope.edit = function() {
            var editInfo = Tools.clone(this.$parent.order);
            editInfo.ordertime = Tools.fixJavaTime(editInfo.ordertime);
            editInfo.orderItems = Tools.clone(this.item);
            $scope.$parent.$parent.data.editInfo = editInfo;
            $scope.$parent.$parent.updatePageShow = true;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.updatePageShow = true;
            $scope.$parent.$parent.data.viewPageShow = false;
        };
        $scope.delete = function() {
            var that = this;
            Tools.alert({
                data: {
                    message: '确认删除？',
                },
                success: function() {
                    var info = {
                        order: {
                            // orderId: order.id,
                            itemId: that.item.id,
                        }
                    };
                    Http.post('wujin/delete', info).success(function(data) {
                        $scope.search();
                    });
                }
            });
        }
        $scope.view = function() {
            $scope.$parent.$parent.data.viewOrder = {
                id: this.item.id,
                peoplename: this.order.peoplename,
                ordertime: this.order.ordertime
            };
            $scope.$parent.$parent.updatePageShow = false;
            $scope.$parent.$parent.viewPageShow = true;
            $scope.$parent.$parent.data.updatePageShow = false;
            $scope.$parent.$parent.data.viewPageShow = true;
        };
    }
})();

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('OrderController', OrderController)
        .controller('OrderModalController', OrderModalController);

    /** @ngInject */
    function OrderController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.orderHead = ['时间', '名称', '产品', '金额', '状态', '明细', '操作'];

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
            	pageSize: 10,
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'order/index', $scope.searchInfo).success(function(data){
                if (data.orders && !(data.orders instanceof Array)) {
                    data.orders = [data.orders];
                }
                $scope.data = data;
            }).error(function(data) {

            });
        };

        // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        $scope.data = DataService.fetch($state.current.name);
        if (_.isEmpty($scope.data)) {
            $scope.search(function() {
                DataService.mount($state.current.name, $scope.data);
            });
        }

        // -- 页面相关数据以及控制
        $scope.add = function() {
            var addorder = {
                id: '',
                name: '',
                price: '',
                ordertype: '0'
            };
            var modal = {
                title: '添加材料',
                order: addorder,
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
 		$scope.edit = function() {
            var modal = {
                title: '修改材料',
                order: Tools.clone(this.order),
            };

            openModal(modal, function(data) {
                $scope.search(); // 刷新页面
            }, function(data) {

            });
 		};

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/peopleManage/order-modal.html',
                controller: 'GoodsModalController',
                backdrop: 'static',
                windowClass: 'backend-modal',
                resolve: {
                    modal: function() {
                        return data;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                if (success) {
                    success(data);
                }
            }, function(data) {
                if (error) {
                    error(data);
                }
            });
        }
    }

    function OrderModalController($scope, $modalInstance, $http, $timeout, modal) {
        $timeout(function() {
            $('#orderModalForm').validate({
                errorLabelContainer: $(".validate-msg"),
                focusCleanup: true,
                errorClass: 'invalid',
                rules: {
                    name: {
                        required: true,
                    },
                    ordertype: {
                        required: true,
                    },
                },
                messages: {
                    name: {
                        required: "请输入材料名称",
                    },
                    ordertype: {
                        required: "请选择材料类型",
                    },
                }
            });

        }, 10);

        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;

        $scope.ok = function() {
            if (!$('#orderModalForm').valid()) {
                return;
            }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            
            update({order: modal.order}, function (data) {
                if (data.result.code == '000000') {
                    $scope.msg.success = true;
                    $scope.msg.message = $scope.modal.title + data.result.message;

                    $modalInstance.close();
                } else {
                    $scope.msg.success = false;
                    $scope.msg.message = data.result.message;
                }
            }, function (data) {
                $scope.msg.success = false;
                $scope.msg.message = '网络异常，' + $scope.modal.title + '失败';
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        function update(updateInfo, success, error) {
            $http.post(Setting.host + 'order/update', updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }

    }
})();

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('GoodsController', GoodsController)
        .controller('GoodsModalController', GoodsModalController);

    /** @ngInject */
    function GoodsController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.goodsHead = ['名称', '价格', '类型', '操作'];

        // -- 网络请求相关定义
        $scope.searchInfo = {
            goods: {
                name: '',
                goodstype: ''
            },
            page: {
            	pageNo: 1,
            	pageSize: 10,
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'goods/index', $scope.searchInfo).success(function(data){
                if (data.goods && !(data.goods instanceof Array)) {
                    data.goods = [data.goods];
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
            var addgoods = {
                id: '',
                name: '',
                price: '',
                goodstype: '0',
                unit: '',
                note: [],
            };
            var modal = {
                title: '添加材料',
                goods: addgoods,
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
                goods: Tools.clone(this.goods),
            };

            openModal(modal, function(data) {
                $scope.search(); // 刷新页面
            }, function(data) {

            });
 		};

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/peopleManage/goods-modal.html',
                controller: 'GoodsModalController',
                backdrop: 'static',
                windowClass: 'goods-modal',
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

    function GoodsModalController($scope, $modalInstance, $http, $timeout, modal) {
        $timeout(function() {
            $('#goodsModalForm').validate({
                errorLabelContainer: $(".validate-msg"),
                focusCleanup: true,
                errorClass: 'invalid',
                rules: {
                    name: {
                        required: true,
                    },
                    goodstype: {
                        required: true,
                    },
                },
                messages: {
                    name: {
                        required: "请输入材料名称",
                    },
                    goodstype: {
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

        if (modal.goods.note && modal.goods.note.length && modal.goods.note.length > 0) {
            modal.goods.note = modal.goods.note.split('&');
        }
        $scope.ok = function() {
            if (!$('#goodsModalForm').valid()) {
                return;
            }
            if (modal.goods.note) {
                modal.goods.note = modal.goods.note.join('&');
            }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            
            update({goods: modal.goods}, function (data) {
                if (data.result.code == '000000') {
                    $scope.msg.success = true;
                    $scope.msg.message = $scope.modal.title + data.result.message;

                    $modalInstance.close();
                } else {
                    modal.goods.note = modal.goods.note.split('&');
                    $scope.msg.success = false;
                    $scope.msg.message = data.result.message;
                }
            }, function (data) {
                modal.goods.note = modal.goods.note.split('&');
                $scope.msg.success = false;
                $scope.msg.message = '网络异常，' + $scope.modal.title + '失败';
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        function update(updateInfo, success, error) {
            $http.post(Setting.host + 'goods/update', updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }

    }
})();

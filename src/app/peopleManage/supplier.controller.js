(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('SupplierController', SupplierController)
        .controller('SupplierModalController', SupplierModalController);

    /** @ngInject */
    function SupplierController($scope, $state, $modal, Http, DataService, Tools) {
        $scope.supplierHead = ['供应商', '材料', '操作'];
        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };
        // -- 网络请求相关定义
        $scope.searchInfo = {
            supplier: {
                name: '',
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            Http.post('supplier/index', $scope.searchInfo).success(function(data){
                if (data.suppliers && !(data.suppliers instanceof Array)) {
                    data.suppliers = [data.suppliers];
                }
                if (data.goods && !(data.goods instanceof Array)) {
                    data.goods = [data.goods];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
                buildGoodsText(data);
            });
        };

        function buildGoodsText(data) {
            if (data.suppliers) {
                for (var i = 0; i < data.suppliers.length; i++) {
                var sup = data.suppliers[i];
                var list = sup.supplierGoods.split('-');
                sup.goods = '';
                for (var j = 0; j < data.goods.length; j++) {
                    if (_.indexOf(list, data.goods[j].id+'') != -1) {
                        sup.goods += data.goods[j].name + '、';
                    }
                }
                sup.goods = sup.goods.substr(0, sup.goods.length-1);
            }
            };
            
        }

        // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        $scope.data = DataService.fetch($state.current.name);
        if (_.isEmpty($scope.data)) {
            $scope.search(function() {
                DataService.mount($state.current.name, $scope.data);
            });
        }

        // -- 页面相关数据以及控制
        $scope.tree = Tools.clone($scope.$parent.menus);
        $scope.add = function() {
            var addSupplier = {
                id: '',
                username: '',
                name: '',
                supplierGoods: '',
                password: '',
            };

            var modal = {
                title: '添加供应商',
                supplier: addSupplier,
                tree: Tools.clone($scope.data.goods)
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
 		$scope.edit = function() {
            var modal = {
                title: '修改',
                supplier: Tools.clone(this.supplier),
                tree: Tools.clone($scope.data.goods)
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
 		};

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/peopleManage/supplier-modal.html',
                controller: 'SupplierModalController',
                backdrop: 'static',
                // windowClass: 'role-modal',
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

    function SupplierModalController($scope, $modalInstance, Http, $timeout, modal) {
        $timeout(function() {
            $('#supplierModalForm').validate({
                rules: {
                    name: {
                        required: true,
                    }
                },
                messages: {
                    name: {
                        required: "请输入名称",
                    }
                }
            });
        }, 10);

        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;

        $scope.ok = function() {
            if (!$('#supplierModalForm').valid()) {
                return;
            }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            modal.supplier.supplierGoods = '';
            $scope.getRightListStr(modal.tree, modal.supplier);
            modal.supplier.supplierGoods = modal.supplier.supplierGoods.substr(0, modal.supplier.supplierGoods.length-1);

            Http.post('supplier/update', {supplier: modal.supplier}).success(function(data) {
                if (data.result.code == '000000') {
                    $scope.msg.success = true;
                    $scope.msg.message = $scope.modal.title + data.result.message;
                    $modalInstance.close();
                } else {
                    $scope.msg.success = false;
                    $scope.msg.message = data.result.message;
                }
            }, true).error(function(data) {
                $scope.msg.success = false;
                $scope.msg.message = '网络异常，' + $scope.modal.title + '失败';
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        this.fillBackRight = function(goods, arr) {
            for (var index in goods) {
                if (_.indexOf(arr, goods[index].id+'') != -1) {
                    goods[index].selected = true;
                }
            }
        };
        if (modal.supplier.supplierGoods) {
            this.fillBackRight(modal.tree, modal.supplier.supplierGoods.split('-'));
        }

        $scope.getRightListStr = function(nodes, obj) {
            if (nodes === undefined) {
                return;
            }
            if (!obj.supplierGoods) {
                obj.supplierGoods = '';
            }
            obj.supplierGoods = '';
            for (var index in nodes) {
                if (nodes[index].selected) {
                    obj.supplierGoods += nodes[index].id + '-';
                }

                if (nodes[index].children !== undefined) {
                    $scope.getRightListStr(nodes[index].children, obj);
                }
            }
        };

    }
})();

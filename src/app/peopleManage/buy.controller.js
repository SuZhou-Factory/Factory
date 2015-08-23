(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BuyController', BuyController)
        .controller('BuyModalController', BuyModalController);

    /** @ngInject */
    function BuyController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.buyHead = ['时间', '供应商', '材料', '数量', '金额（元）', '是否付款', '备注', '操作'];

        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
            console.log(pageNo);
        };

        // -- 网络请求相关定义
        $scope.searchInfo = {
            buy: {
                supplierName: '',
                startTime: '',
                endTime: '',
            },
            page: {
                pageNo: 1,
                pageSize: 10,
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'buy/index', $scope.searchInfo).success(function(data){
                if (data.buys && !(data.buys instanceof Array)) {
                    data.buys = [data.buys];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
                getSupplierInfo();
            }).error(function(data) {

            });
        };

        function getSupplierInfo() {
            var info = {
                supplier: {
                    name: '',
                },
                page: {
                    pageNo: 1,
                    pageSize: 100000,
                }
            };
            $http.post(Setting.host + 'supplier/index', info).success(function(data){
                if (data.suppliers && !(data.suppliers instanceof Array)) {
                    data.suppliers = [data.suppliers];
                }
                if (data.goods && !(data.goods instanceof Array)) {
                    data.goods = [data.goods];
                }
                $scope.supplierInfo = data;
                injectSupplierInfo();
            }).error(function(data) {

            });
        }
        function injectSupplierInfo() {
            var sups = $scope.supplierInfo.suppliers;
            for (var i = 0; i < $scope.data.buys.length; i++) {
                for (var j = 0; j < sups.length; j++) {
                    if (sups[i].id == $scope.data.buys[i].supplierid) {
                        $scope.data.buys[i].supplierName = sups[i].name;
                    }
                }
            }
        }

        // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        $scope.data = DataService.fetch($state.current.name);
        if (_.isEmpty($scope.data)) {
            $scope.search(function() {
                DataService.mount($state.current.name, $scope.data);
            });
        }

        // -- 页面相关数据以及控制
        $scope.add = function() {
            var addBuy = {
                supplierid: '',
                goodsname: '',
                count: '',
                totalmoney: '',
                ispaid: 0,
                note: ''
            };
            var modal = {
                title: '添加客户',
                buy: addBuy,
                templateUrl: 'app/peopleManage/buy-add-modal.html',
                supplierInfo: $scope.supplierInfo
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
 		$scope.edit = function() {
            var modal = {
                title: '编辑客户',
                buy: Tools.clone(this.buy),
                templateUrl: 'app/peopleManage/buy-edit-modal.html',
            };

            openModal(modal, function(data) {
                $scope.search(); // 刷新页面
            }, function(data) {

            });
 		};
        $scope.delete = function() {
            var deleteInfo = {
                buy: {
                    id: this.buy.id
                }
            };

            $http.post(Setting.host + 'buy/delete', deleteInfo).success(function(data) {
                if (data.result.code = "000000") {
                    $scope.msg.success = true;
                    $scope.msg.message = data.result.message;
                    //刷新页面
                    $scope.search();
                } else {
                    $scope.msg.success = false;
                    $scope.msg.message = data.result.message;
                }
            }).error(function(data) {
                $scope.msg.success = false;
                $scope.msg.message = "网络异常，修改失败";
            });
        };

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: data.templateUrl,
                controller: 'BuyModalController',
                backdrop: 'static',
                windowClass: 'buy-modal',
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

    function BuyModalController($scope, $modalInstance, $http, $timeout, modal, Tools) {
        $timeout(function() {
            // $('#roleModalForm').validate({
            //     rules: {
            //         rightname: {
            //             required: true,
            //         }
            //     },
            //     messages: {
            //         rightname: {
            //             required: "请输入用户名",
            //         }
            //     }
            // });

        }, 10);

        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;

        $scope.ok = function() {
            // if (!$('#roleModalForm').valid()) {
            //     return;
            // }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            
            update({client: modal.client}, function (data) {
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

        $scope.addBuy = Tools.clone($scope.modal.buy);
        $scope.addBuys = [];
        $scope.add = function() {
            $scope.addBuys.push($scope.addBuy);
            $scope.addBuy = Tools.clone($scope.modal.buy);
        };
        $scope.supplierChange = function(buy) {
            buy.supplier = '';
            var sups = $scope.modal.supplierInfo.suppliers;
            for (var i = 0; i < sups.length; i++) {
                if (sups[i].id == buy.supplierid) {
                    buy.supplier = sups[i];
                }
            }
        };
        function update(updateInfo, success, error) {
            $http.post(Setting.host + 'buy/update', updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }

    }
})();

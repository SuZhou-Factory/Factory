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
        };

        // -- 网络请求相关定义
        $scope.searchInfo = {
            buy: {
                supplierName: '',
                startTime: '',
                endTime: '',
                ispaid: ''
            },
            page: {
                pageNo: 1,
                pageSize: 15,
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
            if (!$scope.data.buys 
                || !$scope.data.buys.length 
                || !$scope.supplierInfo.suppliers 
                || !$scope.supplierInfo.suppliers.length) {
                return;
            }
            var sups = $scope.supplierInfo.suppliers;
            for (var i = 0; i < $scope.data.buys.length; i++) {
                for (var j = 0; j < sups.length; j++) {
                    if (sups[j].id == $scope.data.buys[i].supplierid) {
                        $scope.data.buys[i].supplierName = sups[j].name;
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
                totalmoney: 0,
                ispaid: 0,
                time: new Date(),
                note: ''
            };
            var modal = {
                title: '添加进货清单',
                buy: addBuy,
                templateUrl: 'app/peopleManage/buy-add-modal.html',
                supplierInfo: $scope.supplierInfo,
                dateOptions: $scope.dateOptions
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
 		$scope.edit = function() {
            this.buy.time = Tools.fixJavaTime(this.buy.time);
            var modal = {
                title: '修改清单',
                buy: Tools.clone(this.buy),
                templateUrl: 'app/peopleManage/buy-edit-modal.html',
                supplierInfo: $scope.supplierInfo,
                dateOptions: $scope.dateOptions
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

            Tools.alert({
                data: {
                    // title: '提示',
                    message: '确认删除?'
                },
                success: function() {
                    $http.post(Setting.host + 'buy/delete', deleteInfo).success(function(data) {
                        if (data.result.code = "000000") {
                            // Tools.alert({
                            //     data: {
                            //         message: '删除成功',
                            //         noCancel: true,
                            //         noOk: true,
                            //     }
                            // });
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
                }
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
        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;
        $scope.clearError = function() {
            $scope.msg = {
                message: '',
                success: true
            };
            for (var i = 0; i < $scope.addBuys.length; i++) {
                $scope.addBuys[i].totalmoneyError = false;
                $scope.addBuys[i].supplieridError = false;
            }
        };
        $scope.ok = function() {
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            var editInfo =  Tools.clone(modal.buy);
            delete editInfo.createtime;
            delete editInfo.edittime;
            delete editInfo.factoryid;
            delete editInfo.editable;
            delete editInfo.supplier;

            update('buy/edit', {buy: editInfo}, function (data) {
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

        $scope.commit = function() {
            if ($scope.addBuys.length > 0 && $scope.addBuys[$scope.addBuys.length-1].supplierid == '') {
                $scope.addBuys[$scope.addBuys.length-1].supplieridError = true;
                $scope.msg.success = false;
                $scope.msg.message = '请选择供应商';
                return;
            }
            if ($scope.addBuys.length == 0) {
                $scope.msg.success = false;
                $scope.msg.message = '请添加清单';
                return;
            }
            var error = false;
            for (var i = 0; i < $scope.addBuys.length; i++) {
                if ($scope.addBuys[i].totalmoney == 0) {
                    $scope.addBuys[i].totalmoneyError = true;
                    error = true;
                }
            }
            if (error) {
                Tools.alert({
                    data: {
                        message: '存在金额为0的项，是否保存？'
                    },
                    success: function() {
                        exeCommit();
                    },
                    error: function() {
                        return;
                    }
                });
            } else {
                exeCommit();
            }

        };
        function exeCommit() {
            for (var i = 0; i < $scope.addBuys.length; i++) {
                $scope.addBuys[i].time = $scope.addBuys[i].time.toString();
                delete $scope.addBuys[i].supplier;
                delete $scope.addBuys[i].supplierName;
                delete $scope.addBuys[i].supplieridError;
                delete $scope.addBuys[i].totalmoneyError;
            }
            update('buy/new', {buy: $scope.addBuys, total: {totalNum: $scope.addBuys.length}}, function (data) {
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
        }

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        $scope.addBuys = [];
        $scope.addBuys.push(Tools.clone($scope.modal.buy));
        $scope.add = function($event) {
            if ($scope.addBuys.length > 0 && $scope.addBuys[$scope.addBuys.length-1].supplierid == '') {
                $scope.addBuys[$scope.addBuys.length-1].supplieridError = true;
                $scope.msg.success = false;
                $scope.msg.message = '请选择供应商';
                return;
            }
            $scope.addBuys.push(Tools.clone($scope.modal.buy));
            setTimeout(function() {
                $(".table-content").scrollTop($(".buy-modal table").height());
            }, 10);
        };
        $scope.delete = function() {
            $scope.addBuys = _.without($scope.addBuys, this.buy);
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

        function update(url, updateInfo, success, error) {
            $http.post(Setting.host + url, updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }


    }
})();

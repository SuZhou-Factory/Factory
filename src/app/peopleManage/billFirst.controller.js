(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BillFirstController', BillFirstController)
        .controller('BillFirstModalController', BillFirstModalController);

    /** @ngInject */
    function BillFirstController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.tableHead = ['日期', '名称', '名称类型', '总计金额（元）', '实付金额（元）', '欠款金额（元）', '操作'];

        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };

        // -- 网络请求相关定义
        $scope.searchInfo = {
            bill: {
                name: '',
                billendtime: ''
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'billFirst/index', $scope.searchInfo).success(function(data){
                if (data.bills && !(data.bills instanceof Array)) {
                    data.bills = [data.bills];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
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
            var addBill = {
                id: '',
                name: '',
                billendtime: '',
                peopletype: '',
                totlemoney: '',
                paidmoney: '',
                unpaidmoney: ''
            }

            var modal = {
                title: '添加首次账单',
                bill: addBill,
                templateUrl: 'app/peopleManage/billFirst-modal.html',
                dateOptions: $scope.dateOptions
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
 		$scope.edit = function() {
            this.bill.billendtime = Tools.fixJavaTime(this.bill.billendtime);
            var modal = {
                title: '修改首次账单',
                bill: Tools.clone(this.bill),
                templateUrl: 'app/peopleManage/billFirst-modal.html',
                dateOptions: $scope.dateOptions
            };

            openModal(modal, function(data) {
                $scope.search(); // 刷新页面
            }, function(data) {

            });
 		};

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: data.templateUrl,
                controller: 'BillFirstModalController',
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

    function BillFirstModalController($scope, $modalInstance, $http, $timeout, modal, Tools) {
        $timeout(function() {
            // $('#billFirstModalForm').validate({
            //     errorLabelContainer: $(".validate-msg"),
            //     focusCleanup: true,
            //     errorClass: 'invalid',
            //     rules: {
            //         name: {
            //             required: true,
            //         },
            //         billtype: {
            //             required: true,
            //         },
            //     },
            //     messages: {
            //         name: {
            //             required: "请输入材料名称",
            //         },
            //         billtype: {
            //             required: "请选择材料类型",
            //         },
            //     }
            // });

        }, 10);

        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;

        $scope.ok = function() {
            // if (!$('#billModalForm').valid()) {
            //     return;
            // }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            
            update({bill: modal.bill}, function (data) {
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
            $http.post(Setting.host + 'billFirst/update', updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }


    }
})();

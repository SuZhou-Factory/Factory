(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('MoneyController', MoneyController)
        .controller('MoneyModalController', MoneyModalController);

    /** @ngInject */
    function MoneyController($scope, $state, $modal, Http, Tools) {
        var route = $state.current.name.split('.')[1];

        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
        	$scope.searchInfo.page.pageNo = pageNo;
        	$scope.search();
        };

        $scope.moneyInHead = ['时间', '姓名', '金额', '进账方式', '用途', '备注', '操作'];
        $scope.moneyOutHead = ['时间', '姓名', '金额', '出账方式', '用途', '备注', '操作'];

        $scope.searchInfo = {
            money: {
                name: '',
            	moneytype: '',
                startTime: '',
                endTime: ''
            },
            page: {
            	pageNo: 1,
            	pageSize: 15,
            }
        };

        $scope.search = function() {
            $scope.msg = {
                message: '',
                success: true
            };
            Http.post(route + '/index', $scope.searchInfo).success(function(data) {
                if (data.moneys && !(data.moneys instanceof Array)) {
                    data.moneys = [data.moneys];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            });
        };

        $scope.edit = function() {
            this.money.time = Tools.fixJavaTime(this.money.time);
            var modal = {
                title: '修改',
                money: Tools.clone(this.money),
                tree: $scope.tree,
                roles: $scope.roles,
                dateOptions: $scope.$parent.dateOptions,
                route: route
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };

        $scope.add = function() {
            var addMoney = {
                id: '',
            	name: '',
            	money: '',
                paymethod: '',
                reason: '',
                note: '',
                time: '',
            };

            var modal = {
                title: '添加',
                money: addMoney,
                tree: $scope.tree,
                roles: $scope.roles,
                dateOptions: $scope.$parent.dateOptions,
                route: route
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };

        //刷新页面
        $scope.search();


        $scope.delete = function() {
            var deleteInfo = {
                money: {
                    id: this.money.id
                }
            };
            Tools.alert({
                data: {
                    // title: '提示',
                    message: '确认删除?'
                },
                success: function() {
                    Http.post(route + '/delete', deleteInfo).success(function(data) {
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
                        $scope.msg.message = "网络异常，删除失败";
                    });
                }
            });


        };

        function getRolesName() {
            Http.get('backend/listRoles').success(function(data) {
                if (data.roles && !(data.roles instanceof Array)) {
                    data.roles = [data.roles];
                }
                $scope.roles = data.roles;
            });
        }
		getRolesName();
        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/peopleManage/money-modal.html',
                controller: 'MoneyModalController',
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

    function MoneyModalController($scope, $modalInstance, Http, $timeout, modal) {
        $timeout(function() {
            $('#moneyModalForm').validate({
                errorLabelContainer: $(".validate-msg"),
                focusCleanup: true,
                errorClass: 'invalid',
                rules: {
                    name: {
                        required: true,
                        minlength: 1,
                    },
                    money: {
                        required: true,
                        minlength: 1,
                    },
                    time: {
                        required: true,
                        minlength: 1,
                    },
                },
                messages: {
                    name: {
                        required: '请输入姓名',
                    },
                    money: {
                        required: '请输入用金额',
                    },
                    time: {
                        required: '请输入时间',
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
            if (!$('#moneyModalForm').valid()) {
                return;
            }
            
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
           	if (!_.isString($scope.modal.money.time)) {
           		$scope.modal.money.time = $scope.modal.money.time.toString();
           	}

            Http.post(modal.route + '/update', {money: modal.money}).success(function(data) {
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
    }
})();

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BackendController', BackendController)
        .controller('BackendModalController', BackendModalController);

    /** @ngInject */
    function BackendController($scope, $modal, Http, Tools) {
        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
        	$scope.searchInfo.page.pageNo = pageNo;
        	$scope.search();
        };

        $scope.tableHead = ['姓名', '用户名', '工厂名', '截止时间', '操作'];
        $scope.searchInfo = {
            user: {
            	username: '',
                name: '',
                factoryname: '',
                startDeadtime: '',
                endDeadtime: ''
            },
            page: {
            	pageNo: 1,
            	pageSize: 15,
            }
        };

        $scope.search = function() {
            Http.post('backend/index', $scope.searchInfo).success(function(data) {
                if (data.users && !(data.users instanceof Array)) {
                    data.users = [data.users];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            });
        };

        $scope.edit = function() {
            this.user.deadtime = Tools.fixJavaTime(this.user.deadtime);
            var modal = {
                title: '修改人员',
                user: Tools.clone(this.user),
                tree: $scope.tree,
                roles: $scope.roles,
                dateOptions: $scope.dateOptions,
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };

        $scope.add = function() {
            var addUser = {
                id: '',
            	username: '',
            	password: '',
                name: '',
                factoryname: '',
                deadtime: '',
                roleid: '',
            };

            var modal = {
                title: '添加人员',
                user: addUser,
                tree: $scope.tree,
                roles: $scope.roles,
                dateOptions: $scope.dateOptions,
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };

        $scope.delete = function() {
            var deleteInfo = {
                user: {
                    id: this.user.id
                }
            };
            Tools.alert({
                data: {
                    message: '确认删除用户名为 '+this.user.username+' 的人员?'
                },
                success: function() {
                    Http.post('backend/delete', deleteInfo).success(function(data) {
                        $scope.search(); //刷新页面
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
                //刷新页面
                $scope.search();
            });
        }
		getRolesName();
        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/backend-modal.html',
                controller: 'BackendModalController',
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

    function BackendModalController($scope, $modalInstance, Http, $timeout, modal) {
        $timeout(function() {
            $('#backendModalForm').validate({
                errorLabelContainer: $(".validate-msg"),
                focusCleanup: true,
                errorClass: 'invalid',
                rules: {
                    username: {
                        required: true,
                        minlength: 1,
                    },
                    password: {
                        required: modal.title=='添加'?true:false,
                        minlength: 1,
                    },
                    name: {
                        required: true,
                        minlength: 1,
                    },
                    factoryname: {
                        required: true,
                        minlength: 1,
                    },
                    deadtime: {
                        required: true,
                    },
                    roleid: {
                        required: true,
                        minlength: 1,
                    },
                },
                messages: {
                    username: {
                        required: '请输入用户名',
                    },
                    password: {
                        required: '请输入密码',
                    },
                    name: {
                        required: '请输入姓名',
                    },
                    factoryname: {
                        required: '请输入工厂名',
                    },
                    deadtime: {
                        required: '请输入截止时间',
                    },
                    roleid: {
                        required: '请选择角色',
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
            if (!$('#backendModalForm').valid()) {
                return;
            }
            
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
           	if (!_.isString($scope.modal.user.deadtime)) {
           		$scope.modal.user.deadtime = $scope.modal.user.deadtime.toString();
           	}

            Http.post('backend/update', {user: modal.user}).success(function(data) {
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

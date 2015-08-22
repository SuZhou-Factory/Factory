(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BackendController', BackendController)
        .controller('BackendModalController', BackendModalController);

    /** @ngInject */
    function BackendController($scope, $http, $modal, Tools) {
        $scope.maxSize = 5;

        $scope.setPage = function(pageNo) {
        	$scope.searchInfo.page.pageNo = pageNo;
        	$scope.search();
        	console.log(pageNo);
        };
        $scope.dateOptions = {
	        changeYear: true,
	        changeMonth: true,
	        yearRange: '1900:+100',
	        dateFormat: 'yy-mm-dd',
	        prevText: '<',
	        nextText: '>',
	        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
	        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
	        dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
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
            	pageSize: 10,
            }
        };

        $scope.search = function() {
            $scope.msg = {
                message: '',
                success: true
            };
            $http.post(Setting.host + 'backend/index', $scope.searchInfo).success(function(data) {
                if (data.users && !(data.users instanceof Array)) {
                    data.users = [data.users];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {
                if (TestData.debug) {
                    $scope.data = TestData.right.index;
                }
            });
        };


        $scope.edit = function() {
            var modal = {
                title: '编辑人员',
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

        //刷新页面
        $scope.search();


        $scope.delete = function() {
            var deleteInfo = {
                user: {
                    id: this.user.id
                }
            };
            Tools.alert({
                data: {
                    // title: '提示',
                    message: '确认删除用户名为 '+this.user.username+' 的人员?'
                },
                success: function() {
                    $http.post(Setting.host + 'backend/delete', deleteInfo).success(function(data) {
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
                }
            });


        };

        function getRolesName() {
            $http.get(Setting.host + 'backend/listRoles').success(function(data) {
                if (data.roles && !(data.roles instanceof Array)) {
                    data.roles = [data.roles];
                }
                $scope.roles = data.roles;
            }).error(function(data) {

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

    function BackendModalController($scope, $modalInstance, $http, $timeout, modal) {
        $timeout(function() {
            $('#backendModalForm').validate({
                debug: true,
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
                    usernamde: {
                        required: '请输入用户名',
                        minlength: '长度必须超过两位',
                    },


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
            update({user: modal.user}, function (data) {
                if (data.result.code == '000000') {
                    $scope.msg.success = true;
                    $scope.msg.message = $scope.modal.title + data.result.message;
                    setTimeout((function(){
                        var instance = $modalInstance;
                        return function() {
                            instance.close();
                        };
                    })(), 100);
                    // $modalInstance.close();
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
            $http.post(Setting.host + 'backend/update', updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }
    }
})();

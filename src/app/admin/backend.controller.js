(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BackendController', BackendController)
        .controller('BackendModalController', BackendModalController);

    /** @ngInject */
    function BackendController($scope, $http, $modal, Tools) {
        $scope.totalItems = 64;
        $scope.maxSize = 4;

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
                // $scope.tree = Tools.clone($scope.data).rights;
                // $scope.tree = Tools.transtoTree($scope.tree);
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {
                if (TestData.debug) {
                    $scope.data = TestData.right.index;
                }
            });
        };


        $scope.edit = function() {
            var modal = {
                title: '编辑',
                user: this.user,
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
                userid: '',
            	username: '',
            	password: '',
                name: '',
                factoryname: '',
                deadtime: '',
                roleid: '',
            };

            var modal = {
                title: '添加',
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
                right: {
                    id: this.right.id
                }
            };

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
        };

        function getRolesName() {
            $http.get(Setting.host + 'backend/listRoles').success(function(data) {
                if (data.roles && !(data.roles instanceof Array)) {
                    data.roles = [data.roles];
                }
                $scope.roles = data.roles;
            }).error(function(data) {
                if (TestData.debug) {
                    // $scope.roles = TestData.right.index;
                }
            });
        }
		getRolesName();
        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/backend-modal.html',
                controller: 'BackendModalController',
                backdrop: false,
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

    function BackendModalController($scope, $modalInstance, $http, modal) {
        $('#backendModalForm').validate({
            rules: {

             //    userid: '',
            	// username: '',
            	// password: '',
             //    name: '',
             //    factoryname: '',
             //    deadtime: '',
             //    roleid: '',

                username: {
                    required: true,
                },
                password: {
                    required: true,
                },
                name: {
                    required: true,
                },
                factoryname: {
                    required: true,
                },
                deadtime: {
                    required: true,
                },
                roleid: {
                    required: true,
                },
            },
            messages: {
                rightname: {
                    required: "请输入用户名",
                    minlength: "用户名太短，必须两位以上"
                }
            }
        });
        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;

        // $scope.modal.user.deadtime = Date.parse($scope.modal.user.deadtime);
        $scope.ok = function() {
            // if (!$('#modalForm').valid()) {
            //     return;
            // }
            
            // $scope.modal.user.deadtime = Date.parse($scope.modal.user.deadtime);
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
           	
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

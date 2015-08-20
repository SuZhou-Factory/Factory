(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('RoleController', RoleController)
        .controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {});
        

    /** @ngInject */
    function RoleController($scope, $http, $modal, $log) {
            $scope.totalItems = 64;
            $scope.currentPage = 4;
            $scope.maxSize = 5;

            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.bigTotalItems = 175;
            $scope.bigCurrentPage = 1;
            
            $scope.tableHead = ['角色名', '操作'];

		$scope.searchInfo = {
            role: {
                name: ''
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
            $http.post(Setting.host + 'role/index', $scope.searchInfo).success(function(data) {
                if (data.roles && !(data.roles instanceof Array)) {
                    data.roles = [data.roles];
                }
                if (data.allRight && !(data.allRight instanceof Array)) {
                    data.allRight = [data.allRight];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {});
        };
        
        
        //刷新页面
        $scope.search();
        
        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/role-modal.html',
                controller: 'RoleModalController',
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
        
        
        
    }


	function BackendModalController($scope, $modalInstance, $http, modal) {
        $('#backendModalForm').validate({
            rules: {
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
                username: {
                    required: "请输入用户名",
                }
            }
        });
        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;

        $scope.ok = function() {
            // if (!$('#modalForm').valid()) {
            //     return;
            // }
            
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

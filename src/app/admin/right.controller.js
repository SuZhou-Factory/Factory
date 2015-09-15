(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('RightController', RightController)
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    /** @ngInject */
    function RightController($scope, $modal, Http, Tools) {
        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
        	$scope.searchInfo.page.pageNo = pageNo;
        	$scope.search();
        };
        
        $scope.tableHead = ['名称', 'value值', '父名称', '操作'];
        $scope.searchInfo = {
            right: {
                name: '',
                value: ''
            },
            page: {
            	pageNo: 1,
            	pageSize: 15,
            }
        };

        $scope.search = function() {
            Http.post('right/index', $scope.searchInfo).success(function(data) {
                if (data.rights && !(data.rights instanceof Array)) {
                    data.rights = [data.rights];
                }
                if (data.allRights && !(data.allRights instanceof Array)) {
                    data.allRights = [data.allRights];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
                $scope.tree = Tools.clone($scope.data.allRights);
                $scope.tree = Tools.transtoTree($scope.tree);
            });
        };

        $scope.edit = function() {
            var modal = {
                title: '修改权限',
                right: Tools.clone(this.right),
                tree: Tools.clone($scope.tree)
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };

        $scope.add = function() {
            var addRight = {
                id: '',
                name: '',
                value: '',
                parentid: '',
                parentname: ''
            };

            var modal = {
                title: '添加权限',
                right: addRight,
                tree: Tools.clone($scope.tree)
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

            Tools.alert({
                data: {
                    message: '确认删除?'
                },
                success: function() {
                    Http.post('right/delete', deleteInfo).success(function(data) {
                        $scope.search(); //刷新页面
                    });
                }
            });
        };

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/right-modal.html',
                controller: 'ModalInstanceCtrl',
                backdrop: 'static',
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

    function ModalInstanceCtrl($scope, $modalInstance, $timeout, Http, modal) {
        $timeout(function() {
            $('#modalForm').validate({
                rules: {
                    rightname: {
                        required: true,
                    }
                },
                messages: {
                    rightname: {
                        required: "请输入用户名",
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
            if (!$('#modalForm').valid()) {
                return;
            }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证

            Http.post('right/update', {right: modal.right}).success(function(data) {
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

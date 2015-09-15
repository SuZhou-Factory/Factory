(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('ClientController', ClientController)
        .controller('ClientModalController', ClientModalController);

    /** @ngInject */
    function ClientController($scope, $state, $modal, Http, DataService, Tools) {
        $scope.clientHead = ['姓名', '电话号码', '操作'];
        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };
        // -- 网络请求相关定义
        $scope.searchInfo = {
            client: {
                name: '',
                mobile: '',
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            Http.post('client/index', $scope.searchInfo).success(function(data){
                if (data.clients && !(data.clients instanceof Array)) {
                    data.clients = [data.clients];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
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
            var addClient = {
                id: '',
                name: '',
                mobile: ''
            };
            var modal = {
                title: '添加客户',
                client: addClient,
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
 		$scope.edit = function() {
            var modal = {
                title: '修改客户',
                client: Tools.clone(this.client),
            };

            openModal(modal, function(data) {
                $scope.search(); // 刷新页面
            }, function(data) {

            });
 		};

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/peopleManage/client-modal.html',
                controller: 'ClientModalController',
                backdrop: 'static',
                windowClass: 'client-modal',
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

    function ClientModalController($scope, $modalInstance, Http, $timeout, modal) {
        $timeout(function() {
            $('#clientModalForm').validate({
                errorLabelContainer: $(".validate-msg"),
                focusCleanup: true,
                errorClass: 'invalid',
                rules: {
                    name: {
                        required: true,
                    }
                },
                messages: {
                    name: {
                        required: "请输入用姓名",
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
            if (!$('#clientModalForm').valid()) {
                return;
            }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证

            Http.post('client/update', {client: modal.client}).success(function(data) {
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

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('UserController', UserController)
        .controller('UserModalController', UserModalController);

    /** @ngInject */
    function UserController($scope, $state, $modal, Http, DataService, Tools) {
        $scope.userHead = ['用户名', '姓名', '操作'];

        // -- 网络请求相关定义
        $scope.searchInfo = {
            user: {
                name: '',
            }
        };
        $scope.search = function() {
            Http.post('user/index', $scope.searchInfo).success(function(data){
                if (data.users && !(data.users instanceof Array)) {
                    data.users = [data.users];
                }
                $scope.data = data;
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
        $scope.tree = Tools.clone($scope.$parent.menus);
        $scope.add = function() {
            var addUser = {
                id: '',
                username: '',
                name: '',
                userRight: '',
                password: '',
            };

            var modal = {
                title: '添加人员信息',
                user: addUser,
                tree: Tools.clone($scope.tree)
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
 		$scope.edit = function() {
            var modal = {
                title: '修改人员信息',
                user: Tools.clone(this.user),
                tree: Tools.clone($scope.tree)
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
                    Http.post('user/delete', deleteInfo).success(function(data) {
                        $scope.search(); //刷新页面
                    });
                }
            });
 		};

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/peopleManage/user-modal.html',
                controller: 'UserModalController',
                backdrop: 'static',
                // windowClass: 'role-modal',
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

    function UserModalController($scope, $modalInstance, Http, $timeout, modal) {
        $timeout(function() {
            $('#userModalForm').validate({
                errorLabelContainer: $(".validate-msg"),
                focusCleanup: true,
                errorClass: 'invalid',
                rules: {
                    username: {
                        required: true,
                    },
                },
                messages: {
                    username: {
                        required: "请输入用户名",
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
            if (!$('#userModalForm').valid()) {
                return;
            }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            modal.user.userRight = '';
            $scope.getRightListStr(modal.tree, modal.user);
            modal.user.userRight = modal.user.userRight.substr(0, modal.user.userRight.length-1);

            Http.post('user/update', {user: modal.user}).success(function(data) {
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

        // -------------------------------------------------
        this.addParent = function(nodes) {
            for (var index in nodes) {
                if (nodes[index].children && nodes[index].children.length > 0) {
                    for (var _index in nodes[index].children) {
                        nodes[index].children[_index].parent = nodes[index];
                    }
                    this.addParent(nodes[index].children);
                }
            }
        };
        this.addParent(modal.tree);


        this.fillBackRight = function(nodes, arr) {
            for (var index in nodes) {
                if (_.indexOf(arr, nodes[index].id+'') != -1) {
                    nodes[index].selected = true;
                }

                if (nodes[index].children && nodes[index].children.length > 0) {
                    this.fillBackRight(nodes[index].children, arr);
                }
            }
        };
        this.fillBackRight(modal.tree, modal.user.userRight.split('-'));

        $scope.forward = function(node, selected) {
            //上层节点被选中，下层节点全被选中
            if (node === undefined) {
                return;
            }

            for (var index in node.children) {
                node.children[index].selected = selected;

                if (node.children !== undefined) {
                    $scope.forward(node.children[index], node.children[index].selected);
                }
            }
        };

        $scope.backward = function(node, selected) {
            //下层节点被选或取消选中，修改相对应的上层节点
            if (node === undefined) {
                return;
            }
            var parent = node.parent;
            if (!parent) return
            var parentSelected = selected;

            if (selected === true) {
                parent.selected = true;
            }

            if (node.parent !== undefined) {
                $scope.backward(parent, parentSelected);
            };
        };

        $scope.getRightListStr = function(nodes, obj) {
            if (nodes === undefined) {
                return;
            }
            if (!obj.userRight) {
                obj.userRight = '';
            }

            for (var index in nodes) {
                if (nodes[index].selected) {
                    obj.userRight += nodes[index].id + '-';
                }

                if (nodes[index].children !== undefined) {
                    $scope.getRightListStr(nodes[index].children, obj);
                }
            }
        };

    }
})();

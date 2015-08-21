(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('RoleController', RoleController)
        .controller('RoleModalController', RoleModalController);
        

    /** @ngInject */
    function RoleController($scope, $http, $modal, $log, Tools) {
        $scope.maxSize = 5;

        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };
            
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
                $scope.tree = Tools.clone($scope.data.allRights);
                $scope.tree = Tools.transtoTree($scope.tree);
            }).error(function(data) {});
        };
        
        
        //刷新页面
        $scope.search();
        
        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/admin/role-modal.html',
                controller: 'RoleModalController',
                backdrop: 'static',
                windowClass: 'role-modal',
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
                title: '编辑角色',
                role: Tools.clone(this.role),
                tree: Tools.clone($scope.tree)
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
        
        
        $scope.add = function() {
            var addRole = {
                id: '',
                name: '',
                roleRight: '',
            };

            var modal = {
                title: '添加角色',
                role: addRole,
                tree: Tools.clone($scope.tree)
            };

            openModal(modal, function(data) {
                //刷新页面
                $scope.search();
            }, function(data) {

            });
        };
        
    }


    function RoleModalController($scope, $modalInstance, $http, $timeout, modal) {
        $timeout(function() {
            $('#roleModalForm').validate({
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
            if (!$('#roleModalForm').valid()) {
                return;
            }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            modal.role.roleRight = '';
            $scope.getRightListStr(modal.tree, modal.role);
            modal.role.roleRight = modal.role.roleRight.substr(0, modal.role.roleRight.length-1);
            
            update({role: modal.role}, function (data) {
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
            $http.post(Setting.host + 'role/update', updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }

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
        this.fillBackRight(modal.tree, modal.role.roleRight.split('-'));

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
            if (!obj.roleRight) {
                obj.roleRight = '';
            }

            for (var index in nodes) {
                if (nodes[index].selected) {
                    obj.roleRight += nodes[index].id + '-';
                }

                if (nodes[index].children !== undefined) {
                    $scope.getRightListStr(nodes[index].children, obj);
                }
            }
        };
    }

})();

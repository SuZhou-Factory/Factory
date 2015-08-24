(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('MoneyController', MoneyController)
        .controller('MoneyModalController', MoneyModalController);

    /** @ngInject */
    function MoneyController($scope, $http, $state, $modal, Tools) {
        var route = $state.current.name.split('.')[1];

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

        $scope.moneyInHead = ['时间', '名称', '金额', '进账方式', '用途', '备注', '操作'];
        $scope.moneyOutHead = ['时间', '名称', '金额', '出账方式', '用途', '备注', '操作'];

        $scope.searchInfo = {
            money: {
                name: '',
            	moneytype: '',
                startTime: '',
                endTime: ''
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
            $http.post(Setting.host + route + '/index', $scope.searchInfo).success(function(data) {
                if (data.moneys && !(data.moneys instanceof Array)) {
                    data.moneys = [data.moneys];
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
                title: '编辑',
                money: Tools.clone(this.money),
                tree: $scope.tree,
                roles: $scope.roles,
                dateOptions: $scope.dateOptions,
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
                dateOptions: $scope.dateOptions,
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
                    message: '确认删除用户名为 '+this.money.moneyname+' 的人员?'
                },
                success: function() {
                    $http.post(Setting.host + route + '/delete', deleteInfo).success(function(data) {
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

    function MoneyModalController($scope, $modalInstance, $http, $timeout, modal) {
        $timeout(function() {
            $('#backendModalForm').validate({
                debug: true,
                errorLabelContainer: $(".validate-msg"),
                focusCleanup: true,
                errorClass: 'invalid',
                rules: {
                    moneyname: {
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
                    moneynamde: {
                        required: '请输入用户名',
                        minlength: '长度必须超过两位',
                    },


                    moneyname: {
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
           	if (!_.isString($scope.modal.money.time)) {
           		$scope.modal.money.time = $scope.modal.money.time.toString();
           	}
            update({money: modal.money}, function (data) {
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
            $http.post(Setting.host + modal.route + '/update', updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }
    }
})();

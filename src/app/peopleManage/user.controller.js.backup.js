(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('UserController', UserController);

    /** @ngInject */
    function UserController($scope, $http, $state, DataService, Tools) {
        $scope.testt = 'Thu Jul 30 16:30:42 CST 2015';
        $scope.userHead = ['用户名', '姓名', '操作'];
    	var initData = {
 			employeeHead: ['员工编号', '姓名', '电话', '操作'],
 			employee: [{
 				id: '001',
 				name: '刘东方',
 				phone: '13125252525'
 			},{
 				id: '002',
 				name: '李四',
 				phone: '13674759754'
 			},{
 				id: '003',
 				name: '郑富贵',
 				phone: '18364445578'
 			}],
 			client: {
 				
 			},
 		};


        // -- 网络请求相关定义
        $scope.searchInfo = {
            user: {
                name: '',
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'user/index', $scope.searchInfo).success(function(data){
                if (data.rights && !(data.rights instanceof Array)) {
                    data.rights = [data.rights];
                }
                $scope.data = data;
            }).error(function(data) {
                if (TestData.debug) {
                    $scope.data = TestData.right.index;
                }
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
 		$scope.users = Tools.clone(initData);
 		$scope.edit = function() {
 			this.emp.editable = !this.emp.editable;
 		};
 		$scope.add = function() {
 			$scope.users.employee.push($scope.addEmployee);

	    	$scope.addEmployee = {
				id: '',
				name: '',
				phone: ''
	    	};
 		};
 		$scope.delete = function() {
 			$scope.users.employee = _.without($scope.users.employee, this.emp);
 		};

    	$scope.addEmployee = {
			id: '',
			name: '',
			phone: ''
    	};
    }
})();

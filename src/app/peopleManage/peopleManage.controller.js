(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('PeopleManageController', PeopleManageController);

    /** @ngInject */
    function PeopleManageController($scope, $state) {
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


 		$scope.users = _.clone(initData);
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

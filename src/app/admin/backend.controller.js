(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('BackendController', BackendController);

    /** @ngInject */
    function BackendController($scope) {
        $scope.tableHead = ['姓名', '用户名', '工厂名', '截止时间', '操作'];
		$scope.data = {
		    "users": [{
		        "factoryname": "河大",
		        "id": 3,
		        "edittime": null,
		        "username": "uty",
		        "roleid": 1,
		        "name": "明年",
		        "rights": null,
		        "deadtime": "Thu Jul 30 16:30:42 CST 2015",
		        "factoryid": 1
		    }, {
		        "factoryname": "工厂A",
		        "id": 4,
		        "edittime": null,
		        "username": "qwe1",
		        "roleid": 1,
		        "name": "张三a",
		        "rights": null,
		        "deadtime": "Wed Jul 29 17:51:21 CST 2015",
		        "factoryid": 2
		    }],
		    "totalPage": 1
		};

    }
})();

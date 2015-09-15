(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('AdminController', AdminController);

    /** @ngInject */
    function AdminController($scope, $state) {
        $scope.statename = 'admin';
        if (sessionStorage.adminuser) {
            $scope.user = JSON.parse(sessionStorage.adminuser);
        } else {
            $state.go('adminlogin');
            return;
        }

        $scope.menus = [{
            children: [{
                "id": 1,
                "name": "人员",
                "value": "backend/index",
                "parentid": 0,
                "hasRight": false,
                "parentname": null
            }, {
                "id": 2,
                "name": "角色",
                "value": "role/index",
                "parentid": 0,
                "hasRight": false,
                "parentname": null
            }, {
                "id": 3,
                "name": "权限",
                "value": "right/index",
                "parentid": 0,
                "hasRight": false,
                "parentname": null
            }]
        }];
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

        $scope.logOut = function() {
            Tools.alert({
                data: {
                    message: '确认退出？',
                },
                success: function() {
                    Http.get('user/loginOut').success(function(data) {
                        sessionStorage[$state.current.data.userText] = '';
                        $state.go('login');
                    });
                }
            });
        };
        $scope.resetPass = function() {
            var modal = {
                title: '修改密码',
                username: $scope.user.name,
            };

            openModal(modal, function(data) {
                $scope.search(); // 刷新页面
            }, function(data) {

            });
        };

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/main/main-modal.html',
                controller: 'MainModalController',
                backdrop: 'static',
                windowClass: 'pass-modal',
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
})();

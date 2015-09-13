(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('MainController', MainController);

    function MainController($rootScope, $scope, $http, $state, DataService, Tools) {
        $scope.statename = 'main';

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
        $scope.dateOptions2 = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:+0',
            maxDate: '+0d',
            dateFormat: 'yy-mm-dd',
            prevText: '<',
            nextText: '>',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        };
        if (sessionStorage.user) {
            $scope.user = JSON.parse(sessionStorage.user);
        } else {
            $state.go('login');
            return;
        }
        // $scope.menus = $scope.user.rights;
        $scope.pages = DataService.main.pages.list || {};

        $scope.closePage = function() {
            var addr = this.page.state.split('.');
            var temp = DataService;
            var pagesList = DataService[addr[0]].pages.list; 
            for (var i = 0; i < pagesList.length; i++) {
                if (pagesList[i].state == this.page.state) {
                    $scope.pages = pagesList = DataService[addr[0]].pages.list = _.without(pagesList, pagesList[i]);
                    break;
                }
            }
            if (this.page.active){
                if (pagesList.length > 0) {
                    $state.go(pagesList[pagesList.length-1].state);
                } else {
                    $state.go($scope.statename);
                }
            }
            DataService.unmout(this.page.state);
        };

        function getMenu() {
            $http.get(Setting.host + 'right/fetchRights').success(function(data) {
                if (data.rights && !(data.rights instanceof Array)) {
                    data.rights = [data.rights];
                }
                $scope.menus = Tools.transtoTree(data.rights);
                $scope.menus[0].open = true
            }).error(function(data) {
                // Tools.transtoTree(
            });
        }
        getMenu();

    }

})();

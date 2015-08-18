(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('MainController', MainController);

    function MainController($rootScope, $scope, $state, DataService) {
        $scope.statename = 'main';
        if (sessionStorage.user) {
            $scope.user = JSON.parse(sessionStorage.user);
        } else {
            $state.go('login');
            return;
        }
        $scope.menus = $scope.user.rights;
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
    }

})();

(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('NoteController', NoteController);

    /** @ngInject */
    function NoteController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.updatePageShow = false;
        // $scope.RIGHT = { 
        //     money: true,
        //     detail: true,
        // };

        // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        $scope.data = DataService.fetch($state.current.name);
        if (_.isEmpty($scope.data)) {
            $scope.data = {};
            $scope.data.updatePageShow = false;
            DataService.mount($state.current.name, $scope.data);
        } else {
            $scope.updatePageShow = $scope.data.updatePageShow;
        };



    }

})();

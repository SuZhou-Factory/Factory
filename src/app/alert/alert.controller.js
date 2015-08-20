(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('AlertController', AlertController);

    /** @ngInject */
    function AlertController($scope, $modalInstance, $http, modal) {
        $scope.modal = modal;

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };


    }
})();

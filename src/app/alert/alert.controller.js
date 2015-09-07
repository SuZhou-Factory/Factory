(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('AlertController', AlertController);

    /** @ngInject */
    function AlertController($scope, $modalInstance, $http, $timeout, modal) {
        $scope.modal = modal;
        if (modal.autoClose) {
            $timeout(function() {
                $modalInstance.close();
            }, 1000);
        }

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

    }
})();

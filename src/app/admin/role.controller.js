(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('RoleController', RoleController)
        .controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {
            $scope.totalItems = 64;
            $scope.currentPage = 4;
            $scope.maxSize = 5;

            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.bigTotalItems = 175;
            $scope.bigCurrentPage = 1;
        });

    /** @ngInject */
    function RoleController($scope, $http, $modal, $log) {
            $scope.totalItems = 64;
            $scope.currentPage = 4;
            $scope.maxSize = 5;

            $scope.setPage = function(pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.bigTotalItems = 175;
            $scope.bigCurrentPage = 1;

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.open = function() {

            var modalInstance = $modal.open({
                templateUrl: 'app/admin/modal.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }


})();

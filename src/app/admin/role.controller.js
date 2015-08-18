(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('RoleController', RoleController)
        .controller('ModalInstanceCtrl', function($scope, $modalInstance, items) {

            $scope.items = items;
            $scope.selected = {
                item: $scope.items[0]
            };

            $scope.ok = function() {
                $modalInstance.close($scope.selected.item);
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
        });

    /** @ngInject */
    function RoleController($scope, $http, $modal, $log) {

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

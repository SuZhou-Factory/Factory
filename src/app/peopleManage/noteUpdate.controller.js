(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('NoteUpdateController', NoteUpdateController);

    /** @ngInject */
    function NoteUpdateController($scope, $state, $modal, Http, DataService, Tools) {        
        if ($scope.$parent.$parent.data.updateNote) {
            $scope.data.note = $scope.$parent.$parent.data.updateNote;
        }

        $scope.save = function(updateInfo, success, error) {
            Http.post('note/update', {note: $scope.data.note}).success(function(data) {
                if (data.result.code == '000000') {
                    Tools.alert({
                        data: {
                            message: '保存成功',
                        },
                        success: function() {
                            $scope.$parent.$parent.updatePageShow = false;
                            $scope.$parent.$parent.viewPageShow = false;
                            $scope.$parent.$parent.data.updatePageShow = false;
                            $scope.$parent.$parent.data.viewPageShow = false;
                            $scope.$parent.$parent.data.updateNote = null;
                        }
                    });
                }
                if (success) success(data);
            });
        }

        $scope.back = function() {
            $scope.$parent.$parent.updatePageShow = false;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.updatePageShow = false;
            $scope.$parent.$parent.data.viewPageShow = false;
            $scope.$parent.$parent.data.updateNote = null;
        };
    }
})();
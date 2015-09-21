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

        $scope.cal = function(content){
            if (content && (isNaN(content.contentmoney) || isNaN(content.contentpaid))) {
                return;
            }
            var sumMon = 0, sumPaid = 0;
            for (var i = 0; i < $scope.data.note.contents.length; i++) {
                if ($scope.data.note.contents[i].contentmoney && !isNaN($scope.data.note.contents[i].contentmoney)) {
                    sumMon += $scope.data.note.contents[i].contentmoney;
                }
                if ($scope.data.note.contents[i].contentpaid && !isNaN($scope.data.note.contents[i].contentpaid)) {
                    sumPaid += $scope.data.note.contents[i].contentpaid;
                }
            } 
            $scope.data.note.totlemoney = sumMon;
            $scope.data.note.totalpaid = sumPaid;
        }
    }
})();

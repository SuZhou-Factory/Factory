(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('NoteViewController', NoteViewController);

    /** @ngInject */
    function NoteViewController($scope, $rootScope, $timeout, Tools, DataService) {
        if ($scope.$parent.$parent.data.viewNote) {
            $scope.data.note = $scope.$parent.$parent.data.viewNote;
        }
        $scope.back = function() {
            $scope.$parent.$parent.updatePageShow = false;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.updatePageShow = false;
            $scope.$parent.$parent.data.viewPageShow = false;
            $scope.$parent.$parent.data.viewNoteid = null;
        };
        $scope.print = function(selector) {
            var options = {
            	mode : 'iframe',
            	popClose : false,
            	extraCss : 'print'
            };
        	$(selector).printArea(options);
        };
        $scope.printAll = function() {
        	var html = $('.print').html();
        	$scope.print('<div class="print">' + html + '</div>');
        };
    }
})();

(function() {
  'use strict';

  angular
    .module('suzhou')
    .directive('temp', temp);

  function temp() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/temp/temp.html',
      // scope: {
      //     creationDate: '='
      // },
      // controller: TempController,
      // controllerAs: 'vm',
      // bindToController: true
    };

    return directive;

  }

})();

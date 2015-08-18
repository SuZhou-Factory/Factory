(function() {
  'use strict';

  angular
    .module('suzhou')
    .directive('navb', Navbar);

  /** @ngInject */
  function Navbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navb/navb.html',
      controllerAs: 'vm',
    };

    return directive;
  }

})();

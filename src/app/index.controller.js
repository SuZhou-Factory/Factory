(function() {
  'use strict';

  angular
    .module('suzhou')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController($scope) {
    $(document).foundation();
    $(document).foundation('tooltip', 'reflow');
  }
})();

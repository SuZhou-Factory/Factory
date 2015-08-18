(function() {
  'use strict';

  angular
    .module('suzhou')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();

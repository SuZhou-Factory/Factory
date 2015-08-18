(function() {
  'use strict';

  angular
    .module('suzhou')
    .directive('eMenu', eMenu);

  /** @ngInject */
  function eMenu() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/menu/menu.html',
      // scope: {
      //     creationDate: '='
      // },
      // controller: NavbarController,
      // controllerAs: 'vm',
      // bindToController: true,
      link: linkFunc,
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment) {
      var vm = this;

      // "vm.creation" is avaible by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
    }

    function linkFunc(scope, el, attr, vm) {
      // el.addClass('menu');
      // el.addClass('fold');
      // console.dir(el);
    }

  }

})();

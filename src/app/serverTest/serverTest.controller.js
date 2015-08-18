(function() {
  'use strict';

  angular
    .module('suzhou')
    .controller('ServerTestController', ServerTestController);

  /** @ngInject */
  function ServerTestController($scope, $http) {
    $scope.info = Setting.sendData;
    $scope.keyName = 'dataJson';
    $scope.config = {
      method: 'GET',
      url: Setting.url,
      data: {}
    };
    $scope.sendInfo = '';
    $scope.Get = function() {
      var sendData = {};
      sendData[$scope.keyName] = $scope.info;
      $scope.sendInfo = '';
      $scope.config.method = 'GET';
      $scope.config.data = sendData;//JSON.parse($scope.info);
      $http($scope.config).success(successCallback).error(errorCallback);
    };
    $scope.Post = function() {
      var sendData = {};
      sendData[$scope.keyName] = $scope.info;
      $scope.sendInfo = JSON.stringify(sendData);
      $scope.config.method = 'POST';
      $scope.config.data = sendData;//JSON.parse($scope.info);
      $http($scope.config).success(successCallback).error(errorCallback);
    };

    return;
    function successCallback(data, status, headers, config) {
      $scope.response=JSON.stringify(data);
    }
    function errorCallback(data, status, headers, config) {
      $scope.response=JSON.stringify(data);
    }

  }
})();

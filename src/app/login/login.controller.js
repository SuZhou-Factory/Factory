(function() {
    'use strict';

    var suzhou = angular.module('suzhou');
    suzhou.controller('LoginController', LoginController);
 

    /** @ngInject */
    function LoginController($rootScope, $scope, $http, $state, Tools) {
        $('#loginForm').validate({
            rules: {
                username: {
                    required: true,
                    minlength: 2
                },
                password: {
                    required: true,
                    minlength: 6
                }
            },
            messages: {
                username: {
                    required: "请输入用户名",
                    minlength: "用户名太短，必须两位以上"
                },
                password: {
                    required: "请输入密码",
                    minlength: "密码必须六位以上"
                }
            }
        });
        $scope.user = Setting.login.data || {
            username: '',
            password: '',
        };

        $scope.Post = function() {
            if (!$('#loginForm').valid()) {
                return;
            }
            $http.post(Setting.host + Setting.login.url, {user: $scope.user})
                .success(successCallback)
                .error(errorCallback);
        };

        return;

        function successCallback(data, status, headers, config) {
            // data.user.rights = Tools.transtoTree(data.user.rights);
            if ($state.current.data.userText) {
                sessionStorage[$state.current.data.userText] = JSON.stringify(data.user);
            } else {
                sessionStorage.user = JSON.stringify(data.user);
            }
            $state.go($state.current.data.mainPage);
            // $httpProvider.defaults.headers.common.Cookie = getSessionId();
            // console.log(getSessionId());
        }

        function errorCallback(data, status, headers, config) {
            // if (TestData.debug) {
            //     sessionStorage.user = JSON.stringify(TestData.login);
            //     $state.go('main');
            // }
            // $scope.response = JSON.stringify(data);
        }


    }

})();

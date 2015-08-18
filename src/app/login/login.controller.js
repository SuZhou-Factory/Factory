(function() {
    'use strict';

    var suzhou = angular.module('suzhou');
    suzhou.controller('LoginController', LoginController);
 

    /** @ngInject */
    function LoginController($rootScope, $scope, $http, $state, Tools) {
        $('.content').validate({
            submitHandler: function(form) {
                $(form).ajaxSubmit();
            },
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
            $http.post(Setting.host + Setting.login.url, {user: $scope.user})
                .success(successCallback)
                .error(errorCallback);
        };

        return;

        function successCallback(data, status, headers, config) {
            data.user.rights = Tools.transtoTree(data.user.rights);
            sessionStorage.user = JSON.stringify(data.user);
            $state.go('main');
            // $httpProvider.defaults.headers.common.Cookie = getSessionId();
            // console.log(getSessionId());
        }

        function errorCallback(data, status, headers, config) {
            if (TestData.debug) {
                sessionStorage.user = JSON.stringify(TestData.login);
                $state.go('main');
            }
            $scope.response = JSON.stringify(data);
        }

        // function getSessionId() {
        //     var c_name = 'JSESSIONID';
        //     if (document.cookie.length > 0) {
        //         c_start = document.cookie.indexOf(c_name + "=")
        //         if (c_start != -1) {
        //             c_start = c_start + c_name.length + 1
        //             c_end = document.cookie.indexOf(";", c_start)
        //             if (c_end == -1) c_end = document.cookie.length
        //             return unescape(document.cookie.substring(c_start, c_end));
        //         }
        //     }
        // }


    }

})();

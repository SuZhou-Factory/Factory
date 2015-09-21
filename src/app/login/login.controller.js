(function() {
    'use strict';

    var suzhou = angular.module('suzhou');
    suzhou.controller('LoginController', LoginController);
 
    /** @ngInject */
    function LoginController($rootScope, $scope, Http, $state, Tools) {
        $scope.user = {
            username: '',
            password: '',
        };
        $('#username').blur(function() {
            getRandomCode();
        });

        function getRandomCode(callback) {
            if ($scope.user.username == '' && $('#loginForm input[name="username"]').val()) {
                $scope.user.username = $('#loginForm input[name="username"]').val();
                $scope.user.password = $('#loginForm input[name="password"]').val();
            }
            if ($scope.user.username != '') {
                Http.post('prelogin', {user: {username: $scope.user.username}})
                    .success(function(data, status, headers, config){
                        $scope.randomCode = data.randomCode;
                        if (callback) {
                            callback();
                        }
                    });
            }
        }
        getRandomCode();

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

        $scope.Post = function() {
            if (!$scope.randomCode) {
                getRandomCode(Login);
            } else {
                Login();
            }
        };

        var Login = function () {
            if (!$('#loginForm').valid()) {
                return;
            }
            // $scope.user.password = encryptByDES($scope.user.password, $scope.randomCode);
            Http.post('login', {user: $scope.user}).success(successCallback);
            setTimeout(function() {
                $scope.user.password = '';
            }, 10);
        }

        return;

        function successCallback(data, status, headers, config) {
            if ($state.current.data.userText) {
                sessionStorage[$state.current.data.userText] = JSON.stringify(data.user);
            } else {
                sessionStorage.user = JSON.stringify(data.user);
            }
            $state.go($state.current.data.mainPage);

            sessionStorage.facotyName = data.facotyName;
            sessionStorage.warning = JSON.stringify(data.warning);
        }
    }

    function encryptByDES(message, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }
     
    function decryptByDES(ciphertext, key) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
     
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

})();

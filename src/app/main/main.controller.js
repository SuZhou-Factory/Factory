(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('MainController', MainController)
        .controller('MainModalController', MainModalController);

    function MainController($rootScope, $scope, $state, $modal, Http, DataService, Tools) {
        $scope.statename = 'main';
        $scope.facotyName = sessionStorage.facotyName;
        if (sessionStorage.warning) {
            $scope.warning = JSON.parse(sessionStorage.warning);
        }

        $scope.dateOptions = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:+100',
            dateFormat: 'yy-mm-dd',
            prevText: '<',
            nextText: '>',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        };
        $scope.dateOptions2 = {
            changeYear: true,
            changeMonth: true,
            yearRange: '1900:+0',
            maxDate: '+0d',
            dateFormat: 'yy-mm-dd',
            prevText: '<',
            nextText: '>',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        };
        if (sessionStorage.user) {
            $scope.user = JSON.parse(sessionStorage.user);
        } else {
            $state.go('login');
            return;
        }

        $scope.pages = DataService.main.pages.list || [];

        $scope.closePage = function() {
            var addr = this.page.state.split('.');
            var temp = DataService;
            var pagesList = DataService[addr[0]].pages.list; 
            for (var i = 0; i < pagesList.length; i++) {
                if (pagesList[i].state == this.page.state) {
                    $scope.pages = pagesList = DataService[addr[0]].pages.list = _.without(pagesList, pagesList[i]);
                    break;
                }
            }
            if (this.page.active){
                if (pagesList.length > 0) {
                    $state.go(pagesList[pagesList.length-1].state);
                } else {
                    $state.go($scope.statename);
                }
            }
            DataService.unmout(this.page.state);
        };

        function getMenu() {
            Http.get('right/fetchRights').success(function(data) {
                if (data.rights && !(data.rights instanceof Array)) {
                    data.rights = [data.rights];
                }
                $scope.rights = Tools.clone(data.rights);
                $scope.menus = Tools.transtoTree(data.rights);
                $scope.menus[0].open = true;
            });
        }
        getMenu();

		$scope.checkRight = function(right) {
			for (var i=0; i<$scope.rights.length; i++) {
				if ($scope.rights[i].value == right) {
                    return true;
                }
			}
            return false;
		};
        $scope.logOut = function() {
            Tools.alert({
                data: {
                    message: '确认退出？',
                },
                success: function() {
                    Http.get('user/loginOut').success(function(data) {
                        $scope.pages = DataService.main.pages.list = [];
                        // clear user info
                        sessionStorage.user = '';

                        $state.go('login');
                    });
                }
            });
        };

        $scope.resetPass = function() {
            var modal = {
                title: '修改密码',
                username: $scope.user.name,
            };

            openModal(modal, function(data) {
                $scope.search(); // 刷新页面
            }, function(data) {

            });
        };

        function openModal(data, success, error) {
            var modalInstance = $modal.open({
                templateUrl: 'app/main/main-modal.html',
                controller: 'MainModalController',
                backdrop: 'static',
                windowClass: 'pass-modal',
                resolve: {
                    modal: function() {
                        return data;
                    }
                }
            });

            modalInstance.result.then(function(data) {
                if (success) {
                    success(data);
                }
            }, function(data) {
                if (error) {
                    error(data);
                }
            });
        }
    }

    function MainModalController($scope, $state, $modalInstance, Http, $timeout, modal) {
        $timeout(function() {
            $('#passModalForm').validate({
                errorLabelContainer: $(".validate-msg"),
                focusCleanup: true,
                errorClass: 'invalid',
                rules: {
                    password: {
                        required: true,
                    },
                    newpassword: {
                        required: true,
                        minlength: 6
                    },
                    newpassword2: {
                        required: true,
                        minlength: 6
                    },
                },
                messages: {
                    password: {
                        required: "请输入原密码",
                    },
                    newpassword: {
                        required: "请输入新密码",
                        minlength: "密码长度不能少于6位"
                    },
                    newpassword2: {
                        required: "请再次输入新密码",
                        minlength: "密码长度不能少于6位"
                    },
                }
            });
        }, 10);

        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;

        $scope.user = {
            password: '',
            newpassword: '',
            newpassword2: ''
        };

        function getRandomCode() {
            if ($scope.user.username != '') {
                Http.post('prelogin', {user: {username: $scope.modal.username}})
                    .success(function(data, status, headers, config){
                        $scope.randomCode = data.randomCode;
                    });
            }
        }
        getRandomCode();

        $scope.check = function() {
            if ($scope.user.newpassword != $scope.user.newpassword2) {
                $scope.msg.success = false;
                $scope.msg.message = '两次输入密码不一致';
            }
        };
        $scope.focus = function() {
            $scope.msg.success = true;
            $scope.msg.message = '';
        };
        $scope.ok = function() {
            if (!$('#passModalForm').valid()) {
                return;
            }
            if ($scope.user.newpassword2 != $scope.user.newpassword) {
                return;
            }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            delete $scope.user.newpassword2;
            $scope.user.password = encryptByDES($scope.user.password, $scope.randomCode);
            $scope.user.newpassword = encryptByDES($scope.user.newpassword, $scope.randomCode);
            Http.post('user/resetPass', {user: $scope.user}).success(function(data) {
                if (data.result.code == '000000') {
                    $scope.msg.success = true;
                    $scope.msg.message = $scope.modal.title + data.result.message;
                    $modalInstance.close();
                    if ($state.current.name == 'main') {
                        sessionStorage.user = '';
                        $state.go('login');
                    } else {
                        sessionStorage[$state.current.data.userText] = '';
                        $state.go('adminlogin');
                    }
                } else {
                    $scope.msg.success = false;
                    $scope.msg.message = data.result.message;
                }
            }, true).error(function(data) {
                $scope.msg.success = false;
                $scope.msg.message = '网络异常，' + $scope.modal.title + '失败';
            });
        };
        $scope.cancel = function() {
            $modalInstance.dismiss();
        };
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

(function() {
    'use strict';

    angular
        .module('suzhou')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
            })
            .state('main.user', {
                url: '',
                templateUrl: 'app/peopleManage/user.html',
                controller: 'UserController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    data: function() {
                        return {};
                    },
                    pageInfo: function(){
                        return {
                            name: '员工',
                            state: 'main.user',
                            active: true
                        };
                    }
                },
                data: {
                    name: '客户',
                    state: 'main.user',
                    active: true
                },
            })
            .state('main.client', {
                url: '',
                templateUrl: 'app/peopleManage/client.html',
                controller: 'ClientController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    data: function() {
                        return {};
                    },
                    pageInfo: function(){
                        return {
                            name: '客户',
                            state: 'main.client',
                            active: true
                        };
                    }
                },
                data: {
                    name: '客户',
                    state: 'main.client',
                    active: true
                },
            })
            .state('main.supplier', {
                url: '',
                templateUrl: 'app/peopleManage/supplier.html',
                controller: 'SupplierController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    data: function() {
                        return {};
                    },
                    pageInfo: function($state){
                        return {
                            name: '供应商',
                            state: 'main.supplier',
                            active: true
                        };
                    }
                },
                data: {
                    name: '客户',
                    state: 'main.supplier',
                    active: true
                },
            })
            .state('main.goods', {
                url: '',
                templateUrl: 'app/peopleManage/goods.html',
                controller: 'GoodsController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    data: function() {
                        return {};
                    },
                    pageInfo: function(){
                        return {
                            name: '材料',
                            state: 'main.goods',
                            active: true
                        };
                    }
                },
                data: {
                    name: '材料',
                    state: 'main.goods',
                    active: true
                },
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                data: {
                    mainPage: "main",
                } 
            })
            .state('adminlogin', {
                url: '/login/admin',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                data: {
                    mainPage: "admin.backend",
                    userText: 'adminuser' 
                } 
            })
            .state('admin', {
                url: '/admin',
                abstract: true,
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminController',
            })
            .state('admin.backend', {
                url: '',
                templateUrl: 'app/admin/backend.html',
                controller: 'BackendController',
            })
            .state('admin.role', {
                url: '',
                templateUrl: 'app/admin/role.html',
                controller: 'RoleController',
            })
            .state('admin.right', {
                url: '',
                templateUrl: 'app/admin/right.html',
                controller: 'RightController',
            })
            .state('server-test', {
                url: '/server-test',
                templateUrl: 'app/serverTest/serverTest.html',
                controller: 'ServerTestController',
            })
            .state('shipment', {
                url: '/shipment',
                templateUrl: 'app/shipment/shipment.html',
                controller: 'ShipmentController',
            });

        $urlRouterProvider.otherwise('/');


        function onEnter(pageInfo, DataService) {
            pageInfo.active = true;
            var addrs = pageInfo.state.split('.');
            DataService[addrs[0]].pages.open(pageInfo);
        }

        function onExit (pageInfo, DataService){

            // 关闭Tab标签页
            pageInfo.active = false;
            var list = DataService[pageInfo.state.split('.')[0]].pages.list;
            for (var i = 0; i < list.length; i++) {
                if (list[i].state == pageInfo.state) {
                    list[i].active = pageInfo.active;
                    return;
                }
            }
        }

    }


})();

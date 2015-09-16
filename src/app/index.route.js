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
            .state('main.buy', {
                url: '',
                templateUrl: 'app/peopleManage/buy.html',
                controller: 'BuyController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '进货清单',
                            state: 'main.buy',
                            active: true
                        };
                    }
                },
                data: {
                    name: '进货清单',
                    state: 'main.buy',
                    active: true
                },
            })
            .state('main.moneyIn', {
                url: '',
                templateUrl: 'app/peopleManage/money-in.html',
                controller: 'MoneyController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '实收款项',
                            state: 'main.moneyIn',
                            active: true
                        };
                    }
                },
                data: {
                    name: '实收款项',
                    state: 'main.moneyIn',
                    active: true
                },
            })
            .state('main.moneyOut', {
                url: '',
                templateUrl: 'app/peopleManage/money-out.html',
                controller: 'MoneyController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '实付款项',
                            state: 'main.moneyOut',
                            active: true
                        };
                    }
                },
                data: {
                    name: '实付款项',
                    state: 'main.moneyOut',
                    active: true
                },
            })
            .state('main.order', {
                url: '',
                templateUrl: 'app/peopleManage/order.html',
                controller: 'OrderController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '订单',
                            state: 'main.order',
                            active: true
                        };
                    }
                },
                data: {
                    name: '订单',
                    state: 'main.order',
                    active: true
                },
            })
            // .state('main.order.update', {
            //     url: '',
            //     templateUrl: 'app/peopleManage/order-update.html',
            //     controller: 'OrderUpdateController',
            //     // onEnter: onEnter,
            //     // onExit: onExit,
            //     resolve: {
            //         pageInfo: function(){
            //             return {
            //                 name: '添加订单',
            //                 state: 'main.orderupdate',
            //                 active: true
            //             };
            //         }
            //     },
            //     data: {
            //         name: '添加订单',
            //         state: 'main.orderupdate',
            //         active: true
            //     },
            //     params: {
            //         orderid: null
            //     },
            // })
            .state('main.wujin', {
                url: '',
                templateUrl: 'app/peopleManage/wujin.html',
                controller: 'WujinController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '五金',
                            state: 'main.wujin',
                            active: true
                        };
                    }
                },
                data: {
                    name: '五金',
                    state: 'main.wujin',
                    active: true
                }
            })
            .state('main.bill', {
                url: '',
                templateUrl: 'app/peopleManage/bill.html',
                controller: 'BillController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '账单查询',
                            state: 'main.bill',
                            active: true
                        };
                    }
                },
                data: {
                    name: '账单查询',
                    state: 'main.bill',
                    active: true
                }
            })
            .state('main.billFirst', {
                url: '',
                templateUrl: 'app/peopleManage/billFirst.html',
                controller: 'BillFirstController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '首次账单',
                            state: 'main.billFirst',
                            active: true
                        };
                    }
                },
                data: {
                    name: '首次账单',
                    state: 'main.billFirst',
                    active: true
                },
            })
            .state('main.billHistory', { 
                url: '',
                templateUrl: 'app/peopleManage/billHistory.html',
                controller: 'BillHistoryController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '历史账单',
                            state: 'main.billHistory',
                            active: true
                        };
                    }
                },
                data: {
                    name: '历史账单',
                    state: 'main.billHistory',
                    active: true
                },
            })
            .state('main.note', { 
                url: '',
                templateUrl: 'app/peopleManage/note.html',
                controller: 'NoteController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '其他',
                            state: 'main.note',
                            active: true
                        };
                    }
                },
                data: {
                    name: '其他',
                    state: 'main.note',
                    active: true
                },
            })
            .state('main.tongji', { 
                url: '',
                templateUrl: 'app/peopleManage/statistics-debts.html',
                controller: 'StatisticsDebtsController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '欠款情况',
                            state: 'main.tongji',
                            active: true
                        };
                    }
                },
                data: {
                    name: '欠款情况',
                    state: 'main.tongji',
                    active: true
                },
            })
            .state('main.tongjiGoods', { 
                url: '',
                templateUrl: 'app/peopleManage/statistics-goods.html',
                controller: 'StatisticsGoodsController',
                onEnter: onEnter,
                onExit: onExit,
                resolve: {
                    pageInfo: function(){
                        return {
                            name: '材料统计',
                            state: 'main.tongjiGoods',
                            active: true
                        };
                    }
                },
                data: {
                    name: '材料统计',
                    state: 'main.tongjiGoods',
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
            })
            .state('phone', {
                url: '/phone',
                templateUrl: 'app/phone/phone.html',
                controller: 'PhoneController',
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

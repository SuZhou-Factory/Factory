(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('OrderUpdateController', OrderUpdateController);

    /** @ngInject */
    function OrderUpdateController($scope, $rootScope, $timeout, Http, Tools, DataService) {
        var newOrder = {
            id: '',
            peoplename: '',
            ordername: '',
            ordertime: new Date(),
            orderstatus: 0,
            orderamount: 0,
            itemSize: 0,
            orderItems: [],
            note: ''
        };

        // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        $scope.data = $scope.$parent.$parent.data.updatePageData;
        if (!$scope.data || _.isEmpty($scope.data)) {
            $scope.data = {};
            if ($scope.$parent.$parent.data.editOrderid) {
                $scope.isEdit = true;
                getEditOrder($scope.$parent.$parent.data.editOrderid);
            } else {
                $scope.data.order = newOrder;
            }
            $scope.$parent.$parent.data.updatePageData = $scope.data;
        }

        function getEditOrder(orderid) {
            var info = {
                order: {
                    id: orderid,
                    peoplename: '',
                    ordername: '',
                    orderstatus: '',
                    startTime: '',
                    endTime: ''
                },
                page: {
                    pageNo: 1,
                    pageSize: 15,
                }
            };
            Http.post('order/index', info).success(function(data){
                data.orders.ordertime = Tools.fixJavaTime(data.orders.ordertime);
                $scope.data.order = data.orders;
            });
        }

        function getGoodsInfo() {
            var info = {
                goods: {
                    name: '',
                    goodstype: ''
                },
                page: {
                    pageNo: 1,
                    pageSize: 10000,
                }
            };
            Http.post('goods/index', info).success(function(data){
                if (data.goods && !(data.goods instanceof Array)) {
                    data.goods = [data.goods];
                }
                $scope.data.goods = data.goods; 

                for (var i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].goodstype != -9 && data.goods[i].goodstype != -8) {
                        continue;
                    }
                    delete data.goods[i].id;
                    delete data.goods[i].createtime;
                    delete data.goods[i].edittime;
                    delete data.goods[i].factoryid;
                    if (data.goods[i].unit == null) {
                        data.goods[i].unit = '';
                    }
                    if (data.goods[i].note) {
                        data.goods[i].allnote = data.goods[i].note;
                    }
                    data.goods[i].note = '';

                    var good = Tools.clone(data.goods[i]);
                    good.itemDetails = [];
                    if (!good.number) {
                        good.number = 1;
                    }
                    for (var j = 0; j < good.number; j++) {
                        good.itemDetails.push({});
                    }
                    newOrder.orderItems.push(good);
                }
            });
        }
        getGoodsInfo();

        $scope.addGoods = function() {
            $scope.data.order.orderItems.push({goodstype: -8});
        };
        $scope.change = function(good) {
            if (good.name == '') {
                // $scope.data.order.orderItems = _.without($scope.data.order.orderItems, good);
                good.count = '   ';
                good.price = '';
                good.note = '';
                good.unit = '';
                good.totalmoney = '';
                return;
            }
            var goods = $scope.data.goods;
            for (var i = 0; i < goods.length; i++) {
                if ((goods[i].goodstype == -6 || goods[i].goodstype == -8) && goods[i].name == good.name) {
                    good.price = goods[i].price;
                    good.note = goods[i].note;
                    good.unit = goods[i].unit;
                    // good.detailSize = goods[i].detailSize;
                }
            }
        };
        $scope.sum = function(good) {
            var sum = 0;
            for (var i = 0; i < good.itemDetails.length; i++) {
                if(angular.isNumber(good.itemDetails[i].detaila) && angular.isNumber(good.itemDetails[i].detailb)) {
                    sum += good.itemDetails[i].detaila * good.itemDetails[i].detailb;
                }
            }
            good.count = sum.toFixed(2) - 0;
        };
        $scope.sum2 = function(good) {
            if(angular.isNumber(good.count) && angular.isNumber(good.price)) {
                good.totalmoney = good.count * good.price;
                good.totalmoney = good.totalmoney.toFixed(2) - 0;
            }
        };
        $scope.sum3 = function(order) {
            var sum = 0;
            for (var i = 0; i < order.orderItems.length; i++) {
                if (angular.isNumber(order.orderItems[i].totalmoney)) {
                    sum += order.orderItems[i].totalmoney;
                }
            }
            order.orderamount = sum.toFixed(2) - 0;
        };
        $scope.checkbox = function(good,selected) {
            var notes = [];
            for (var i = 0; i < good.allnotes.length; i++) {
                if (good.allnotes[i].selected) {
                    notes.push(good.allnotes[i].text);
                }
            }
            good.note = notes.join('、');
        };
        $scope.initNotes = function(good) {
            if (good.allnotes) {
                var notes = good.allnote.split('&');
                if (notes != '' && notes != null) {
                    good.allnotes = [];
                    for (var j = 0; j < notes.length; j++) {
                        good.allnotes.push({text: notes[j]});
                    }
                }
            }
        };
        var saveButtonClickable = true;
        $scope.save = function() {
            if (!saveButtonClickable) {
                return;
            }
            if ($scope.data.order.peoplename == '') {
                Tools.alert({
                    data: {
                        // title: '提示',
                        message: '请输入姓名'
                    }
                });
                return;
            }
            if ($scope.data.order.ordername == '') {
                Tools.alert({
                    data: {
                        // title: '提示',
                        message: '请输入产品'
                    }
                });
                return;
            }
            for (var i = 0; i < $scope.data.order.orderItems.length; i++) {
                if ($scope.data.order.orderItems[i].itemDetails.length) {
                    $scope.data.order.orderItems[i].detailSize = $scope.data.order.orderItems[i].itemDetails.length;
                }
            };
            $scope.data.order.itemSize = $scope.data.order.orderItems.length;
            saveButtonClickable = false;
            $timeout(function() {
                saveButtonClickable = true;
            }, 3000);
            Http.post('order/update', {order: $scope.data.order}).success(function(data){
                $scope.$parent.$parent.updatePageShow = false;
                $scope.$parent.$parent.viewPageShow = false;
                $scope.$parent.$parent.data.updatePageShow = false;
                $scope.$parent.$parent.data.viewPageShow = false;
                $scope.$parent.$parent.data.updatePageData = null;
                $scope.$parent.$parent.data.editOrderid = null;

                // Tools.alert({
                //     data: {
                //         // title: '提示',
                //         message: '保存成功！',
                //         autoClose: true
                //     },
                //     backdrop: true,
                //     success: function() {
                //         $scope.$parent.$parent.updatePageShow = false;
                //         $scope.$parent.$parent.viewPageShow = false;
                //         $scope.$parent.$parent.data.updatePageShow = false;
                //         $scope.$parent.$parent.data.viewPageShow = false;
                //         $scope.$parent.$parent.data.updatePageData = null;
                //         $scope.$parent.$parent.data.editOrderid = null;
                //     },
                //     error: function() {
                //         $scope.$parent.$parent.updatePageShow = false;
                //         $scope.$parent.$parent.viewPageShow = false;
                //         $scope.$parent.$parent.data.updatePageShow = false;
                //         $scope.$parent.$parent.data.viewPageShow = false;
                //         $scope.$parent.$parent.data.updatePageData = null;
                //         $scope.$parent.$parent.data.editOrderid = null;
                //     }
                // });
            });
        };
        $scope.back = function() {
            if ($scope.isEdit && $scope.originalDataStr == 'xxxx') {

            } else {
                Tools.alert({
                    data: {
                        // title: '提示',
                        message: '当前页面数据未保存，若不保存并离开，请点击确认',
                    },
                    success: function() {
                        $scope.$parent.$parent.updatePageShow = false;
                        $scope.$parent.$parent.viewPageShow = false;
                        $scope.$parent.$parent.data.updatePageShow = false;
                        $scope.$parent.$parent.data.viewPageShow = false;
                        $scope.$parent.$parent.data.updatePageData = null;
                        $scope.$parent.$parent.data.editOrderid = null;
                    },
                    error: function() {

                    }
                });
            }
        };
        $scope.print = function() {
            $('.order-update').printArea();
        };
        // $scope.fixJavaTime = function(timeStr) {
        //     console.log(this);
        //     return timeStr.replace(/CST/, '(CST)');
        // };
    }
})();

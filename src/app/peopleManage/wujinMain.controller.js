(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('WujinMainController', WujinMainController);

    /** @ngInject */
    function WujinMainController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.tableHead = ['时间', '名称', '产品', '金额', '操作'];

        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };
        // -- 网络请求相关定义
        $scope.searchInfo = {
            order: {
                peoplename: '',
                ordername: '',
                startTime: '',
                endTime: ''
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'wujin/index', $scope.searchInfo).success(function(data){
                if (data.orders && !(data.orders instanceof Array)) {
                    data.orders = [data.orders];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {

            });
        };
        $scope.search();

        // -- 页面相关数据以及控制
        $scope.add = function() {
            $scope.$parent.$parent.updatePageShow = true;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.updatePageShow = true;
            $scope.$parent.$parent.data.viewPageShow = false;
        };
        $scope.edit = function(order, item) {
            var editInfo = Tools.clone(order);
            editInfo.orderItems = Tools.clone(item);
            $scope.$parent.$parent.data.editInfo = editInfo;
            $scope.$parent.$parent.updatePageShow = true;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.updatePageShow = true;
            $scope.$parent.$parent.data.viewPageShow = false;
        };
        $scope.delete = function(order, item) {
            Tools.alert({
                data: {
                    // title: '提示',
                    message: '确认删除？',
                },
                success: function() {
                    var info = {
                        order: {
                            orderId: order.id,
                            itemId: item.id,
                        }
                    };
                    $http.post(Setting.host + 'wujin/delete', info).success(function(data){
                        $scope.search();
                    }).error(function(data) {

                    });
                },
                error: function() {

                }
            });
        }



   //      // -- 页面相关数据以及控制
   //      $scope.add = function() {
   //          var addOrder = {
		 //        id: '',
		 //        orderstatus: '',
		 //        peoplename: '',
		 //        status: 1,
		 //        ordername: '',
		 //        orderItems: [{
		 //            itemtype: 2,
		 //            totalmoney: '',
		 //            count: '',
		 //            allnote: '',
		 //            status: 1,
		 //            unit: '',
		 //            price: '',
		 //            goodstype: 3,
		 //            name: '',
		 //            orderid: '',
		 //            note: '',
		 //            itemDetails: []
		 //        }],
		 //        ordertime: '',
		 //        orderamount: 33526.6,
		 //        note: ''
   //          };
   //          var modal = {
   //              title: '添加五金订单',
   //              order: addOrder,
   //              dateOptions: $scope.dateOptions,
   //              isAdd: true
   //          };

   //          openModal(modal, function(data) {
   //              //刷新页面
   //              $scope.search();
   //          }, function(data) {

   //          });
   //      };
 		// $scope.edit = function() {
 		// 	this.order.ordertime = Tools.fixJavaTime(this.order.ordertime);
   //          var modal = {
   //              title: '修改五金订单',
   //              order: Tools.clone(this.order),
   //              dateOptions: $scope.dateOptions
   //          };

   //          openModal(modal, function(data) {
   //              $scope.search(); // 刷新页面
   //          }, function(data) {

   //          });
 		// };

   //      function openModal(data, success, error) {
   //          var modalInstance = $modal.open({
   //              templateUrl: 'app/peopleManage/wujin-modal.html',
   //              controller: 'WujinModalController',
   //              backdrop: 'static',
   //              windowClass: 'wujin-modal',
   //              resolve: {
   //                  modal: function() {
   //                      return data;
   //                  }
   //              }
   //          });

   //          modalInstance.result.then(function(data) {
   //              if (success) {
   //                  success(data);
   //              }
   //          }, function(data) {
   //              if (error) {
   //                  error(data);
   //              }
   //          });
   //      }
    }

    function WujinModalController($scope, $modalInstance, $http, $timeout, modal) {
        $timeout(function() {
            // $('#roleModalForm').validate({
            //     rules: {
            //         rightname: {
            //             required: true,
            //         }
            //     },
            //     messages: {
            //         rightname: {
            //             required: "请输入用户名",
            //         }
            //     }
            // });
        }, 10);

        $scope.msg = {
            message: '',
            success: true
        };
        $scope.modal = modal;

        $scope.ok = function() {
            // if (!$('#roleModalForm').valid()) {
            //     return;
            // }
            $scope.msg.success = true;
            $scope.msg.message = '......';
            // 验证
            
            update({client: modal.client}, function (data) {
                if (data.result.code == '000000') {
                    $scope.msg.success = true;
                    $scope.msg.message = $scope.modal.title + data.result.message;

                    $modalInstance.close();
                } else {
                    $scope.msg.success = false;
                    $scope.msg.message = data.result.message;
                }
            }, function (data) {
                $scope.msg.success = false;
                $scope.msg.message = '网络异常，' + $scope.modal.title + '失败';
            });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss();
        };

        function update(updateInfo, success, error) {
            $http.post(Setting.host + 'client/update', updateInfo).success(function(data) {
                if (success) success(data);
            }).error(function(data) {
                if (error) error(data);
            });
        }

        function getSelectOption() {
            var info = {
                goods: {
                    goodstype: '-4',
                },
                page: {
                    pageNo: 1,
                    pageSize: 1000
                }
            };
            $http.post(Setting.host + 'goods/index', info).success(function(data){
                if (data.goods && !(data.goods instanceof Array)) {
                    data.goods = [data.goods];
                }
                // $scope.options = data.goods;
                $scope.options = [];

                $scope.typeList = {
                    '-4': '类型',
                    '-3': '单规格',
                    '-2': '多规格',
                    '-1': '不显示',
                };
                for (var i = 0; i < data.goods.length; i++) {
                    $scope.typeList[data.goods[i].id] = data.goods[i].name;
                    $scope.options.push({key: data.goods[i].id, value: data.goods[i].name});
                };
            }).error(function(data) {

            });
        }
        getSelectOption();
    }
})();

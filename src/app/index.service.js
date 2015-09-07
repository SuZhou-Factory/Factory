/* global filter */
(function() {
  'use strict';

  angular
    .module('suzhou')
    .factory("DataService", function(){
        return {
            main: {
                pages: {
                    list: [],
                    open: function(page) {
                        for (var i = 0; i < this.list.length; i++) {
                            if (this.list[i].state == page.state) {
                                this.list[i].active = page.active;
                                return;
                            }
                        }
                        this.list.push(page);
                    },
                    close: function(page) {
                        for (var i = 0; i < this.list.length; i++) {
                            if (this.list[i].state == page.state) {
                                this.list = _.without(this.list, this.list[i]);
                                return;
                            }
                        }
                    }
                },
            },
            mount: function(state, data) {
                var addrs = state.split('.');
                var temp = this;
                for (var i = 0; i < addrs.length-1; i++) {
                    if (!temp[addrs[i]]) {
                        temp[addrs[i]] = {};
                    }
                    temp = temp[addrs[i]];
                }
                temp[addrs[addrs.length-1]] = data;
            },
            fetch: function(state) {
                var addrs = state.split('.');
                var temp = this;
                for (var i = 0; i < addrs.length; i++) {
                    if (!temp[addrs[i]]) {
                        temp[addrs[i]] = {};
                    }
                    temp = temp[addrs[i]];
                }
                return temp;
            },
            unmout: function(state) {
                var addrs = state.split('.');
                var temp = this;
                for (var i = 0; i < addrs.length-1; i++) {
                    if (!temp[addrs[i]]) {
                        temp[addrs[i]] = {};
                    }
                    temp = temp[addrs[i]];
                }
                temp[addrs[addrs.length-1]] = null;
            }
        };
    })
    .factory('TabPageService', function(){
        return {

        };
    })
    .factory('Tools', function($modal){
        return {
            clone: function(obj) {
                return JSON.parse(JSON.stringify(obj));
            },

            transtoTree: function(lists) {
                var tree = [];
                for (var i = 0; i < lists.length; i++) {
                    var parentid = lists[i].parentid;
                    for (var j = 0; j < lists.length; j++) {
                        if (lists[j].id == parentid) {
                            if(!lists[j].children) {
                                lists[j].children = new Array();
                            }
                            lists[j].children.push(lists[i]);
                            break;
                        }
                    }
                    if (!parentid) {
                        tree.push(lists[i]);
                    }
                }
                return tree;
            },
            fixJavaTime: function(timeStr) {
                return timeStr.replace(/CST/, '');
            },
            alert: function(conf) {
                /** config detail **/
                var config = {
                    data: '', // 传递给页面的数据
                    success: function() {}, // 点击确认键返回时执行
                    error: function() {}, //  点击取消键返回时执行
                    templateUrl: 'app/alert/alert.html', // 模板路径
                    controller: 'AlertController', // 模板控制器
                    windowClass: 'alert-modal', // 弹出框Class
                }
                angular.extend(config, conf);
                
                var modalInstance = $modal.open({
                    templateUrl: config.templateUrl,
                    controller: config.controller,
                    backdrop: config.backdrop || 'static',
                    windowClass: config.windowClass,
                    resolve: {
                        modal: function() {
                            return config.data;
                        }
                    }
                });

                modalInstance.result.then(function(data) {
                    if (config.success) {
                        config.success(data);
                    }
                }, function(data) {
                    if (config.error) {
                        config.error(data);
                    }
                });
            }
        };
    });

})();
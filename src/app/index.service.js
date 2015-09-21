/* global filter */
(function() {
  'use strict';
  var URL = 'http://192.168.1.100/factorys/';
  // var URL = '/factorys/';
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
    .factory('Http', function($http, $state, Tools){
        return {
            post: function(url, data) {
                var that = this;
                $http.post(URL + url, data)
                    .success(function(data, status, headers, config){
                        if (that._success) {
                            if (data.result.code == '111111') {
                                Tools.alert({
                                    data: {
                                        message: data.result.message,
                                    },
                                    success: function() {
                                        $state.go('login');
                                    },
                                    error: function() {
                                        $state.go('login');
                                    },
                                });
                                return;
                            }
                            if (!that._noAuto) {
                                if (data.result.code != '000000') {
                                    Tools.alert({
                                        data: {
                                            message: data.result.message,
                                        },
                                    });
                                } else {
                                    that._success(data, status, headers, config);
                                }
                            } else {
                                that._success(data, status, headers, config);
                            }
                        }
                    })
                    .error(function(data, status, headers, config){
                        if (!that._error && !that._noAuto) {
                            Tools.alert({
                                data: {
                                    message: '网络连接异常！',
                                },
                            });
                        } else if (that._error) {
                            that._error(data, status, headers, config);
                        }
                    });
                return that;
            },
            get: function(url) {
                var that = this;
                $http.get(URL + url)
                    .success(function(data, status, headers, config){
                        if (that._success) {
                            if (data.result.code == '111111') {
                                Tools.alert({
                                    data: {
                                        message: data.result.message,
                                    },
                                    success: function() {
                                        $state.go('login');
                                    },
                                    error: function() {
                                        $state.go('login');
                                    },
                                });
                                return;
                            }
                            if (!that._noAuto) {
                                if (data.result.code != '000000') {
                                    Tools.alert({
                                        data: {
                                            message: data.result.message,
                                        },
                                    });
                                } else {
                                    that._success(data, status, headers, config);
                                }
                            } else {
                                that._success(data, status, headers, config);
                            }
                        }
                    })
                    .error(function(data, status, headers, config){
                        if (!that._error && !that._noAuto) {
                            Tools.alert({
                                data: {
                                    message: '网络连接异常！',
                                },
                            });
                        } else if (that._error) {
                            that._error(data, status, headers, config);
                        }
                    });
                return that;
            },
            _noAuto: false,
            _success: null,
            success: function(_success, _noAuto) {
                this._success = _success;
                this._noAuto = _noAuto;
                return this;
            },
            _error: null,
            error: function(_error, _noAuto) {
                this._error = _error;
                this._noAuto = _noAuto;
                return this;
            }
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
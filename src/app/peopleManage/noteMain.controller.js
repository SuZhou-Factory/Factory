(function() {
    'use strict';

    angular
        .module('suzhou')
        .controller('NoteMainController', NoteMainController);

    /** @ngInject */
    function NoteMainController($scope, $http, $state, $modal, DataService, Tools) {
        $scope.tableHead = ['名称', '日期', '详情', '操作'];
        $scope.maxSize = 5;
        $scope.setPage = function(pageNo) {
            $scope.searchInfo.page.pageNo = pageNo;
            $scope.search();
        };
        // -- 网络请求相关定义
        $scope.searchInfo = {
            note: {
                name: '',
                mobile: '',
            },
            page: {
                pageNo: 1,
                pageSize: 15,
            }
        };
        $scope.search = function() {
            $http.post(Setting.host + 'note/index', $scope.searchInfo).success(function(data){
                if (data.notes && !(data.notes instanceof Array)) {
                    data.notes = [data.notes];
                }
                $scope.data = data;
                $scope.totalItems = $scope.data.totalNum;
            }).error(function(data) {

            });
        };

        // // 将挂载在数据服务上的数据取回，若为空，则请求网络数据，并挂载.
        // $scope.data = DataService.fetch($state.current.name);
        // if (_.isEmpty($scope.data)) {
        //     $scope.search(function() {
        //         DataService.mount($state.current.name, $scope.data);
        //     });
        // }
        $scope.search();

        // -- 页面相关数据以及控制
        $scope.add = function() {
            var addNote = {
                id: '',
                name: '',
                notetime: new Date(),
                totlemoney: '',
                totalpaid: '',
                noteremark: '',
                head1: '日期',
                head2: '名称',
                head3: '金额',
                head4: '支付',
                head5: '备注',
                contents: []
            };
            for (var i = 0; i < 31; i++) {
                var content = {
                    id: '',
                    noteid: '',
                    contentorder: i,
                    contenttime: '',
                    contentname: '',
                    contentmoney: '',
                    contentpaid: '',
                    contentremark: ''
                };
                addNote.contents.push(content);
            }
            $scope.$parent.$parent.data.updateNote = addNote;
            $scope.$parent.$parent.updatePageShow = true;
            $scope.$parent.$parent.data.updatePageShow = true;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.viewPageShow = false;
        };
        $scope.edit = function() {
            this.note.notetime = Tools.fixJavaTime(this.note.notetime);
            $scope.$parent.$parent.data.updateNote = this.note;
            $scope.$parent.$parent.updatePageShow = true;
            $scope.$parent.$parent.data.updatePageShow = true;
            $scope.$parent.$parent.viewPageShow = false;
            $scope.$parent.$parent.data.viewPageShow = false;
        };
        $scope.view = function() {
            this.note.notetime = Tools.fixJavaTime(this.note.notetime);
            $scope.$parent.$parent.data.viewNote = this.note;
            $scope.$parent.$parent.updatePageShow = false;
            $scope.$parent.$parent.data.updatePageShow = false;
            $scope.$parent.$parent.viewPageShow = true;
            $scope.$parent.$parent.data.viewPageShow = true;
        };
        $scope.delete = function() {
            var that = this;
            Tools.alert({
                data: {
                    message: '确认删除？',
                },
                success: function() {
                    $http.post(Setting.host + 'note/delete', {note: {id: that.note.id}}).success(function(data) {
                        if (data.result.code == '000000') {
                            
                        }
                    }).error(function(data) {
                    });
                },
                error: function() {

                }
            });
        };
    }
})();

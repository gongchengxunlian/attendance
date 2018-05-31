/**
 * Created by Administrator on 2017-07-07.
 */
//首页控制器
app.controller('schoolListController',['$scope', '$rootScope', '$state', '$uibModal','$http','httpService','localStorageService','SweetAlert',
function($scope, $rootScope, $state, $uibModal,$http,httpService,localStorageService,SweetAlert) {


    //  页面
    $rootScope.menuList = [
        { title: '学校列表' }
    ];
    $scope.bodyTitle = $rootScope.menuList[$rootScope.menuList.length - 1].title;

    $scope.pagination = {
        totalCount: 0,
        currentPage: 1,
        totalPage: 1,
        pageSize: 0,
        pageSizeList: [10, 20, 30]
    };
    $scope.pagination.pageSize = $scope.pagination.pageSizeList[0];
    $scope.pageFields = {
        list: [
            { title: '学校名称', type: 'name', order: 'desc' },
            { title: '学校编号', type: 'code', order: 'desc' },
            { title: '学校详情', type: 'info' }
        ],
        order: 'code',
        __order: false
    };
    //  改变排序
    $scope.setOrder = function (index) {
        if ($scope.pageFields.order == $scope.pageFields.list[index].type){
            $scope.pageFields.__order = !$scope.pageFields.__order;
            $scope.pageFields.__order ? $scope.pageFields.list[index].order = 'asc' : $scope.pageFields.list[index].order = 'desc';
        }else {
            $scope.pageFields.order = $scope.pageFields.list[index].type;
        }
        $scope.queryList();
    };


    // 搜索条件
    $scope.searchOptions = {
        '': '请选择搜索条件',
        name: '学校名称',
        code: '学校编号'
    };
    // 初始化查询条件
    $scope.searchValue = {
        key: '',
        value: ''
    };
    $scope.searchInit = function () {
        $scope.searchValue.value = '';
        $scope.queryList();
    };

    // table信息
    $scope.tableData = [];

    //  查询数据
    $scope.queryList = function () {
        var params = {
            pageSize: $scope.pagination.pageSize,
            pageNo: $scope.pagination.currentPage,
            order: $scope.pageFields.order,
            __order: $scope.pageFields.__order ? 0 : 1
        };
        params[$scope.searchValue.key] = $scope.searchValue.value;

        httpService.getAll('schoolMenage/getAll', params).then(function (data) {
            if (data){
                $scope.tableData = data.data;
                $scope.pagination.pageSize = data.pageSize;
                $scope.pagination.currentPage = data.pageNo;
                $scope.pagination.totalCount = data.totalCount;
                $scope.pagination.totalPage = data.totalPage;
            }else {
                SweetAlert.info("没有学校信息");
                // $scope.tableData = [];
            }
        }, function (result) {
            SweetAlert.error("没有学校信息", '请检查网络...');
        });
    };
    $scope.queryList();

    //  新城数据
    $scope.addData = function () {
        getModel();
    };

    //  编辑数据
    $scope.editData = function (data) {
        getModel(data);
    };

    //  删除数据
    $scope.delData = function(id) {
        var ids = [];
        if (id || id == 0){
            ids.push(id);
        }else {
            if ($scope.select_all){
                for (var i in $scope.tableData){
                    ids.push($scope.tableData[i].id);
                }
            }else {
                for (var i in $scope.tableData){
                    if ($scope.tableData[i].checked) ids.push($scope.tableData[i].id);
                }
            }
        }
        if (ids.length == 0){
            SweetAlert.info("至少选择一项");
            return;
        }

        SweetAlert.swal({
            title: '确认删除所选择的学校全部信息',
            showCancelButton: true,
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'info'
        }, function (c) {
            if (c){
                delData(ids);
            }
        });
    };
    function delData(ids) {
        httpService.delRow('schoolMenage/delRow', {ids: JSON.stringify(ids)}).then(function (data) {
            if (data == 0){
                SweetAlert.error("删除失败");
            }else {
                if (data > 1) {
                    SweetAlert.swal({
                        title: '已删除' + data + "所学校的信息",
                        type: 'info',
                        timer: '3000'
                    });
                }
                $scope.queryList();
            }
        }, function () {
            SweetAlert.error("删除失败", '请检查网络...');
        });
    }
    //  编辑学院
    $scope.editCollegeData = function (data) {
        localStorageService.set("schoolData_collegeSetting", data);
        $state.go('collegeManage', { showAll: 2 });
    };

    function getModel(params) {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'schoolForm.html',
            controller: 'schoolFormController',
            resolve: {
                params: params
            },
            size: 'md'
        }).result.then(function (result) {
            $scope.queryList();
        },function (reason) {
            // $scope.reset();
        });
    }

    $scope.goCollegeMenage = function () {
        $state.go('collegeManage', { showAll: 0 });
    };


}]);
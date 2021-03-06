/**
 * Created by Administrator on 2017-07-07.
 */
//首页控制器
app.controller('classListController',['$scope', '$rootScope', '$state', '$stateParams', '$uibModal','$http','httpService','localStorageService','SweetAlert',
function($scope, $rootScope, $state, $stateParams, $uibModal, $http, httpService, localStorageService, SweetAlert) {


    /**
     * 数据区
     */

    //  传入参数
    if ($rootScope.sign > 0){
        //  直接使用$rootScope中的学校信息
        // $scope.schoolInfo = $rootScope.schoolInfo;
    }else {
        switch ($stateParams.showAll){
            //  刷新
            case 0:{
                $scope.schoolInfo = localStorageService.get("schoolData_classSetting");
                break;
            }
            //  菜单点进来
            case 1:{
                localStorageService.remove("schoolData_classSetting");
                $scope.schoolInfo = undefined;
                break;
            }
            //  从学校跳转进来
            case 2:{
                $scope.schoolInfo = localStorageService.get("schoolData_classSetting");
                break;
            }
            default:{
                $scope.schoolInfo = undefined;
            }
        }
    }

    //  页面
    $rootScope.menuList = [
        { title: '教室列表' }
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
            { title: '教学楼', type: 'buildName' },
            { title: '教室', type: 'className' },
            { title: '分布', type: 'info' }
        ]
    };

    // table信息
    $scope.tableData = [];

    //  绕过权限的返回
    if ($rootScope.sign > 0 && !$scope.schoolInfo) return;

    /**
     * 方法区
     * 下面开始是各种方法
     */


    //  重置搜索条件
    $scope.searchInit = function () {
        $scope.searchValue = '';
        $scope.queryList();
    };

    //  查询数据
    $scope.queryList = function () {
        var params = {
            pageSize: $scope.pagination.pageSize,
            pageNo: $scope.pagination.currentPage,
            searchValue: $scope.searchValue
        };

        httpService.getAll('classManage/getAll', params).then(function (data) {
            if (data){
                $scope.tableData = data.data;
                angular.forEach($scope.tableData, function (value) {
                    value.road = JSON.parse(value.road);
                });
                $scope.pagination.pageSize = data.pageSize;
                $scope.pagination.currentPage = data.pageNo;
                $scope.pagination.totalCount = data.totalCount;
                $scope.pagination.totalPage = data.totalPage;
            }else {
                SweetAlert.info("没有教室信息");
                // $scope.tableData = [];
            }
        }, function (result) {
            SweetAlert.error("没有教室信息", '请检查网络...');
        });
    };
    $scope.queryList();

    //  新城数据
    $scope.addData = function () {
        getModel();
    };

    //  编辑数据
    $scope.editData = function (data, lock) {
        getModel(data, lock);
    };

    $scope.showDis = function (data) {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'classDistribution.html',
            controller: 'classDistributionController',
            size: 'xlg',
            // windowClass: 'distribution-window',
            resolve: {
                dis: {
                    row: data.row,
                    col:data.col,
                    road: data.road,
                    lock: true
                }
            }
        });
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
            title: '确认删除所选择的教室全部信息',
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
        httpService.delRow('classManage/delRow', {ids: JSON.stringify(ids)}).then(function (data) {
            if (data == 0){
                SweetAlert.error("删除失败");
            }else {
                if (data > 1) {
                    SweetAlert.swal({
                        title: '已删除' + data + "所教室的信息",
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


    function getModel(params) {
        params = params || {};

        try {
            params.schoolId = $scope.schoolInfo.id;
            params.schoolName = $scope.schoolInfo.name;
        }catch (e){}

        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'classForm.html',
            controller: 'classFormController',
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


}]);
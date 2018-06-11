/**
 * Created by Administrator on 2017-07-07.
 */
//首页控制器
app.controller('studentANDcourseController',['$scope', '$rootScope', '$state', '$stateParams', '$uibModal','$http','httpService','localStorageService','SweetAlert',
function($scope, $rootScope, $state, $stateParams, $uibModal, $http, httpService, localStorageService, SweetAlert) {


    /**
     * 数据区
     */

    //  页面
    $rootScope.menuList = [
        { title: '教学设置' },
        { title: '学生与课程' }
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
            { title: '学年学期', type: 'yearTerm', order: 'asc' },
            { title: '课程编号', type: 'courseCode', order: 'desc' },
            { title: '课程名称', type: 'courseName', order: 'desc' },
            { title: '任课教师', type: 'teacherName', order: 'desc' },
            { title: '上课时间地点', type: 'whenWhere', order: 'desc' }
        ],
        order: 'yearTerm',
        __order: false
    };

    // 搜索条件
    $scope.searchOptions = {
        '': '请选择搜索条件',
        courseName: '课程名称',
        courseCode: '课程编号',
        // code: '单双周',
        // teacherName: '任课教师'
        // code: '开始周',
    };
    if ($rootScope.sign != 2) $scope.searchOptions.teacherName = '任课教师';
    // 初始化查询条件
    $scope.searchValue = {
        key: '',
        value: ''
    };

    // table信息
    $scope.tableData = [];

    //  绕过权限的返回
    if ($rootScope.sign > 0 && !$scope.schoolInfo) return;

    /**
     * 方法区
     * 下面开始是各种方法
     */


    //  改变排序
    $scope.setOrder = function (index) {
        if ($scope.pageFields.order == $scope.pageFields.list[index].type){
            $scope.pageFields.__order = !$scope.pageFields.__order;
            $scope.pageFields.__order ? $scope.pageFields.list[index].order = 'asc' : $scope.pageFields.list[index].order = 'desc';
        }else {
            $scope.pageFields.order = $scope.pageFields.list[index].type;
        }
        // $scope.queryList();
    };


    //  重置搜索条件
    $scope.searchInit = function () {
        $scope.searchValue.value = '';
        $scope.queryList();
    };

    //  查询数据
    $scope.queryList = function () {
        var params = {
            pageSize: $scope.pagination.pageSize,
            pageNo: $scope.pagination.currentPage,
            order: $scope.pageFields.order,
            __order: $scope.pageFields.__order ? 0 : 1
        };
        params[$scope.searchValue.key] = $scope.searchValue.value;

        if ($rootScope.sign == 2) params.teacherId = $rootScope.userInfo.id;

        httpService.getAll('courseMenage/getAllCourseArrage', params).then(function (data) {
            if (data){
                $scope.tableData = data.data;
                $scope.pagination.pageSize = data.pageSize;
                $scope.pagination.currentPage = data.pageNo;
                $scope.pagination.totalCount = data.totalCount;
                $scope.pagination.totalPage = data.totalPage;
            }else {
                SweetAlert.info("没有课程信息安排");
                // $scope.tableData = [];
            }
        }, function (result) {
            SweetAlert.error("没有课程信息安排", '请检查网络...');
        });
    };
    $scope.queryList();

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
            title: '确认删除所选择的课程全部信息',
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
        httpService.delRow('courseMenage/delRow', {ids: JSON.stringify(ids)}).then(function (data) {
            if (data == 0){
                SweetAlert.error("删除失败");
            }else {
                if (data > 1) {
                    SweetAlert.swal({
                        title: '已删除' + data + "所课程的信息",
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
            templateUrl: 'studentANDcourseForm.html',
            controller: 'studentANDcourseFormController',
            resolve: {
                params: params
            },
            size: 'xlg'
        }).result.then(function (result) {
            $scope.queryList();
        },function (reason) {
            // $scope.reset();
        });
    }


}]);
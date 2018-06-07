/**
 * Created by Administrator on 2017-07-07.
 */
//首页控制器
app.controller('userListController',['$scope', '$rootScope', '$state', '$uibModal','$http','httpService','localStorageService','SweetAlert',
function($scope, $rootScope, $state, $uibModal,$http,httpService,localStorageService,SweetAlert) {


    $scope.sign = $rootScope.userInfo.sign;

    //  页面
    $rootScope.menuList = [
        { title: '用户列表' }
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
    $scope.powerNameOptions = ["数据管理员", "校园数据管理员", "教师", "学生"];
    $scope.pageFields = {
        list: [
            { title: '编号', type: 'code', order: 'desc', titleStyle: {width: '8em'} },
            { title: '姓名', type: 'name', order: 'desc', titleStyle: {width: '8em'}, titleClass: "", cellStyle: {}, cellClass: "", titleClick: undefined, cellClick: undefined, notNgIf: false, notNgShow: false },
            { title: '电子邮箱', type: 'mail', order: 'desc', titleStyle: {width: '8em'} },
            { title: '联系电话', type: 'phone', order: 'desc', titleStyle: {width: '8em'} },
            { title: '角色', type: 'power', order: 'desc', notNgIf: $rootScope.sign > 1, titleStyle: {"width": '9em'} },
            { title: '学校', type: 'schoolName', order: 'desc', notNgIf: $rootScope.sign > 0 },
            { title: '学院', type: 'parentName', order: 'desc', notNgIf: $rootScope.sign > 1 || $rootScope.sign == 0 },
            { title: '系', type: 'collegeName', order: 'desc', notNgIf: $rootScope.sign > 1 || $rootScope.sign == 0 }
        ],
        order: 'power',
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
        // $scope.queryList();
    };


    // 搜索条件
    $scope.searchOptions = {
        '': { name: '请选择搜索条件' },
        name: { name: '姓名' },
        mail: { name: '邮箱' },
        phone: { name: '电话' }
    };
    switch ($rootScope.sign){
        case 0:{
            $scope.searchOptions.code = { name: '编号' };
            $scope.searchOptions.type = { name: '角色', type: 'select' };
            $scope.searchOptions.schoolName = { name: '学校' };
            break;
        }
        case 1:{
            $scope.searchOptions.code = { name: '编号' };
            $scope.searchOptions.type = { name: '角色', type: 'select'};
            $scope.searchOptions.collegeName = { name: '学院' };
            break;
        }
        case 2:{
            $scope.searchOptions.code = { name: '学号' };
            break;
        }
    }
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
        try {
            params.schoolId = $rootScope.schoolInfo.id;
            params.collegeId = $rootScope.schoolInfo.collegeInfo.id;
        }catch (e){}

        httpService.getAll('userManage/getAll', params).then(function (data) {
            if (data){
                $scope.tableData = data.data;
                $scope.pagination.pageSize = data.pageSize;
                $scope.pagination.currentPage = data.pageNo;
                $scope.pagination.totalCount = data.totalCount;
                $scope.pagination.totalPage = data.totalPage;
            }else {
                SweetAlert.info("没有用户信息");
                // $scope.tableData = [];
            }
        }, function (result) {
            SweetAlert.error("没有用户信息", '请检查网络...');
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
            title: '确认删除所选择的用户',
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
        httpService.delRow('userManage/delRow', {ids: JSON.stringify(ids)}).then(function (data) {
            if (data == 0){
                SweetAlert.error("删除失败");
            }else {
                if (data > 1) {
                    SweetAlert.swal({
                        title: '已删除' + data + "所用户的信息",
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
        localStorageService.set("userData_collegeSetting", data);
        $state.go('collegeManage', { showAll: 2 });
    };

    function getModel(params) {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'basicForm.html',
            controller: 'userFormController',
            resolve: {
                params: params
            },
            size: 'lg'
        }).result.then(function (result) {
            $scope.queryList();
        },function (reason) {
            // $scope.reset();
        });
    }



}]);
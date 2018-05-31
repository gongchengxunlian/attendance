/**
 * Created by huhu on 2018/5/3.
 */
app.controller('courseArrangeFormController',['$scope', '$rootScope', '$uibModalInstance', 'params','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModalInstance, params,$http,httpService,localStorageService,$interval,SweetAlert){

    if (params){
        $scope.title = '编辑课程安排';
    }else {
        $scope.title = '新增课程安排';
    }
    $scope.formData = params || [];


    $scope.startWeekOptions = new Array(25);
    $scope.weekOptions = new Array(7);
    $scope.classOptions = new Array(12);
    $scope.weekAndClassIndex = new Array(1);
    $scope.startYearOptions = new Array(5);
    $scope.currentYear = new Date().getFullYear();

    try {
        $scope.weekAndClassIndex = new Array($scope.formData.week.length);
    }catch (e){}

     if (!$scope.formData.week){
         $scope.formData.week = [];
         $scope.formData.classIndex = [];
     }

    /**
     * 加载课程信息
     */
    var url = '/courseMenage/getAll';
    var params = {
        params: {
            schoolId: $rootScope.schoolInfo.id
        }
    };
    $http.get(url, params).success(function (data) {
        if (data) $scope.courseData = data.data;
        else {
            SweetAlert.info("没有课程信息");
            // $scope.dismiss();
            // $scope.tableData = [];
        }
    }).error(function (result) {
        SweetAlert.error("没有课程信息", '请检查网络...');
    });


    /**
     * 加载教师信息
     */
    var params = {
        sign: 2
    };
    httpService.getAll('userManage/getAll', params).then(function (data) {
        if (data){
            $scope.teacherOptions = data.data;
        }else {
            SweetAlert.info("没有用户信息");
            // $scope.dismiss();
            // $scope.tableData = [];
        }
    }, function (result) {
        SweetAlert.error("没有用户信息", '请检查网络...');
    });



    // if (!$scope.formData || !$scope.formData.schoolId){


        // $http.get("/collegeMenage/getSchoolAndCollege", {params: $rootScope.schoolInfo}).success(function (data) {
        //     if ($.type(data) == 'array'){
        //         $scope.schoolAndCollege = data;
        //         if (data.length == 1){
        //             $scope.schoolIndex = 0;
        //         }else {
        //             getSchoolIndex(data);
        //         }
        //     }else {
        //         SweetAlert.error('学校学院加载失败', '系统维护中...');
        //     }
        // }).error(function (result) {
        //     SweetAlert.error('学校加载失败', '系统维护中...');
        // });
    // }

    //  计算schoolIndex
    // function getSchoolIndex(data) {
    //     if (!$scope.formData.schoolId) return;
    //     for (var i in data){
    //         if ($scope.formData.schoolId == data[i].id){
    //             $scope.schoolIndex = i;
    //             $scope.formData.collegeId = $scope.formData.collegeId;
    //             break;
    //         }
    //     }
    // }

    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };


    /**
     * 设置那节课上课
     */
    var setClassIndex;
    $scope.isShowClassIndex = false;
    $scope.showClassIndex = function (index) {
        $scope.isShowClassIndex = true;
        setClassIndex = index;
        if ($scope.formData.classIndex[setClassIndex]) $scope.classIndex = $scope.formData.classIndex[setClassIndex];
    };
    $scope.changeClassIndex = function () {
        $scope.isShowClassIndex = false;
        $scope.formData.classIndex[setClassIndex] = [];
        $.extend(true, $scope.formData.classIndex[setClassIndex], $scope.classIndex);
        $scope.classIndex = [];
        setClassIndex = undefined;
    };

    //  保存
    $scope.saveData = function () {

        // httpService.addRow('courseMenage/addCourse', {params: JSON.stringify($scope.formData)}).then
        // (function (result) {
        //     if (result > 0){
        //         SweetAlert.success('操作成功');
        //         $scope.close(result);
        //     }else {
        //         SweetAlert.error('操作失败');
        //     }
        // }, function (reason) {
        //     SweetAlert.error('操作失败', '系统维护中');
        // });
    };

}]);
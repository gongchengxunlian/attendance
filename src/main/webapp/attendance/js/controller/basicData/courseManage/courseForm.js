/**
 * Created by huhu on 2018/5/3.
 */
app.controller('courseFormController',['$scope', '$rootScope', '$uibModalInstance', 'params','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModalInstance, params,$http,httpService,localStorageService,$interval,SweetAlert){

    if (params){
        $scope.title = '编辑课程信息';
    }else {
        $scope.title = '新增课程信息';
    }
    $scope.formData = params || [];

    console.log($scope.formData);

    $scope.startWeekOptions = new Array(20);
    $scope.weekOptions = new Array(7);
    $scope.classOptions = new Array(12);
    $scope.weekAndClassIndex = new Array(1);
    try {
        $scope.weekAndClassIndex = new Array($scope.formData.week.length);
    }catch (e){}

     if (!$scope.formData.week){
         $scope.formData.week = [];
         $scope.formData.classIndex = [];
     }

    // if (!$scope.formData || !$scope.formData.schoolId){


        $http.get("/collegeManage/getSchoolAndCollege", {params: $rootScope.schoolInfo}).success(function (data) {
            if ($.type(data) == 'array'){
                $scope.schoolAndCollege = data;
                if (data.length == 1){
                    $scope.schoolIndex = 0;
                }else {
                    getSchoolIndex(data);
                }
            }else {
                SweetAlert.error('学校学院加载失败', '系统维护中...');
            }
        }).error(function (result) {
            SweetAlert.error('学校加载失败', '系统维护中...');
        });
    // }

    //  计算schoolIndex
    function getSchoolIndex(data) {
        if (!$scope.formData.schoolId) return;
        for (var i in data){
            if ($scope.formData.schoolId == data[i].id){
                $scope.schoolIndex = i;
                $scope.formData.collegeId = $scope.formData.collegeId;
                break;
            }
        }
    }

    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };


    //  保存
    $scope.saveData = function () {

        httpService.addRow('courseMenage/addCourse', {params: JSON.stringify($scope.formData)}).then
        (function (result) {
            if (result > 0){
                SweetAlert.success('操作成功');
                $scope.close(result);
            }else {
                SweetAlert.error('操作失败');
            }
        }, function (reason) {
            SweetAlert.error('操作失败', '系统维护中');
        });
    };

}]);
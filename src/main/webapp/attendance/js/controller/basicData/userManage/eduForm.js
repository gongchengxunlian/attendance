/**
 * Created by huhu on 2018/5/3.
 */
app.controller('userEduFormController',['$scope', '$rootScope', '$uibModalInstance', 'params','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModalInstance, params,$http,httpService,localStorageService,$interval,SweetAlert){

    if (params){
        $scope.title = '编辑用户教育信息';
    }else {
        $scope.title = '新增用户教育信息';
    }
    $scope.formData = params || {};

    $scope.powerOptions = [
        // { sign: '1', name: '校园数据管理员' },
        { sign: '2', name: '教师' },
        { sign: '3', name: '学生' }
    ];
    $scope.formData.power = ''+$scope.formData.power || '3';

    $scope.schoolAndCollege = [];

    getSchoolAndCollege();
    function getSchoolAndCollege() {
        $http.get("/collegeMenage/getSchoolAndCollege", {params: $rootScope.schoolInfo}).success(function (data) {
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
    }

    //  计算schoolIndex
    function getSchoolIndex(data) {
        if (!$scope.formData.sid) return;
        for (var i in data){
            if ($scope.formData.sid == data[i].id){
                $scope.schoolIndex = i;
                $scope.formData.collegeId = $scope.formData.cid;
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
        try {
            $scope.formData.schoolId = $scope.schoolAndCollege[$scope.schoolIndex].id;
        }catch (e){
            SweetAlert.error('操作失败');
            $scope.close();
            return;
        }
        httpService.addRow('userManage/addUserEdu', $scope.formData).then
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
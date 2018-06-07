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

    $scope.schoolName = $scope.formData.schoolName;
    $scope.parentName = $scope.formData.parentName || $scope.formData.collegeName;
    $scope.collegeName = $scope.formData.collegeName;

    // if (!$scope.formData || !$scope.formData.schoolId){


    $http.get("/collegeManage/getSchoolAndCollege", {params: $rootScope.schoolInfo}).success(function (data) {
        if ($.type(data) == 'array'){
            $scope.schoolAndCollege = data;
            if (data.length == 1){
                $scope.school_index = 0;
            }
            try {
                $scope.nameChange($scope.schoolName, data, 'school');
                $scope.nameChange($scope.parentName, data[$scope.school_index].data, 'parent');
                $scope.nameChange($scope.collegeName, data[$scope.school_index].data[$scope.parent_index].children, 'college');
            }catch (e){  }
        }else {
            SweetAlert.error('数据加载失败', '系统维护中...');
        }
    }).error(function (result) {
        SweetAlert.error('数据加载失败', '系统维护中...');
    });

    $scope.nameChange = function (name, data, type) {
        try {
            angular.forEach(data, function (d, index) {
                var dataName = 'name';
                if (type == 'school') dataName = 'schoolName';
                if (d[dataName] == name){
                    $scope[type + '_index'] = index;
                    throw "";
                }
            });
            $scope[type + '_index'] = -1;
        }catch (e){  }
    };

    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };


    //  保存
    $scope.saveData = function () {
        $scope.formData.collegeId = null;
        try {
            $scope.formData.collegeId = $scope.schoolAndCollege[$scope.school_index].data[$scope.parent_index].id;
            $scope.formData.collegeId = $scope.schoolAndCollege[$scope.school_index].data[$scope.parent_index].children[$scope.college_index].id;
        }catch (e){
            if (!$scope.formData.collegeId){
                SweetAlert.error('填写正确的院系');
                return;
            }
        }

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
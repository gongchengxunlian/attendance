/**
 * Created by huhu on 2018/5/3.
 */
app.controller('collegeFormController',['$scope', '$rootScope', '$uibModalInstance', 'params','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModalInstance, params,$http,httpService,localStorageService,$interval,SweetAlert){

    if (params){
        $scope.title = '编辑学院信息';
    }else {
        $scope.title = '新增学院信息';
    }
    $scope.formData = params;

    if (!$scope.formData || !$scope.formData.schoolId){
        $scope.showSchool = true;

        httpService.getAll('schoolMenage/getAll').then(function (data) {
            if (data){
                $scope.schoolData = data.data;
            }else {

                SweetAlert.info("没有学校信息");
                $scope.dismiss();
                // $scope.tableData = [];
            }
        }, function (result) {
            SweetAlert.error("没有学校信息", '请检查网络...');
            $scope.dismiss();
        });
    }



    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };


    //  保存
    $scope.saveData = function () {
        httpService.addRow('collegeManage/addCollege', $scope.formData).then
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
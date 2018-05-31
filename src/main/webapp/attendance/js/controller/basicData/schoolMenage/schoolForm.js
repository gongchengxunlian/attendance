/**
 * Created by huhu on 2018/5/3.
 */
app.controller('schoolFormController',['$scope', '$rootScope', '$uibModalInstance', 'params','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModalInstance, params,$http,httpService,localStorageService,$interval,SweetAlert){

    if (params){
        $scope.title = '编辑学校信息';
    }else {
        $scope.title = '新增学校信息';
    }
    $scope.formData = params || {};

    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };


    //  保存
    $scope.saveData = function () {
        httpService.addRow('schoolMenage/addSchool', $scope.formData).then
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
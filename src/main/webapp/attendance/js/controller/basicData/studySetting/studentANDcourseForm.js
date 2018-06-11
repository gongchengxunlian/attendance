/**
 * Created by huhu on 2018/5/3.
 */
app.controller('studentANDcourseFormController',['$scope', '$rootScope', '$uibModalInstance', 'params','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModalInstance, params,$http,httpService,localStorageService,$interval,SweetAlert){

    $scope.title = '设置学生';

    $scope.formData = params || [];

    $scope.title = '为课程 ' + $scope.formData.courseName + " ";

    $scope.studentOptions = {};

    // console.log($scope.formData);

    httpService.getAll('studySetting/getSaveStudentAndCourse', {id: $scope.formData.id}).then(function (data) {
        if (data){
            $scope.studentOptions = data.studentId || {};

            httpService.getAll('userManage/getAll', {pageSize: 0, pageNo: 1, type: 3, myOrder: name}).then(function (data) {
                if (data){
                    $scope.tableData = data.data;
                    // console.log($scope.tableData);
                }else {
                    SweetAlert.info("网络异常", '请检查网络...');
                    // $scope.tableData = [];
                }
            }, function (result) {
                SweetAlert.error("网络异常", '请检查网络...');
            });

        }else {
            SweetAlert.info("网络异常", '请检查网络...');
            // $scope.tableData = [];
        }
    }, function (result) {
        SweetAlert.error("网络异常", '请检查网络...');
    });


    //  保存
    $scope.saveData = function () {

        $scope.form = {
            id: $scope.formData.id,
            studentId: $scope.studentOptions
        };

        httpService.addRow('studySetting/saveStudentAndCourse', {params: JSON.stringify($scope.form)}).then
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

    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };

}]);
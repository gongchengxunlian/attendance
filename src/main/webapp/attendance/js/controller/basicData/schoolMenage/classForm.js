/**
 * Created by huhu on 2018/5/3.
 */
app.controller('classFormController',['$scope', '$rootScope', '$uibModal', '$uibModalInstance', 'params','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModal, $uibModalInstance, params,$http,httpService,localStorageService,$interval,SweetAlert){

    if (params){
        $scope.title = '编辑教室信息';
    }else {
        $scope.title = '新增教室信息';
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
        if (!$scope.formData.row || !$scope.formData.col){
            SweetAlert.error('请设置教室分布', '');
            return;
        }
        httpService.addRow('classManage/addClass', {params: JSON.stringify($scope.formData)}).then
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

    $scope.openSetDist = function () {
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
                    row: $scope.formData.row,
                    col: $scope.formData.col,
                    road: $scope.formData.road
                }
            }
        }).result.then(function (result) {
            $scope.formData.row = result.row;
            $scope.formData.col = result.col;
            $scope.formData.road = result.road;
            // console.log(result);
            // $scope.queryList();
        },function (reason) {
            // $scope.reset();
        });
    };

}]);
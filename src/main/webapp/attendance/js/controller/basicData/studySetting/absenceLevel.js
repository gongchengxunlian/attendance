/**
 * Created by Administrator on 2017-07-07.
 */
//首页控制器
app.controller('absenceLevelController',['$scope', '$rootScope', '$state', '$stateParams', '$uibModal','$http','httpService','localStorageService','SweetAlert', '$timeout',
function($scope, $rootScope, $state, $stateParams, $uibModal, $http, httpService, localStorageService, SweetAlert, $timeout) {


    //  页面
    $rootScope.menuList = [
        { title: '缺课等级设置' }
    ];
    $scope.bodyTitle = $rootScope.menuList[$rootScope.menuList.length - 1].title;

    $scope.levelOptions = [];

    $scope.edit = false;

    $scope.$watch('levelOptions', function (p1, p2, p3) {
        if (p1 == p2) return;
        if ($scope.edit == false) $scope.edit = true;
    }, true);

    //  查询数据
    $scope.queryList = function () {

        httpService.getAll('studySetting/getAbsenceLevel').then(function (data) {
            if (data){

                $scope.levelOptions = data;

                console.log(data);
            }else {
                SweetAlert.info("未设置缺课等级");
                // $scope.tableData = [];
            }

            $timeout(function () {
                $scope.edit = false;
            });
        }, function (result) {
            SweetAlert.error("网络异常", '请检查网络...');
        });
    };
    $scope.queryList();

    $scope.saveData = function () {
        var data = $scope.levelOptions;

        httpService.addRow('studySetting/saveAbsenceLevel', {params: JSON.stringify(data)}).then(function (data) {
            if (data > 0) {

                $scope.queryList();

            }else {
                SweetAlert.error('保存失败', '请检查网络');
            }
        }, function () {
            SweetAlert.error('保存失败', '请检查网络');
        });

    };


}]);
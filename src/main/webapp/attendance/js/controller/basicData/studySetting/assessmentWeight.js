/**
 * Created by Administrator on 2017-07-07.
 */
//首页控制器
app.controller('assessmentWeightController',['$scope', '$rootScope', '$state', '$stateParams', '$uibModal','$http','httpService','localStorageService','SweetAlert', '$timeout',
function($scope, $rootScope, $state, $stateParams, $uibModal, $http, httpService, localStorageService, SweetAlert, $timeout) {


    /**
     * 数据区
     */

    //  页面
    $rootScope.menuList = [];
    if ($rootScope.sign == 0) $rootScope.menuList.push({title: '考核权重模板设置'});
    else if($rootScope.sign == 1) $rootScope.menuList.push({title: '考核权重设置'});
    else history.back();

    $scope.bodyTitle = $rootScope.menuList[$rootScope.menuList.length - 1].title;

    $scope.templateOptions = [];

    $scope.edit = false;

    $scope.$watch('templateOptions', function (newValue, oldValue, scope) {
        if (oldValue == newValue) return;
        if (!$scope.edit) $scope.edit = true;
    }, true);

    $scope.templateReadOnly = ($rootScope.sign == 0 ? false : true);


    //  查询数据
    $scope.queryList = function () {

        httpService.getAll('studySetting/getTemplateData').then(function (data) {

            $scope.templateOptions = data || [];
            $timeout(function () {
                $scope.edit = false;
            });

        }, function () {
            SweetAlert.error('数据加载失败', '请检查网络');
        })

    };
    $scope.queryList();

    $scope.saveData = function () {
        var data = [];
        $.extend(true, data, $scope.templateOptions);
        for (var i in data){
            delete data[i].$$hashKey;
            for (var j in data[i].value){
                delete data[i].value[j].$$hashKey;
            }
        }
        httpService.addRow('studySetting/saveTemplateData', {params: JSON.stringify(data)}).then(function (data) {
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
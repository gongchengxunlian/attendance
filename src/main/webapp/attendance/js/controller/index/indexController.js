/**
 * Created by Administrator on 2017-07-07.
 */
//首页控制器
app.controller('indexController',['$scope', '$uibModal', '$rootScope', '$http', 'localStorageService', '$interval', 'SweetAlert', 'httpService',
    function($scope, $uibModal, $rootScope, $http, localStorageService, $interval, SweetAlert, httpService){


    /**
     * 用户信息
     * @type {{sign: number}} 权限 0 总数据管理员, 1 学校数据管理员, 2 教师, 3 学生
     */
    $rootScope.userInfo = $rootScope.userInfo || localStorageService.get("userInfo");
    if (!$rootScope.userInfo){
        $scope.userLogout();
    }

    /**
     * 学校信息
     * @type {{}}
     */
    $rootScope.schoolInfo = $rootScope.schoolInfo || localStorageService.get("schoolInfo") || {};
    /*$rootScope.schoolInfo = {
        id: 9,
        data: {
            cid: 12
        }
    };*/
    /**
     * 菜单权限
     */
    $rootScope.sign = $rootScope.userInfo.sign;
    // $rootScope.userRole = {
    //     0: '数据管理员',
    //     1: '学校管理员',
    //     2: '教师',
    //     3: '学生'
    // };

    $scope.setSchoolStartTime = function () {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'schoolTimeSettingForm.html',
            controller: 'schoolTimeSettingFormController',
            size: 'sm'
        }).result.then(function (result) {
            console.log(result);
        },function (reason) {
            // $scope.reset();
            // console.log(reason);
            httpService.addRow('schoolMenage/setSchoolStartTime', {startTime: reason.getTime()}).then(function(data){
                if (data){
                    SweetAlert.success('设置成功');
                }else {
                    SweetAlert.error('设置失败', '网络异常');
                }
            }, function () {
                SweetAlert.error('设置失败', '网络异常');
            });
        });
    };

    var windowWidth = window.innerWidth;
    if ($rootScope.sign == 2 || $rootScope.sign == 3){
        if (windowWidth < 767) location.href = '/attendance/#/studentSignIn';
    }




    /**
     * 登出
     */
    $rootScope.userLogout = function () {
        localStorageService.clearAll();
        window.location.href = '/#login';
    };

}]);
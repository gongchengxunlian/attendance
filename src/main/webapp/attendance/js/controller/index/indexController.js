/**
 * Created by Administrator on 2017-07-07.
 */
//首页控制器
app.controller('indexController',['$scope', '$rootScope', '$http', 'localStorageService', '$interval', 'SweetAlert',function($scope, $rootScope, $http, localStorageService, $interval, SweetAlert){


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

    /**
     * 登出
     */
    $scope.userLogout = function () {
        localStorageService.clearAll();
        window.location.href = '/#login';
    };

}]);

//首页控制器
app.controller('studentSignInController',['$scope', '$rootScope', '$state', '$stateParams', '$uibModal','$http','httpService','localStorageService','SweetAlert',
function($scope, $rootScope, $state, $stateParams, $uibModal, $http, httpService, localStorageService, SweetAlert) {


    $scope.queryList = function () {
        var params = {
            pageSize: 0,
            pageNo: 0
        };
        if ($rootScope.sign == 2){
            params.teacherId = $rootScope.userInfo.id
        }else if ($rootScope.sign == 3){
            params.student_id = $rootScope.userInfo.id
        }

        httpService.getAll('courseMenage/getAllCourseArrage', params).then(function (data) {
            if (data){
                $scope.tableData = data.data;
            }else {
                SweetAlert.info("没有课程信息安排");
                // $scope.tableData = [];
            }
        }, function (result) {
            SweetAlert.error("没有课程信息安排", '请检查网络...');
        });
    };
    $scope.queryList();

    $scope.showDetail = function (data) {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'classDistribution2.html',
            controller: 'studentSignInClassController',
            size: 'xlg',
            // windowClass: 'distribution-window',
            resolve: {
                data: {
                    data: data
                }
            }
        }).result.then(function (result) {
            console.log(result);
            $scope.queryList();
        },function (reason) {
            $scope.queryList();
            // $scope.reset();
        });
    };

    $scope.showOne = function () {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'studentListCollect.html',
            controller: 'studentListCollectController',
            size: 'xlg',
            // windowClass: 'distribution-window',
            resolve: {
                data: {
                    // data: data
                }
            }
        }).result.then(function (result) {
            console.log(result);
            // $scope.queryList();
        },function (reason) {
            $scope.queryList();
            // $scope.reset();
        });
    };

    $scope.showClass = function () {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'classListCollect.html',
            controller: 'classListCollectController',
            size: 'xlg',
            // windowClass: 'distribution-window',
            resolve: {
                data: {
                    // data: data
                }
            }
        }).result.then(function (result) {
            console.log(result);
            // $scope.queryList();
        },function (reason) {
            $scope.queryList();
            // $scope.reset();
        });
    };

}]);
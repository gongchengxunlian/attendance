/**
 * Created by huhu on 2018/5/3.
 */
app.controller('classListCollectController',['$scope', '$rootScope', 'data', '$uibModal', '$uibModalInstance','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, data, $uibModal, $uibModalInstance,$http,httpService,localStorageService,$interval,SweetAlert){

    // console.log(dis);
    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };

    console.log(data, 'studentListController');
    $scope.classOptions = [];

    httpService.getAll('attendanceManagement/getClassCollect').then(function (data) {
        if (data){
            $scope.classOptions = data;
            console.log(data, 'getClassCollect');
        }else {
            console.log('没有统计');
        }

    }, function (result) {
        console.log(result);
    });


}]);
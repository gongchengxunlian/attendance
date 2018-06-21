/**
 * Created by huhu on 2018/5/3.
 */
app.controller('studentListCollectController',['$scope', '$rootScope', 'data', '$uibModal', '$uibModalInstance','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, data, $uibModal, $uibModalInstance,$http,httpService,localStorageService,$interval,SweetAlert){

    // console.log(dis);
    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };

    data.data = data.data || {};
    console.log(data.data, 'studentListCollectController');
    $scope.studentStudyInfo = data.studentStudyInfo;

    httpService.getAll('attendanceManagement/getOneCollect', {course_id: data.data.courseId}).then(function (data) {
        if (data){
            $scope.studentOptions = data;
            console.log(data, 'getOneCollect');
        }else {
            console.log('没有学生');
        }

    }, function (result) {
        console.log(result);
    });


}]);
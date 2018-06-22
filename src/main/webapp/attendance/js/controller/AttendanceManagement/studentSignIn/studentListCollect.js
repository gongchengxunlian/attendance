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

    httpService.getAll('attendanceManagement/getOneCollect', {course_id: data.data.courseId, school_id: $rootScope.schoolInfo.id}).then(function (data) {
        if (data){
            $scope.studentOptions = data;
            $scope.studentMaxStudyDay = 0;
            for (var i in $scope.studentOptions.attendanceCollect){
                var d = $scope.studentOptions.attendanceCollect[i];
                if ($scope.studentMaxStudyDay < d.studyDay) $scope.studentMaxStudyDay = d.studyDay;
            }
            console.log(data, 'getOneCollect');
        }else {
            console.log('没有学生');
        }

    }, function (result) {
        console.log(result);
    });

    $scope.setClassForStudent = function (student) {
        console.log(student);
        var levels = $scope.studentOptions.levels;
        var l = -1;
        for (var i in levels){
            var level = levels[i];
            if ($scope.studentMaxStudyDay - student.studyDay >= level.minValue) {
                l = i;
                break;
            }
        }
        try {
            student.level = levels[l];
        }catch (e){}

    };


}]);
/**
 * Created by huhu on 2018/5/3.
 */
app.controller('studentSignInClassController',['$scope', '$rootScope', '$timeout', 'data', '$uibModal', '$uibModalInstance','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $timeout, data, $uibModal, $uibModalInstance,$http,httpService,localStorageService,$interval,SweetAlert){

    console.log(data.data, 'studentSignInClassController');

    var dis = {};
    $scope.road = dis.road || [];

    $scope.student = [];
    $scope.position = [];

    $scope.studentIds = {};
    $scope.studentArrange = {};
    $scope.studentStudyInfo = {};


    function getBasicData() {
        httpService.getAll('classManage/getAll', {classId: data.data.classId}).then(function (data) {
            if (data){
                dis = data.data[0] || {};
                dis.road = JSON.parse(dis.road);

                $scope.lock = dis.lock || false;
                $scope.set_row = dis.row || 5;
                $scope.set_col = dis.col || 5;
                $scope.rowArray = new Array($scope.set_row);
                $scope.colArray = new Array($scope.set_col + 1);
                $scope.road = dis.road || [];

            }else {
                console.log('没有拿到班级');
            }

        }, function (result) {
            console.log(result);
        });

        httpService.getAll('attendanceManagement/getAttendance', {id: data.data.id}).then(function (data) {
            if (data){
                console.log(data, "getAttendance");
                for (var i in data){
                    var studentId = data[i].studentId,
                        position = JSON.parse(data[i].position);
                    var col = position.col,
                        row = position.row;
                    if (!$scope.studentIds[row]){
                        $scope.studentIds[row] = {};
                    }
                    $scope.studentIds[row][col] = studentId;
                    $scope.studentArrange[studentId] = position;
                    $scope.studentStudyInfo[studentId] = {
                        studyDay: data[i].studyDay
                    };
                    if (!$scope.studentStudyInfo[-1]){
                        $scope.studentStudyInfo[-1] = {
                            studyDay: 0
                        };
                    }
                }

            }else {
                console.log('获得座位失败', data);
            }

        }, function (result) {
            console.log(result);
        });
    }
    getBasicData();


    //  点击设置道路
    $scope.setRoad = function (event, row, col) {
        if (!$scope.isBeginClass) return;
        // console.log(row, col, "setRoad", $scope.studentIds[row][col]);

        var index = -1;
        for (var i in $scope.road){
            var road = $scope.road[i];
            if (road.x == row && road.y == col){
                index = i;
                break;
            }
        }
        if (index != -1) return;

        if ($scope.studentIds[row] && $scope.studentIds[row][col]){
            if ($rootScope.sign == 2){
                $scope.openOperations = {
                    open: true,
                    row: row,
                    col: col,
                    studentId: $scope.studentIds[row][col]
                };
            }else{
                SweetAlert.error("不能选择该座位", "该座位有人了，请找老师调节");
                return;
            }
        }else {
            if ($rootScope.sign == 2) {
                $scope.openStudent(row, col);
            }else if ($rootScope.sign == 3){
                var data = {
                    studentId: $rootScope.userInfo.id
                };
                setStudent(row, col, data);
                saveData();
            }
        }

    };

    $scope.clearStudent = function(row, col) {
        var form = {
            id: data.data.id,
            studentIds: [{
                studentId: $scope.studentIds[row][col],
                position: {}
            }]
        };
        httpService.addRow('attendanceManagement/cancelAttendance', {params: JSON.stringify(form)}).then(function (data) {
            if (data){
                console.log(data)
            }else {
                console.log('保存失败', data);
            }

        }, function (result) {
            console.log(result);
        });
        delete $scope.studentArrange[$scope.studentIds[row][col]];
        delete $scope.studentIds[row][col];
        return 1;
    };

    $scope.openStudent = function(row, col) {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'studentList.html',
            controller: 'studentListController',
            size: 'xlg',
            // windowClass: 'distribution-window',
            resolve: {
                data: {
                    courseId: data.data.courseId,
                    studentStudyInfo: $scope.studentStudyInfo
                }
            }
        }).result.then(function (data) {
            setStudent(row, col, data);
        },function (reason) {
            // $scope.reset();
        });
        return 1;
    };

    function setStudent(row, col, data) {
        if (!$scope.studentIds[row]) $scope.studentIds[row] = {};
        if ($scope.studentArrange[data.studentId]){
            delete $scope.studentIds[$scope.studentArrange[data.studentId].row][$scope.studentArrange[data.studentId].col];
            delete $scope.studentArrange[data.studentId];
        }

        $scope.studentIds[row][col] = data.studentId;
        $scope.studentArrange[data.studentId] = {row: row, col: col};
    }

    $scope.setClass = function (row, col) {
        var myClass = (col == 0 ? 'distribution-col-title' : '');
        var index = -1;
        for (var i in $scope.road){
            var road = $scope.road[i];
            if (road.x == row && road.y == col){
                index = i;
                break;
            }
        }
        if (index != -1) myClass += ' distribution-cell-road';
        try {
            if ($scope.studentIds[row][col]){
                myClass += ' distribution-cell-student';
            }
        }catch (e){}
        return myClass;
    };
    
    function saveData() {
        // console.log($scope.studentIds, $scope.studentArrange);
        var form = {
            id: data.data.id
        };
        var studentIds = [];
        for (var studentId in $scope.studentArrange){
            studentIds.push({
                studentId: studentId,
                position: $scope.studentArrange[studentId]
            });
        }
        form.studentIds = studentIds;


        // form
        httpService.addRow('attendanceManagement/saveData', {params: JSON.stringify(form)}).then(function (data) {
            if (data){
                if (data % 2 == 0) console.log("保存成功");
                else console.log("保存失败", data);
            }else {
                console.log('保存失败', data);
            }

        }, function (result) {
            console.log(result);
        });
    }

    $scope.isBeginClass = data.data.begin;
    $scope.beginClass = function () {
        SweetAlert.swal({
            title: '开始上课',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定！",
            cancelButtonText: "取消！"
        }, function (is) {
            if (is){
                $scope.isBeginClass = true;
                httpService.addRow('courseMenage/beginClass', {id: data.data.id, begin: 1}).then(function (data) {
                    if (data){
                        getBasicData();
                        $scope.isBeginClass = true;
                    }else {
                        console.log('网络不好', data);
                    }
                }, function (result) {
                    console.log(result);
                });
            }
            }
        );
    };
    $scope.stopClass = function () {
        SweetAlert.swal({
            title: '下课',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定！",
            cancelButtonText: "取消！"
        }, function (is) {
            if (is){
                $scope.isBeginClass = false;
                httpService.addRow('courseMenage/beginClass', {id: data.data.id, begin: 0}).then(function (data) {
                    if (data){
                        getBasicData();
                    }else {
                        console.log('网络不好', data);
                    }
                }, function (result) {
                    console.log(result);
                });
            }
        });
    };

    $scope.addScore = function (studentId) {
        console.log(studentId);

        SweetAlert.swal({
            title: '加减分',
            type: 'input',
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定！",
            cancelButtonText: "取消！",
            closeOnConfirm: false,
            inputPlaceholder: "输入加分值，负数为减分"
        }, function (is) {
            var value = 0;
            if (is){
                if (value = parseFloat(is)){
                    httpService.addRow('userManage/addScore', {studentId: studentId, value: value}).then(function (data) {
                        if (data){
                            console.log(data);
                        }else {
                            console.log('网络不好', data);
                        }
                    }, function (result) {
                        console.log(result);
                    });
                }else {
                    SweetAlert.showInputError("输入不等于0的数字！");
                    return false;
                }
            }
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
                    data: data.data
                }
            }
        }).result.then(function (result) {
            console.log(result);
            // $scope.queryList();
        },function (reason) {
            // $scope.queryList();
            // $scope.reset();
        });
    };

    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        if ($rootScope.sign == 2) saveData();
        $uibModalInstance.dismiss(data);
    };


}]);
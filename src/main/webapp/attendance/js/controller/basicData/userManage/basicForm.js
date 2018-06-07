/**
 * Created by huhu on 2018/5/3.
 */
app.controller('userFormController',['$scope', '$rootScope', '$uibModal', '$uibModalInstance', 'params','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModal, $uibModalInstance, params, $http,httpService,localStorageService,$interval,SweetAlert){

    if (params){
        $scope.title = '编辑用户基本信息';
    }else {
        $scope.title = '新增用户基本信息';
    }
    $scope.formData = params || {};

    $scope.formData.birthday = $scope.formData.birthday ? new Date($scope.formData.birthday) : new Date();
    $scope.formData.sex = $scope.formData.sex || 0;

    $scope.formData.birthday.setFullYear($scope.formData.birthday.getFullYear() - 10);
    $scope.birthdayOptions = {
        config: {
            defaultDate: $scope.formData.birthday,
            maxDate: $scope.formData.birthday,
            minDate: null,
            buttonBar: {
                today: {
                    show: false
                },
                clear: {
                    text: '清除'
                },
                close: {
                    text: '关闭'
                },
                default: {
                    text: '默认',
                    show: true
                }
            }
        },
        openEvent: function(){
            $scope.birthdayOptions.open = true
        },
        open: false,
        // buttonBar: undefined
    };


    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };

    $scope.saveDataAndContinue = function () {
        // $scope.continue = true;
        $scope.saveData();
    };


    if (params){
        $scope.edutitle = '编辑用户教育信息';
    }else {
        $scope.edutitle = '新增用户教育信息';
    }
    // $scope.formData = params || {};

    $scope.powerOptions = [
        { sign: 0, name: '数据管理员' },
        { sign: 1, name: '校园数据管理员' },
        { sign: 2, name: '教师' },
        { sign: 3, name: '学生' }
    ];
    $scope.formData.power = $scope.formData.power || 3;

    $scope.schoolAndCollege = [];

    // getSchoolAndCollege();
    // function getSchoolAndCollege() {

        $http.get("/collegeManage/getSchoolAndCollege").success(function (data) {
            if ($.type(data) == 'array'){
                $scope.schoolAndCollege = data;
                try {
                    $scope.nameChange($scope.schoolName, data, 'school');
                    if (data.length == 1){
                        $scope.school_index = 0;
                    }
                    $scope.nameChange($scope.parentName, data[$scope.school_index].data, 'parent');
                    $scope.nameChange($scope.collegeName, data[$scope.school_index].data[$scope.parent_index].children, 'college');
                }catch (e){  }
            }else {
                SweetAlert.error('加载数据失败', '系统维护中...');
            }
        }).error(function (result) {
            SweetAlert.error('加载数据失败', '系统维护中...');
        });
    // }

    $scope.nameChange = function (name, data, type) {
        try {
            angular.forEach(data, function (d, index) {
                var dataName = 'name';
                if (type == 'school') dataName = 'schoolName';
                if (d[dataName] == name){
                    $scope[type + '_index'] = index;
                    throw "";
                }
            });
            $scope[type + '_index'] = -1;
        }catch (e){  }
    };

    //  计算formData.schoolIndex
    function getSchoolIndex(data) {
        if (!$scope.formData.sid) return;
        for (var i in data){
            if ($scope.formData.sid == data[i].id){
                $scope.formData.schoolIndex = i;
                $scope.formData.collegeId = $scope.formData.cid;
                break;
            }
        }
    }

    //  保存
    $scope.saveData = function () {

        $scope.formData.schoolId = null;
        $scope.formData.collegeId = null;
        try {
            $scope.formData.schoolId = $scope.schoolAndCollege[$scope.school_index].schoolId;
            $scope.formData.collegeId = $scope.schoolAndCollege[$scope.school_index].data[$scope.parent_index].id;
            $scope.formData.collegeId = $scope.schoolAndCollege[$scope.school_index].data[$scope.parent_index].children[$scope.college_index].id;
        }catch (e){
            if ((($rootScope.sign == 0 && $scope.formData.power <= 2) && !$scope.formData.schoolId) || (($scope.college_index || $scope.college_index === 0) && !$scope.formData.collegeId)){
                SweetAlert.error('填写正确的学校信息');
                return;
            }
        }
        console.log($scope.schoolAndCollege, $scope.school_index);
        var formData = {};
        formData = $.extend(true, formData, $scope.formData);
        formData.birthday = formData.birthday.getTime();

        httpService.addRow('userManage/addUserEdu', formData).then
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


}]);
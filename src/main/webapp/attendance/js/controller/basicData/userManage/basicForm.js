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

    //  保存
    /*$scope.saveData = function () {

        try {
            var formData = {};
            $.extend(true, formData, $scope.formData);
            formData.birthday = formData.birthday.getTime();
        }catch (e){}

        getModel(formData);
        // $scope.dismiss(formData);

        /!*httpService.addRow('userManage/addUserBasic', formData).then
        (function (result) {
            if ($.type(result) == 'object'){
                // if ($scope.continue){
                    result.userId = result.id;
                    delete result.id;
                    getModel(result);
                    $scope.dismiss(result);
                // }else {
                //     SweetAlert.error('操作成功');
                //     $scope.close(result);
                // }
            }else if(result > 0) {

            }else {
                SweetAlert.error('操作失败');
            }
        }, function (reason) {
            SweetAlert.error('操作失败', '系统维护中');
        });*!/
    };*/

    // $scope.saveDataAndExit = function () {
        // $scope.continue = false;
        // document.userBaseForm.submit();
    // };

    $scope.saveDataAndContinue = function () {
        // $scope.continue = true;
        $scope.saveData();
    };

    /*function getModel(params) {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'eduForm.html',
            controller: 'userEduFormController',
            resolve: {
                params: params
            },
            size: 'md'
        }).result.then(function (result) {
            $scope.close(result);
        },function (reason) {
            // $scope.reset();
        });
    }*/









    if (params){
        $scope.edutitle = '编辑用户教育信息';
    }else {
        $scope.edutitle = '新增用户教育信息';
    }
    // $scope.formData = params || {};

    $scope.powerOptions = [
        { sign: 1, name: '校园数据管理员' },
        { sign: 2, name: '教师' },
        { sign: 3, name: '学生' }
    ];
    $scope.formData.power = $scope.formData.power || 3;

    $scope.schoolAndCollege = [];

    getSchoolAndCollege();
    function getSchoolAndCollege() {

        $http.get("/collegeManage/getSchoolAndCollege", {params: {id: $rootScope.schoolInfo.id}}).success(function (data) {
            if ($.type(data) == 'array'){
                $scope.schoolAndCollege = data;
                if (data.length == 1){
                    $scope.formData.schoolIndex = 0;
                    try {
                        $scope.formData.collegeId = $rootScope.schoolInfo.collegeInfo.id;
                    }catch (e){}
                }else {
                    getSchoolIndex(data);
                }
            }else {
                SweetAlert.error('学校学院加载失败', '系统维护中...');
            }
        }).error(function (result) {
            SweetAlert.error('学校加载失败', '系统维护中...');
        });
    }

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


    /*$scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };*/


    //  保存
    $scope.saveData = function () {

        try {
            $scope.formData.schoolId = $scope.schoolAndCollege[$scope.formData.schoolIndex].id;
        }catch (e){
            SweetAlert.error('操作失败');
            // $scope.close();
            return;
        }
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
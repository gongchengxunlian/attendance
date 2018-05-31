/**
 * Created by Mr yu on 2017/1/5.
 */
'use strict';
//完成模块的声明
var loginModule = angular.module('loginModule',
    [
        'ng',
        'ui.bootstrap',
        'ngRoute',
        'ui.router',
        'LocalStorageModule',
        'oitozero.ngSweetAlert',
        'monospaced.qrcode',
        'ui.bootstrap.datetimepicker',
        'services',
        'ngFileUpload'
    ]);

loginModule.config(function($httpProvider,$stateProvider,$uiViewScrollProvider,$urlRouterProvider) {
//用于改变state时跳至顶部
// POST
//$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]'
            ? param(data)
            : data;
    }];

    $uiViewScrollProvider.useAnchorScroll();
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controllerUrl:'login',
            controller:'loginController'
        })
        .state('recoverPassword', {
            url: '/recoverPassword',
            templateUrl: 'recoverPassword.html',
            controllerUrl:'recoverPassword',
            controller:'recoverPwdController'
        })

});


loginModule.controller('loginController',['$scope', '$http','localStorageService','$state','$rootScope','$location','$window','SweetAlert','$uibModal',
function ($scope, $http, localStorageService,$state,$rootScope,$location,$window,SweetAlert,$uibModal) {


    $scope.loginSys=function () {

        var loginForm = {
            username: $scope.username,
            password: $scope.password
        };
        
        $http.post('/userManage/login', loginForm).success(function (data) {
            if (data == 0){
                SweetAlert.swal('登录失败', '账号或密码不正确', 'error');
            }else {
                try {
                    var userInfo = data.userBasicInfo;
                    userInfo.sign = userInfo.power;
                    userInfo.roleInfo = data.roleInfo;
                    localStorageService.set("userInfo", userInfo);

                    var schoolInfo = data.schoolInfo;
                    if (schoolInfo){
                        schoolInfo.collegeInfo = data.collegeInfo;
                        localStorageService.set("schoolInfo", schoolInfo);
                    }

                    // $rootScope.userInfo = userInfo;
                    // $rootScope.schoolInfo = schoolInfo;

                    SweetAlert.swal({
                        title: '登录成功',
                        timer: 5000,
                        type: 'success'
                    });
                    $window.location.href ='/attendance/#index';
                }catch (e){
                    SweetAlert.swal('登录失败', '网络异常', 'error');
                }
            }

        }).error(function (result) {
            SweetAlert.swal('登录失败', '网络异常', 'error');
        });


        // $window.location.href ='/attendance/#index';
    };


    $scope.userRegister = function () {
        $uibModal.open({
            backdrop:'static',
            keyboard: false,
            animation: true,
            templateUrl: 'basicForm.html',
            controller: 'userFormController',
            resolve: {
                params: {}
            },
            size: 'lg'
        }).result.then(function (result) {
            // $scope.queryList();

            $window.location.href ='/attendance/#index';
        },function (reason) {
            // $scope.reset();
        });
    };




}]);


loginModule.controller('recoverPwdController',['$scope', '$http','localStorageService','$state','$rootScope','$location','$window','SweetAlert','$uibModal',
    function ($scope, $http, localStorageService,$state,$rootScope,$location,$window,SweetAlert,$uibModal) {

    console.log("忘记密码");





    }]);


loginModule.controller('userFormController',['$scope', '$rootScope', '$uibModal', '$uibModalInstance', 'params','$http', 'httpService','localStorageService','$interval','SweetAlert',
    function($scope, $rootScope, $uibModal, $uibModalInstance, params, $http, httpService,localStorageService,$interval,SweetAlert){

        $scope.rigister = true;
        
        $scope.title = '填写学生基本信息';
        
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
            $scope.edutitle = '编辑学生教育信息';
        }else {
            $scope.edutitle = '填写学生教育信息';
        }
        // $scope.formData = params || {};

        $scope.powerOptions = [
            // { sign: '1', name: '校园数据管理员' },
            { sign: '2', name: '教师' },
            { sign: '3', name: '学生' }
        ];
        $scope.formData.power = $scope.formData.power || 3;

        $scope.schoolAndCollege = [];

        getSchoolAndCollege();
        function getSchoolAndCollege() {
            $http.get("/collegeMenage/getSchoolAndCollege", {params: $rootScope.schoolInfo}).success(function (data) {
                if ($.type(data) == 'array'){
                    $scope.schoolAndCollege = data;
                    if (data.length == 1){
                        $scope.formData.schoolIndex = 0;
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







/**
 * Created by huhu on 2018/5/3.
 */

app.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
    $stateProvider
        .state('schoolManage', {
            url: '/schoolMenage',
            templateUrl: 'views/basicData/schoolManage/schoolList.html',
            controller: 'schoolListController',
            params: {  }
        })
        .state('collegeManage', {
            url: '/collegeManage',
            templateUrl: 'views/basicData/schoolManage/collegeList.html',
            controller: 'collegeListController',
            params: {
                showAll: 0
            }
        })
        .state('classManage', {
            url: '/classManage',
            templateUrl: 'views/basicData/schoolManage/classList.html',
            controller: 'classListController'
        })
        .state('courseManage', {
            url: '/courseManage',
            templateUrl: 'views/basicData/courseManage/courseList.html',
            controller: 'courseListController',
            params: {
                showAll: 0
            }
        })
        .state('courseArrange', {
            url: '/courseArrange',
            templateUrl: 'views/basicData/courseManage/arrangeList.html',
            controller: 'courseArrangeController'
        })
        .state('userManage', {
            url: '/userManage',
            templateUrl: 'views/basicData/userManage/userList.html',
            controller: 'userListController'
        })
        .state('absenceLevel', {
            url: '/absenceLevel',
            templateUrl: 'views/basicData/studySetting/absenceLevel.html',
            controller: 'absenceLevelController',
            params: {  }
        })
        .state('assessmentWeight', {
            url: '/assessmentWeight',
            templateUrl: 'views/basicData/studySetting/assessmentWeight.html',
            controller: 'assessmentWeightController',
            params: {  }
        })
        .state('studentANDcourse', {
            url: '/studentANDcourse',
            templateUrl: 'views/basicData/studySetting/studentANDcourse.html',
            controller: 'studentANDcourseController',
            params: {  }
        })


});
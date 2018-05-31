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
        .state('userLogout', {
            url: '/userLogout',
            templateUrl: 'views/test/formPage.html',
            controller: 'formPageController',
            params: {  }
        })
});
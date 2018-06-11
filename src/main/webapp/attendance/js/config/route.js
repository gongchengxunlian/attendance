app.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {

    $uiViewScrollProvider.useAnchorScroll();
    $urlRouterProvider.otherwise('/#/index'); //找到相应路由调到制定的路由页面
    $stateProvider

    //首页
        .state('index', {
            url: '/index',
            templateUrl: 'views/tpl/main.html',
            controller: 'indexController',
            params: {args: {}}
        })


});


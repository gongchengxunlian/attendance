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

     //合同管理   addby hw 2018 03 12
        .state('contractManager', {
            url: '/contractManager',
            templateUrl: 'views/contract/ContractManager.html',
            controller: 'ContractManagerCtrl',
            params: {args: {}}
        })

});


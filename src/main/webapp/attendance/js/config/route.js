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

    //客户信息
        .state('client_list', {
        url: '/client_list',
        templateUrl: 'views/basicData/clientInfoManager/client_list.html',
         controller: 'ClientControllerCtrl',
         params:{args:{}}
        })        //合同时间轴页面
        .state('contractTimeLine', {
            url: '/contractTimeLine',
            templateUrl: "views/contract/ContractTimeLine.html",
            controller: 'ContractTimeLineCtrl',
            params: {param: null}
        })});


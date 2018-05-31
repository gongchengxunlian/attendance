/**
 * Created by Administrator on 2017-07-08.
 */

service.factory('alertService', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

    $rootScope.alerts = [];

    var alertService = {
        newAlert: function (title, type) {
            var tempMsg = title || "警告";
            if(!title && type){
                tempMsg = type == 'success' ? '成功' : '接口异常' ;
            }
            $rootScope.alerts = [];

            var tempType = type ? type : 'warning';
            var time = tempType == 'success' ? 3000 : 10000;

            var temp = {type: tempType, msg: tempMsg, isAble: true};

            $rootScope.alerts.push(temp);

            if (type != 'danger') {
                $timeout(function () {
                    temp.isAble = false;
                    $rootScope.alerts.splice(temp, 1);
                }, time);
            }
        },

        closeAlert: function (index) {
            $rootScope.alerts.splice(index, 1);
        },
        closeAll: function () {
            $rootScope.alerts = [];
        }
    };

    return alertService;
}]);



/**
 * Created by huhu on 2018/5/3.
 */
app.controller('schoolTimeSettingFormController',['$scope', '$rootScope', '$uibModalInstance','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, $uibModalInstance,$http,httpService,localStorageService,$interval,SweetAlert){

    // console.log(dis);
    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };

    $scope.startDateOptions = {
        config: {
            maxDate: null,
            // minDate: new Date(),
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
                    show: false
                }
            }
        },
        openEvent: function(){
            $scope.startDateOptions.open = true
        },
        open: false,
        // buttonBar: undefined
    };

}]);
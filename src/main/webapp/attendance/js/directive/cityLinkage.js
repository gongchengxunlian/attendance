/**
 * Created by zlx on 2017/8/17
 */
app.directive("cityLinkage", [function() {
    'use strict';
    return {
        restrict: 'E',
        templateUrl: 'views/tpl/cityLinkage.html',
        replace: true,
        scope: {
            cityList: '='
        },
        controller: function($scope, $element, $state) {

            $scope.emitCityValue = function () {
                $scope.$emit('cityVlue', {'province': $scope.address.province, 'city': $scope.address.city, 'district': $scope.address.district});
            }

        },
        link: function(scope, ele, attrs) {

            // console.log(scope.cityList);  


        }
    };
}])

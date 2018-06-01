/**
 * Created by huhu on 2018/5/3.
 */
app.controller('classDistributionController',['$scope', '$rootScope', 'dis', '$uibModalInstance','$http','httpService','localStorageService','$interval','SweetAlert',
function($scope, $rootScope, dis, $uibModalInstance,$http,httpService,localStorageService,$interval,SweetAlert){

    console.log(dis);
    $scope.close = function (data) {
        $uibModalInstance.close(data);
    };
    $scope.dismiss = function (data) {
        $uibModalInstance.dismiss(data);
    };

    $scope.lock = dis.lock || false;
    $scope.set_row = dis.row || 5;
    $scope.set_col = dis.col || 5;
    $scope.rowArray = new Array($scope.set_row);
    $scope.colArray = new Array($scope.set_col + 1);

    $scope.changeRow = function () {
        if (!$scope.set_row) $scope.set_row = 5;
        // console.log($scope.set_row, $scope.rowArray);
        var length = $scope.rowArray.length;
        if (length < $scope.set_row){
            for (var i = 0; i <$scope.set_row - length; i++){
                $scope.rowArray.push("");
            }
        }else {
            $scope.rowArray.splice($scope.set_row);
        }
        // console.log(length, $scope.set_row, $scope.rowArray);
    };
    $scope.changeCol = function () {
        if (!$scope.set_col) $scope.set_col = 5;
        var length = $scope.colArray.length;
        if (length < $scope.set_col + 1){
            for (var i = 0; i < $scope.set_col - length + 1; i++){
                $scope.colArray.push("");
            }
        }else {
            $scope.colArray.splice($scope.set_col + 1);
        }
    };

    //  点击设置道路
    $scope.road = dis.road || [];
    $scope.setRoad = function (event, row, col) {
        if ($scope.lock) return;
        if (col){
            var location = {x: row, y: col};
            var index = -1;
            for (var i in $scope.road){
                var road = $scope.road[i];
                if (road.x == row && road.y == col){
                    index = i;
                    break;
                }
            }
            if (index != -1){
                $scope.road.splice(index, 1);
            }else {
                $scope.road.push(location);
            }
        }
    };
    $scope.setClass = function (row, col) {
        var myClass = (col == 0 ? 'distribution-col-title' : 'distribution-cell');
        var index = -1;
        for (var i in $scope.road){
            var road = $scope.road[i];
            if (road.x == row && road.y == col){
                index = i;
                break;
            }
        }
        if (index != -1) myClass += ' distribution-cell-road';
        return myClass;
    };


    //  保存
    $scope.saveData = function () {
        var params = {
            row: $scope.set_row,
            col: $scope.set_col,
            road: $scope.road
        };
        $scope.close(params);
        // httpService.addRow('classManage/addClass', {params: JSON.stringify(params)}).then(function (result) {
        //     if (result > 0){
        //         SweetAlert.success('操作成功');
        //         $scope.close(result);
        //     }else {
        //         SweetAlert.error('操作失败');
        //     }
        // }, function (reason) {
        //     SweetAlert.error('操作失败', '系统维护中');
        // });
    };

}]);
/**
 * Created by bianbian on 2017/8/13.
 * 表单验证指令集合
 */
//自定义指令--唯一验证  code编码唯一性，phone，email,身份证号码等唯一性
app.directive('uniqueVerify',['$http',function($http){
    return {
        restrict:'A'
        ,require:'ngModel'
        ,scope:{
            uniqueVerify:'@'
        }
        ,link:function (scope,element,attrs,ctrl) {

            ctrl.$parsers.unshift(function (viewValue) {
                $http({
                    method:'GET'
                    ,url:scope.uniqueVerify//scope.url
                    ,params:{parameter:viewValue} //参数
                }).success(function (data) {
                    var flag=false;
                    if(data==-1){//确定唯一
                        flag = true;
                    }
                    ctrl.$setValidity('uniqueVerify',flag);
                }).error(function (data) {
                 
                    ctrl.$setValidity('uniqueVerify',false);
                });

                return viewValue;//要加return
            });
        }
    }
}]);

//自定义指令--验证密码与重复密码
app.directive('equals',function(){
    return{
        require:'ngModel',
        link:function(scope,elm,attrs,ngModel){//scope:域  elm:元素  attrs:属性  ngModel:ngModel

            function validateEqual(myValue){//myValue 是ng-model的值    attrs.equals：是equals指令传进来的参数
                var valid = (myValue === scope.$eval(attrs.equals));//使用scope.$eval(attrs.equals)来获得值4
                ngModel.$setValidity('equal',valid);//equal,对应结果属性
                return valid ? myValue : undefined;
            }
            ngModel.$parsers.push(validateEqual);
            ngModel.$formatters.push(validateEqual);
            scope.$watch(attrs.equals,function(){//$watch监听equals指令参数变化
                ngModel.$setViewValue(ngModel.$viewValue);
            })
        }
    }
});





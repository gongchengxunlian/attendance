/**
 * Created by huhu on 2018/3/31.
 */

angular.module('checkboxSelectAll', []).directive('selectAllArea', ['checkboxFactory', '$timeout', function (checkboxFactory, $timeout) {
    return {
        restrict: 'C',
        link: function (scope, elem, attr) {

            $timeout(function () {
                var checkboxArea = checkboxFactory.register();
                elem.attr("checkbox-area", checkboxArea);

                elem.bind('clearCheckBox', function () {
                    checkboxFactory.clearCheckBox(checkboxArea);
                });

                elem.bind('resetCheckBox', function () {
                    checkboxFactory.resetCheckBox(checkboxArea);
                });
                // console.log(elem[0].resetCheckBox);
            });

        }
    };
}]).directive('selectAllCheck', ['checkboxFactory', '$timeout', function (checkboxFactory, $timeout) {
    return {
        restrict: 'C',
        scope: false,
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {

            $timeout(function () {
                checkboxFactory.register(elem, scope, "father", ngModel);
            });

        }
    };
}]).directive('selectAllCheckChildren', ['checkboxFactory', '$timeout', function (checkboxFactory, $timeout) {
    return {
        restrict: 'C',
        scope: false,
        require: '?ngModel',
        link: function (scope, elem, attr, ngModel) {

            $timeout(function () {
                checkboxFactory.register(elem, scope, "children", ngModel);
            });

        }
    };
}]).factory('checkboxFactory', function () {

    var checkBoxs = {};
    var index = 1;
    var runTimeout;
    var wait = { timeout: 125 };

    function run(checkBoxArea) {
// console.log(checkBoxArea);
        var checkBox = checkBoxs[checkBoxArea];

        if (!checkBox.facher) {
            if (runTimeout) clearTimeout(runTimeout);
            runTimeout = setTimeout(function () {
                run(checkBoxArea);
            }, wait.timeout);
            return;
        }

        var father = checkBox.facher;
        var children = checkBox.children;

        father.elem.unbind('change', fatherChange);
        father.elem.bind('change', checkBox, fatherChange);
        for (var i in children){
            children[i].elem.unbind('change', childChange);
            children[i].elem.bind('change', checkBox, childChange);
        }

    }

    function childChange(event) {
        // console.log(checkBoxs);

        var checkBox = event.data;
        var father = checkBox.facher;
        var children = checkBox.children;
        var scope = checkBox.scope;

        scope.$apply(function () {
            father.elem[0].checked = true;
            father.ngModel.$setViewValue(true);

            for (var i in children){
                if (!children[i].elem[0].checked) {
                    father.elem[0].checked = false;
                    father.ngModel.$setViewValue(false);
                    return;
                }
            }
        });

        // console.log(father);
        // scope.$apply();
    }

    function fatherChange(event) {
        var checkBox = event.data;
        var clear = event.clear;
        var father = checkBox.facher;
        var children = checkBox.children;
        var scope = checkBox.scope;

        scope.$apply(function () {
            var value;
            if (clear) value = undefined;
            else value = father.elem[0].checked;

            for (var i in children){
                children[i].elem[0].checked = value;
                children[i].ngModel.$setViewValue(value);
            }
        });

        // console.log(father);

    }




    //  注册
    var register = {};
    register.resetCheckBox = function (index) {
        // var scope = checkBoxs[index].scope;
        // scope.$apply(function () {
        delete checkBoxs[index].father;
        delete checkBoxs[index].children;
            checkBoxs[index].father = undefined;
            checkBoxs[index].children = [];
        // });
    };
    register.clearCheckBox = function (index) {
        fatherChange({data: checkBoxs[index], clear: true});
    };
    register.registerFather = function (elem, scope, index, ngModel) {
        checkBoxs[index].facher = {
            elem: elem,
            ngModel: ngModel
        };
        checkBoxs[index].scope = scope;
    };
    register.registerChildren = function (elem, scope, index, ngModel) {

        checkBoxs[index].children.push({
            elem: elem,
            ngModel: ngModel
        });
    };
    register.register = function (elem, scope, type, ngModel) {
        if (!type || !elem || !scope) {
            checkBoxs[index] = {
                facher: undefined,
                scope: undefined,
                children: []
            };
            return index++;
        }

        var checkboxAreaTimes = 0;
        var checkboxAreaElem;
        function getCheckboxArea() {
            var classStr = "select-all-area";
            checkboxAreaElem = $(elem).parents("." + classStr)[0];

            if (!checkboxAreaElem) {
                setTimeout(function (wait) {
                    if (checkboxAreaTimes++ > 16){
                        // wait.timeout *= 2;
                        console.error("not found class: " + classStr, checkboxAreaElem);
                        return;
                    }
                    getCheckboxArea();
                }, wait.timeout);
                return;
            }

            __register();
        }

        var registerError = 0;
        function __register() {
            var checkboxArea = $(checkboxAreaElem).attr("checkbox-area");
            if (!checkboxArea){
                setTimeout(function (wait) {
                    if (registerError++ > 16){
                        // wait.timeout *= 2;
                        console.error("register error", elem);
                        return;
                    }
                    __register();
                }, wait.timeout, wait);
                return;
            }

            if (type == "father"){
                register.registerFather(elem, scope, checkboxArea, ngModel);
            }else if (type == "children"){
                register.registerChildren(elem, scope, checkboxArea, ngModel);
                run(checkboxArea);
            }
        }

        getCheckboxArea();
    };

    return register;

});


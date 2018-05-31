(function (ng, undefined) {
    'use strict';

    ng.module('light.table', []).run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/light-table/pagination.html',
            '<div class="lt-pagination"><span>共{{totalItemCount}}条数据，当前{{currentPage}}/{{numPages}}页。每页显示数量：</span>'+
            '<div class="btn-group dropdown form-dropmenu" uib-dropdown is-open="status.isopen">'+
            '<button id="single-button" type="button" class="btn btn-default" uib-dropdown-toggle>{{ltItemsByPage}}条 &nbsp;<span class="caret"></span></button>'+
            '<ul class="uib-dropdown-menu" role="menu" uib-dropdown-menu aria-labelledby="single-button">'+
            '<li role="menuitem" ng-repeat="pageSize in PageSizeList"><a href="javascript:void(0);" ng-click="changePageSize(pageSize)">{{pageSize}}条</a></li>'+
            '</ul></div>&nbsp;&nbsp;'+
            '<nav class="pagination-container" ng-if="pages.length >= 1">'+
            '<ul class="pagination">'+
            '<li><a ng-click="selectPage(1)">«</a>'+
            '</li><li><a ng-click="selectPage(currentPage - 1)">‹</a>'+
            '<li ng-repeat="page in pages" ng-class="{active: page==currentPage}"><a ng-click="selectPage(page)">{{page}}</a></li>' +
            ' </li><li><a ng-click="selectPage(currentPage + 1)">›</a>'+
            '</li><li><a ng-click="selectPage(numPages)">»</a></li>'+
            '</ul>'+
            '</nav></div>');
    }]);



    ng.module('light.table')
        .constant('ltConfig', {
            pagination: {
                template: 'template/light-table/pagination.html',
                itemsByPage: 20,
                displayedPages: 5,
                pageSizeList: [20, 50, 100]
            },
            search: {
                delay: 200, // ms
                inputEvent: 'input'
            },
            select: {
                mode: 'single',
                selectedClass: 'lt-selected',
                count : 0
            },
            sort: {
                ascentClass: 'lt-sort-ascent',
                descentClass: 'lt-sort-descent',
                skipNatural: false,
                delay: 300
            },
            pipe: {
                delay: 100 //ms
            },
            hasPagination : false
        });
    ng.module('light.table')
        .controller('ltTableController', ['$scope', '$parse', '$filter', '$attrs', 'ltConfig',function ltTableController($scope, $parse, $filter, $attrs,ltConfig) {
            var propertyName = $attrs.ltTable;
            var displayGetter = $parse(propertyName);
            var displaySetter = displayGetter.assign;
            var safeGetter;
            var orderBy = $filter('orderBy');
            var filter = $filter('filter');
            $scope.today = $filter("date")(new Date(), 'yyyy-MM-dd');
            var safeCopy = copyRefs(displayGetter($scope));
            var tableState = {
                sort: {},
                search: {},
                pagination: {
                    start: 0,
                    totalItemCount: 0,
                    selectItemCount: 0
                }
            };
            var filtered;
            var pipeAfterSafeCopy = true;
            var ctrl = this;
            var lastSelected;

            function copyRefs(src) {
                return src ? [].concat(src) : [];
            }

            function updateSafeCopy() {
                safeCopy = copyRefs(safeGetter($scope));
                if (pipeAfterSafeCopy === true) {
                    ctrl.pipe();
                }
            }

            function deepDelete(object, path) {
                if (path.indexOf('.') != -1) {
                    var partials = path.split('.');
                    var key = partials.pop();
                    var parentPath = partials.join('.');
                    var parentObject = $parse(parentPath)(object)
                    delete parentObject[key];
                    if (Object.keys(parentObject).length == 0) {
                        deepDelete(object, parentPath);
                    }
                } else {
                    delete object[path];
                }
            }

            //creat by guohc
            function isEmptyObject(object) {
                var prop;
                for (prop  in object)
                    return !1;
                return !0
            }

            if ($attrs.ltSafeSrc) {
                safeGetter = $parse($attrs.ltSafeSrc);
                $scope.$watch(function () {
                    var safeSrc = safeGetter($scope);
                    return safeSrc && safeSrc.length ? safeSrc[0] : undefined;
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        updateSafeCopy();
                    }
                });
                $scope.$watch(function () {
                    var safeSrc = safeGetter($scope);
                    return safeSrc ? safeSrc.length : 0;
                }, function (newValue, oldValue) {
                    if (newValue !== safeCopy.length) {
                        updateSafeCopy();
                    }
                });
                $scope.$watch(function () {
                    return safeGetter($scope);
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        tableState.pagination.start = 0;
                        updateSafeCopy();
                    }
                });

            }

            /**
             * sort the rows
             * @param {Function | String} predicate - function or string which will be used as predicate for the sorting
             * @param [reverse] - if you want to reverse the order
             */
            this.sortBy = function sortBy(predicate, reverse) {
                tableState.sort.predicate = predicate;
                tableState.sort.reverse = reverse === true;

                if (ng.isFunction(predicate)) {
                    tableState.sort.functionName = predicate.name;
                } else {
                    delete tableState.sort.functionName;
                }

                tableState.pagination.start = 0;
                return this.pipe();
            };

            /**
             * search matching rows
             * @param {String} input - the input string
             * @param {String} [predicate] - the property name against you want to check the match, otherwise it will search on all properties
             */
            this.search = function search(input, predicate) {
                var predicateObject = tableState.search.predicateObject || {};
                var prop = predicate ? predicate : '$';
                input = ng.isString(input) ? input.trim() : input;
                $parse(prop).assign(predicateObject, input);
                // to avoid to filter out null value
                if (!input) {
                    deepDelete(predicateObject, prop);
                }
                tableState.search.predicateObject = predicateObject;
                tableState.pagination.start = 0;
                return this.pipe();
            };

            /**
             * this will chain the operations of sorting and filtering based on the current table state (sort options, filtering, ect)
             */
            this.pipe = function pipe() {
                var pagination = tableState.pagination;
                var output;
                filtered = tableState.search.predicateObject ? filter(safeCopy, tableState.search.predicateObject) : safeCopy;
                if (tableState.sort.predicate) {
                    filtered = orderBy(filtered, tableState.sort.predicate, tableState.sort.reverse);
                }
                //modify by guohc(if search,cancel select)
                if (!angular.isUndefinedOrNull(tableState.search.predicateObject) && !isEmptyObject(tableState.search.predicateObject)) {
                    angular.forEach(safeCopy, function (item) {
                        item.isSelected = false;
                    });
                    tableState.pagination.selectItemCount = 0;
                }
                pagination.totalItemCount = filtered.length;
                if (pagination.number !== undefined) {
                    pagination.numberOfPages = filtered.length > 0 ? Math.ceil(filtered.length / pagination.number) : 1;
                    pagination.start = pagination.start >= filtered.length ? (pagination.numberOfPages - 1) * pagination.number : pagination.start;
                    output = filtered.slice(pagination.start, pagination.start + parseInt(pagination.number));
                }
                displaySetter($scope, output || filtered);
            };

            /**
             * select a dataRow (it will add the attribute isSelected to the row object)
             * @param {Object} row - the row to select
             * @param {String} [mode] - "single" or "multiple" (multiple by default)
             */
            this.select = function select(row, mode) {
                var rows = copyRefs(displayGetter($scope));
                var index = rows.indexOf(row);
                if (index !== -1) {
                    if (mode === 'single') {
                        row.isSelected =  row.isSelected !== true ;
                        if (lastSelected) {
                            lastSelected.isSelected = false;
                        }
                        lastSelected = row.isSelected === true ? row : undefined;
                        tableState.pagination.selectItemCount = row.isSelected === true ? 1 : 0;
                    } else {
                        rows[index].isSelected = !rows[index].isSelected;
                        if(rows[index].isSelected){
                            tableState.pagination.selectItemCount ++;
                        }else{
                            tableState.pagination.selectItemCount --;
                        }
                    }
                }
            };

            this.selectAll = function selectAll(checked) {
                var rows = copyRefs(displayGetter($scope));
                tableState.pagination.selectItemCount = 0;
                for (var index in rows) {
                    //选择一页里面的所有
                    if (ltConfig.hasPagination && (parseInt(index)>= parseInt(ltConfig.pagination.itemsByPage))) {
                        break;
                    }
                    if(rows[index].__ignoreSel__){
                        continue;
                    }
                    if(checked){
                        tableState.pagination.selectItemCount ++;
                    }
                    rows[index].isSelected = checked;
                }
            };

            /**
             * take a slice of the current sorted/filtered collection (pagination)
             *
             * @param {Number} start - start index of the slice
             * @param {Number} number - the number of item in the slice
             */
            this.slice = function splice(start, number) {
                tableState.pagination.start = start;
                tableState.pagination.number = number;
                return this.pipe();
            };

            /**
             * return the current state of the table
             * @returns {{sort: {}, search: {}, pagination: {start: number}}}
             */
            this.tableState = function getTableState() {
                return tableState;
            };

            this.getFilteredCollection = function getFilteredCollection() {
                return filtered || safeCopy;
            };

            /**
             * Use a different filter function than the angular FilterFilter
             * @param filterName the name under which the custom filter is registered
             */
            this.setFilterFunction = function setFilterFunction(filterName) {
                filter = $filter(filterName);
            };

            /**
             * Use a different function than the angular orderBy
             * @param sortFunctionName the name under which the custom order function is registered
             */
            this.setSortFunction = function setSortFunction(sortFunctionName) {
                orderBy = $filter(sortFunctionName);
            };

            /**
             * Usually when the safe copy is updated the pipe function is called.
             * Calling this method will prevent it, which is something required when using a custom pipe function
             */
            this.preventPipeOnWatch = function preventPipe() {
                pipeAfterSafeCopy = false;
            };
        }])
        .directive('ltTable', function () {
            return {
                restrict: 'A',
                controller: 'ltTableController',
                link: function (scope, element, attr, ctrl) {

                    if (attr.ltSetFilter) {
                        ctrl.setFilterFunction(attr.ltSetFilter);
                    }

                    if (attr.ltSetSort) {
                        ctrl.setSortFunction(attr.ltSetSort);
                    }
                }
            };
        });
    ng.module('light.table')
        .directive('ltSelectAll', function () {
            return {
                require: '^ltTable',
                template: '<input type="checkbox" />',
                scope: {
                    rows: '=ltSelectAll'
                },
                link: function (scope, element, attr, ctrl) {
                    element.bind('change', function (evt) {
                        scope.$apply(function () {
                            if (element.prop('checked')) {
                                element.prop('checked', false);
                                ctrl.selectAll(false);
                            } else {
                                element.prop('checked', true);
                                ctrl.selectAll(true);
                            }
                        });
                    });

                    scope.$watch('row.isSelected', function (newValue, oldValue) {
                        if (newValue === true) {
                            element.parent().addClass('lt-selected');
                        } else {
                            element.parent().removeClass('lt-selected');
                        }
                    });
                }
            };
        });

    ng.module('light.table')
        .directive('csSelect', ['ltConfig', function (ltConfig) {
            return {
                require: '^ltTable',
                template: '<input type="checkbox"/>',
                scope: {
                    row: '=csSelect'
                },
                link: function (scope, element, attr, ctrl) {
                    element.bind('change', function (evt) {
                        scope.$apply(function () {
                            ctrl.select(scope.row, 'multiple');
                        });
                    });
                    scope.$watch('row.isSelected', function (newValue, oldValue) {
                        if (newValue === true) {
                            element.parent().addClass('lt-selected');
                            element.children().attr("checked", true);

                        } else {
                            element.parent().removeClass('lt-selected');
                            element.children().attr("checked", false);
                        }
                    });
                }
            };
        }]);

    //自定义选择
    ng.module('light.table')
        .directive('ltCount', ['ltConfig', function (ltConfig) {
            return {
                restrict: 'EA',
                require: '^ltTable',
                scope:{
                    nowSelCount: '=ltCount'
                },
                template: '<div><span>统计:已选中 {{selectCount}}台/总共{{totalCount}}台</span></div>',
                link: function (scope, element, attrs, ctrl) {
                    ctrl.tableState().pagination.selectItemCount= scope.nowSelCount;
                    function redraw(){
                        var paginationState = ctrl.tableState().pagination;
                        scope.selectCount = paginationState.selectItemCount;
                        //scope.selectCount = ltConfig.select.count;
                        scope.totalCount = paginationState.totalItemCount;
                    }

                    scope.$watch(function () {
                        return ctrl.tableState().pagination;
                    }, redraw, true);
                }
            }
        }]);

    ng.module('light.table')
        .directive('pageSelect', function () {
            return {
                restrict: 'E',
                template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
                link: function (scope, element, attrs) {
                    scope.$watch('currentPage', function (c) {
                        scope.inputPage = c;
                    });
                }
            }
        });

    ng.module('light.table')
        .directive('ltSearch', ['ltConfig', '$timeout', '$parse', function (ltConfig, $timeout, $parse) {
            return {
                require: '^ltTable',
                link: function (scope, element, attr, ctrl) {
                    var tableCtrl = ctrl;
                    var promise = null;
                    var throttle = attr.ltDelay || ltConfig.search.delay;
                    var event = attr.ltInputEvent || ltConfig.search.inputEvent;

                    attr.$observe('ltSearch', function (newValue, oldValue) {
                        var input = element[0].value;
                        if (newValue !== oldValue && input) {
                            ctrl.tableState().search = {};
                            tableCtrl.search(input, newValue);
                        }
                    });

                    //table state -> view
                    scope.$watch(function () {
                        return ctrl.tableState().search;
                    }, function (newValue, oldValue) {
                        var predicateExpression = attr.ltSearch || '$';
                        if (newValue.predicateObject && $parse(predicateExpression)(newValue.predicateObject) !== element[0].value) {
                            element[0].value = $parse(predicateExpression)(newValue.predicateObject) || '';
                        }
                    }, true);

                    // view -> table state
                    element.bind(event, function (evt) {
                        evt = evt.originalEvent || evt;
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }

                        promise = $timeout(function () {
                            tableCtrl.search(evt.target.value, attr.ltSearch || '');
                            promise = null;
                        }, throttle);
                    });
                }
            };
        }]);

    //lt-custom-search
    ng.module('light.table')
        .directive('ltCustomSearch', ['ltConfig', '$timeout', '$parse', function (ltConfig, $timeout, $parse) {
            return {
                require: '^ltTable',
                scope: {
                    valCollection: '=ltValCollection'
                },
                link: function (scope, element, attr, ctrl) {
                    var tableCtrl = ctrl;
                    var promise = null;
                    var throttle = attr.ltDelay || ltConfig.search.delay;
                    var event = attr.ltInputEvent || ltConfig.search.inputEvent;


                    attr.$observe('ltCustomSearch', function (newValue, oldValue) {
                        var input = element[0].value;
                        if (newValue !== oldValue && input) {
                            ctrl.tableState().search = {};
                            tableCtrl.search(input, newValue);
                        }
                    });

                    //table state -> view
                    scope.$watch(function () {
                        return ctrl.tableState().search;
                    }, function (newValue, oldValue) {
                        var predicateExpression = attr.ltCustomSearch || '$';
                        if (newValue.predicateObject && $parse(predicateExpression)(newValue.predicateObject) !== element[0].value) {
                            element[0].value = $parse(predicateExpression)(newValue.predicateObject) || '';
                        }
                    }, true);

                    scope.$watch('valCollection', function (newVal) {
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }
                        promise = $timeout(function () {
                            tableCtrl.search(newVal, attr.ltCustomSearch || '');
                            promise = null;
                        }, throttle);
                    }, true);

                    // view -> table state
                    element.bind(event, function (evt) {
                        evt = evt.originalEvent || evt;
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }

                        promise = $timeout(function () {
                            tableCtrl.search(evt.target.value, attr.ltCustomSearch || '');
                            promise = null;
                        }, throttle);
                    });
                }
            };
        }]);

    ng.module('light.table')
        .directive('ltSelectRow', ['ltConfig', function (ltConfig) {
            return {
                restrict: 'A',
                require: '^ltTable',
                scope: {
                    row: '=ltSelectRow'
                },
                link: function (scope, element, attr, ctrl) {
                    var mode = attr.ltSelectMode || ltConfig.select.mode;
                    element.bind('click', function () {
                        scope.$apply(function () {
                            ctrl.select(scope.row, mode);
                        });
                    });

                    scope.$watch('row.isSelected', function (newValue) {
                        if (newValue === true) {
                            element.addClass(ltConfig.select.selectedClass);
                        } else {
                            element.removeClass(ltConfig.select.selectedClass);
                        }
                    });
                }
            };
        }]);

    ng.module('light.table')
        .directive('ltSort', ['ltConfig', '$parse', '$timeout', function (ltConfig, $parse, $timeout) {
            return {
                restrict: 'A',
                require: '^ltTable',
                link: function (scope, element, attr, ctrl) {

                    var predicate = attr.ltSort;
                    var getter = $parse(predicate);
                    var index = 0;
                    var classAscent = attr.ltClassAscent || ltConfig.sort.ascentClass;
                    var classDescent = attr.ltClassDescent || ltConfig.sort.descentClass;
                    var stateClasses = [classAscent, classDescent];
                    var sortDefault;
                    var skipNatural = attr.ltSkipNatural !== undefined ? attr.ltSkipNatural : ltConfig.sort.skipNatural;
                    var promise = null;
                    var throttle = attr.ltDelay || ltConfig.sort.delay;

                    if (attr.ltSortDefault) {
                        sortDefault = scope.$eval(attr.ltSortDefault) !== undefined ? scope.$eval(attr.ltSortDefault) : attr.ltSortDefault;
                    }

                    //view --> table state
                    function sort() {
                        index++;
                        var func;
                        predicate = ng.isFunction(getter(scope)) || ng.isArray(getter(scope)) ? getter(scope) : attr.ltSort;
                        if (index % 3 === 0 && !!skipNatural !== true) {
                            //manual reset
                            index = 0;
                            ctrl.tableState().sort = {};
                            ctrl.tableState().pagination.start = 0;
                            func = ctrl.pipe.bind(ctrl);
                        } else {
                            func = ctrl.sortBy.bind(ctrl, predicate, index % 2 === 0);
                        }
                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }
                        if (throttle < 0) {
                            scope.$apply(func);
                        } else {
                            promise = $timeout(func, throttle);
                        }
                    }

                    element.bind('click', function sortClick() {
                        if (predicate) {
                            sort();
                        }
                    });

                    if (sortDefault) {
                        index = sortDefault === 'reverse' ? 1 : 0;
                        sort();
                    }

                    //table state --> view
                    scope.$watch(function () {
                        return ctrl.tableState().sort;
                    }, function (newValue) {
                        if (newValue.predicate !== predicate) {
                            index = 0;
                            element
                                .removeClass(classAscent)
                                .removeClass(classDescent);
                        } else {
                            index = newValue.reverse === true ? 2 : 1;
                            element
                                .removeClass(stateClasses[index % 2])
                                .addClass(stateClasses[index - 1]);
                        }
                    }, true);
                }
            };
        }]);



    ng.module('light.table')
        .directive('ltPagination', ['ltConfig', function (ltConfig) {
            return {
                restrict: 'EA',
                require: '^ltTable',
                scope: {
                    ltItemsByPage: '=?',
                    ltDisplayedPages: '=?',
                    ltPageChange: '&',
                    ltPageSizeList: '=?',
                    ltChangePageSize: '&'
                },
                templateUrl: function (element, attrs) {
                    if (attrs.ltTemplate) {
                        return attrs.ltTemplate;
                    }
                    return ltConfig.pagination.template;
                },
                link: function (scope, element, attrs, ctrl) {

                    ltConfig.hasPagination = true;
                    scope.ltItemsByPage = scope.ltItemsByPage ? +(scope.ltItemsByPage) : ltConfig.pagination.itemsByPage;
                    scope.ltDisplayedPages = scope.ltDisplayedPages ? +(scope.ltDisplayedPages) : ltConfig.pagination.displayedPages;
                    ( !(scope.ltPageSizeList == undefined) ) ? (scope.PageSizeList = scope.ltPageSizeList.split(',')) : (scope.PageSizeList = ltConfig.pagination.pageSizeList);

                    scope.currentPage = 1;
                    scope.pages = [];

                    function redraw() {
                        var paginationState = ctrl.tableState().pagination;
                        var start = 1;
                        var end;
                        var i;
                        var prevPage = scope.currentPage;
                        scope.totalItemCount = paginationState.totalItemCount;
                        scope.currentPage = Math.floor(paginationState.start / paginationState.number) + 1;

                        start = Math.max(start, scope.currentPage - Math.abs(Math.floor(scope.ltDisplayedPages / 2)));
                        end = start + scope.ltDisplayedPages;

                        if (end > paginationState.numberOfPages) {
                            end = paginationState.numberOfPages + 1;
                            start = Math.max(1, end - scope.ltDisplayedPages);
                        }

                        scope.pages = [];
                        scope.numPages = paginationState.numberOfPages;

                        for (i = start; i < end; i++) {
                            scope.pages.push(i);
                        }

                        if (prevPage !== scope.currentPage) {
                            scope.ltPageChange({newPage: scope.currentPage});
                        }
                    }

                    //table state --> view
                    scope.$watch(function () {
                        return ctrl.tableState().pagination;
                    }, redraw, true);

                    //scope --> table state  (--> view)
                    scope.$watch('ltItemsByPage', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            scope.selectPage(1);
                        }
                    });

                    scope.$watch('ltDisplayedPages', redraw);

                    //view -> table state
                    scope.selectPage = function (page) {
                        if (page > 0 && page <= scope.numPages) {
                            ctrl.slice((page - 1) * scope.ltItemsByPage, scope.ltItemsByPage);
                        }
                    };

                    scope.changePageSize = function (pagesize) {
                        scope.ltItemsByPage = pagesize;
                        ltConfig.pagination.itemsByPage = pagesize;
                    }

                    if (!ctrl.tableState().pagination.number) {
                        ctrl.slice(0, scope.ltItemsByPage);
                    }
                }
            };
        }]);

    ng.module('light.table')
        .directive('ltPipe', ['ltConfig', '$timeout', function (config, $timeout) {
            return {
                require: 'ltTable',
                scope: {
                    ltPipe: '='
                },
                link: {

                    pre: function (scope, element, attrs, ctrl) {

                        var pipePromise = null;

                        if (ng.isFunction(scope.ltPipe)) {
                            ctrl.preventPipeOnWatch();
                            ctrl.pipe = function () {

                                if (pipePromise !== null) {
                                    $timeout.cancel(pipePromise)
                                }

                                pipePromise = $timeout(function () {
                                    scope.ltPipe(ctrl.tableState(), ctrl);
                                }, config.pipe.delay);

                                return pipePromise;
                            }
                        }
                    },

                    post: function (scope, element, attrs, ctrl) {
                        ctrl.pipe();
                    }
                }
            };
        }]);
    ng.module('light.table')
        .directive('ltExport', ['$filter', function ($filter) {
            return {
                restrict: 'E',
                require: '^ltTable',
                //template:'<button type="button" class="btn btn-primary" ng-click="export()">导出</button>',
                template: '<button type="button" class="btn btn-primary" ng-csv="getArray()" csv-header="getHeader()" filename="{{finalFileName}}" >导出</button>',
                scope: {
                    fileDate: '@ltFileDate',
                    fileSeparate: '@ltFileSeparate',
                    ltHeader: '=',
                    fileName: '@ltFileName'
                },
                controller: 'ltTableController',
                link: function (scope, element, attr, ctrl) {

                    var createFileName = function () {
                        var formatDate = "";
                        var formatSeparate = scope.fileSeparate;
                        if (scope.fileDate != undefined && scope.fileDate != '') {
                            formatDate = $filter('date')(new Date(), scope.fileDate);
                            if (scope.fileSeparate == undefined || scope.fileSeparate == '') {
                                formatSeparate = "-";
                            }
                        } else {
                            formatSeparate = "";
                        }
                        scope.finalFileName = scope.fileName + formatSeparate + formatDate + ".csv";
                    }

                    scope.getHeader = function () {
                        createFileName();
                        var newHeader = [];
                        var count = 0;
                        for (var i = 0; i < scope.ltHeader.length; i++) {
                            var tempList = scope.ltHeader[i];
                            if (tempList.length > 1) {
                                newHeader[count++] = tempList[1];
                            }
                        }
                        return newHeader;
                    }
                    scope.getArray = function () {
                        var newList = [];
                        var list = ctrl.getFilteredCollection();
                        for (var i = 0; i < list.length; i++) {
                            var temp = list[i];
                            var obj = [];
                            for (var j = 0; j < scope.ltHeader.length; j++) {
                                var header = scope.ltHeader[j];
                                var text = '';
                                //如果header数组数量为3个，则第3个为默认值
                                if (header.length > 2) {
                                    text = (temp[header[0]] == '' || temp[header[0]] == undefined) ? header[2] : temp[header[0]];
                                } else if (header.length > 1) {
                                    text = temp[header[0]];
                                }
                                obj[j] = text;
                            }
                            newList[i] = obj;
                        }
                        return newList;
                    }
                }
            }
        }]);



})(angular);
'use strict';
angular.module('light.tree',[])
    .factory('treeService', function () {
        var treeService = {};
        /**
         * json格式转哈希、树状结构
         * @param {json} dataSrc json数据（hash结构）
         * @param {object} opts 配置
         * - idfield id字段的属性名
         * - pidfield 父id的字段的属性名
         * @return	{Array} 数组[哈希表结构,树结构]
         */
        treeService.transData = function (dataSrc, opts){
            var tree = [], hash = {}, i = 0, len = dataSrc.length,data;
            var id=opts['idfield']||'id', pid=opts['pidfield']||'pid';
            while(i < len){// 防止子节点向父节点扩展 children 时父节点尚未存入 hash
                data=dataSrc[i++];
                hash[data[id]] = data;// 哈希表结构 - 以 id 字段为 key
            }
            i=0;
            while(i < len){
                data = dataSrc[i++];
                var hashVP = hash[data[pid]];// 父节点
                // 树结构
                if(hashVP){// 向父节点中添加
                    !hashVP['children'] && (hashVP['children'] = []);
                    hashVP['children'].push(data);
                }else{
                    tree.push(data);
                }
            }
            return [hash,tree];
        };
        return treeService;
    })

    .factory('RecursionHelper', ['$compile', function($compile){
        return {
            /**
             * 手动编译element，解决递归循环的问题
             * @param element
             * @param [link] post link 或者 {pre-link, post-link}
             */
            compile: function(element, link){

                // 规范link参数
                if(angular.isFunction(link)){
                    link = { post: link };
                }

                // 通过移除内容来打破递归循环
                var contents = element.contents().remove();
                var compiledContents;// 编译后的内容
                return {
                    pre: (link && link.pre) ? link.pre : null,

                    post: function(scope, element){
                        // 编译内容
                        if(!compiledContents){
                            compiledContents = $compile(contents);
                        }
                        // 重新添加内容
                        compiledContents(scope, function(clone){
                            element.append(clone);
                        });

                        // 如果存在post link，调用之
                        if(link && link.post){
                            link.post.apply(null, arguments);
                        }
                    }
                };
            }
        };
    }])

    .filter('treeNodeFilter', function () {
        return function (hashData, search, labelField, pidFiled, idField) {
            // 分支中只要有一个节点符合条件，则整条分支都返回；兄弟节点中不符合条件的未移除
            var hash = {},result = [];

            if(search) {
                // 根据关键字过滤出节点
                angular.forEach(hashData, function (item) {
                    if(item && -1 != item[labelField].indexOf(search)) {
                        // 找到祖先节点
                        while(item['__parent']) {
                            item = item['__parent']
                        }
                        if(!hash[item[idField]]) {
                            hash[item[idField]] = item;
                            result.push(item);
                        }
                    }
                })
            } else {
                angular.forEach(hashData, function (item) {
                    if(item && !item['__parent']) {
                        result.push(item);
                    }
                })
            }

            return result;
        }
    })

    /**
     * @ngdoc directive
     * @name light.tree.directive:lightTree
     * @restrict E
     *
     * @description
     * 树
     *
     * @param {array} dataprovider 数据源.<br />
     *   id: id字段，可通过 idfield 指定<br />
     *   pid: parentid 字段，可通过 pidfield 指定<br />
     *   text: 显示字段，可通过 labelfield 指定<br />
     *   isbranch: 是否为分支字段，若指定 isbranch=true，则其拥有子节点，需要延迟加载 - 多选且级联选中时不支持<br />
     *   selected: 初始时是否选中，默认为 false<br />
     *   closed: 是否折叠，默认为 false<br />
     *   cls: 节点图标的 class
     * @param {string=} idfield id字段，默认'id'.
     * @param {string=} pidfield parentid字段，默认'pid'.
     * @param {string=} labelfield 显示字段，默认'text'.
     * @param {boolean=} multiselect 多选，false|true，默认 false.
     * @param {string=} pcls 父节点图标 class
     * @param {string=} ccls 叶子节点图标 class
     * @param {boolean=} istree 数据源是否为树形，默认为 false.
     * @param {bool=} cascade 支持多选时，是否级联父子节点的选中状态，默认为 false.
     * @param {string=} itemrenderer 自定义节点渲染.
     * @param {string=} filterby 过滤.
     * @param {object=} lightd 若定义了此属性，可供调用接口。调用方法参见：lightd.
     * @param {function=} onitemclick 点击节点时的回调函数:onitemclick(node).
     * @param {function=} onloadbranch 加载延迟节点（isbranch=true 的节点）时的回调函数: onloadbranch(node,success,error).<br />
     * - success(children) 延迟加载成功后的回调函数，参数为要添加到 node 下的子节点;<br />
     * - error() 延迟加载失败后的回调函数.
     * @param {function=} onbeforeexpand 节点展开前的回调函数,返回 false 时阻止展开:onbeforeexpand(node).
     * @param {function=} onexpand 节点展开时的回调函数:onexpand(node).
     * @param {function=} onbeforecollapse 节点折叠前的回调函数,返回 false 时阻止折叠:onbeforecollapse(node).
     * @param {function=} oncollapse 节点折叠时的回调函数:oncollapse(node).
     * @param {function=} onbeforeselect 节点选中前的回调函数:onbeforeselect(node).
     * @param {function=} onselect 节点选中时的回调函数:onselect(node).
     * @param {function=} oncancelselect 取消节点选中时的回调函数:oncancelselect(node).
     *
     */
    .directive('lightTree',['RecursionHelper','treeService','$filter','$parse',function (RecursionHelper,treeService,$filter,$parse) {
        return {
            restrict:'E',
            transclude:false,
            templateUrl:function (element, attrs) {
            if (attrs.ltTemplate) {
                return attrs.ltTemplate;
            }
        },
            replace:false,
            scope: {
                // Properties
                dataprovider:'='// 数据源
                ,filterby:'='// 过滤
//                ,orderby:'@'// 排序字段，默认'id' TODO
                ,lightd:'='// 供外部操作tree
                ,labelfunction:'&'// TODO
                // Events
                ,onitemclick:'&'
                ,onloadbranch:'&'
                ,onbeforeexpand:'&'
                ,onexpand:'&'
                ,onbeforecollapse:'&'
                ,oncollapse:'&'
                ,onbeforeselect:'&'
                ,onselect:'&'
                ,oncancelselect:'&'
            },
            require: 'lightTree',
            controller: ['$scope','treeService', function ($scope,treeService) {
                var ctrl = this;
                $scope.isRoot = !$scope.$parent._treeCtrl;// 若父scope未定义 _treeCtrl 则为根节点
                if($scope.isRoot){
                    $scope._treeCtrl = ctrl;
                }else{// 统一为根节点的 controller
                    $scope._treeCtrl = $scope.$parent._treeCtrl;
                    return;
                }

                var conf = ctrl.conf = {}
                    ,curNode// 记录高亮行
                    ,selNode;// 记录选中行（单选条件下）
                ctrl.handler = {};
                ctrl._hashData = {};

                /**
                 * 根据父节点 pNode 配置其子节点 nodes 的附加属性
                 *   __parent 父节点
                 *   __closed 是否折叠
                 *   __selected 是否选中
                 *   __level 节点层级
                 * @param {Array} nodes json数据（树形结构）
                 * @param {Object=} pNode 父节点，未定义表示 nodes 均为一级节点
                 */
                ctrl.initData = function(nodes, pNode){
                    if(conf.multiselect) {// 多选
                        ctrl.setMultiInit(nodes, pNode);
                    }else{// 单选
                        ctrl.setRadioInit(nodes, pNode);
                    }
                };
                ctrl.setMultiInit = function(nodes, pNode){
                    var _level= pNode ? pNode['__level']+1 : 0
                        ,selCount=0;
                    angular.forEach(nodes, function (node) {
                        node['__level'] = _level;
                        pNode && (node['__parent'] = pNode);
                        node['__closed']=node['closed'];
                        node['__selected']=node['selected'];
//                        node['__loading']=false;
//                        node['__current']=false;
                        if(!conf.cascade && node['isbranch']){// 非级联时才允许延迟加载
                            node['__closed']=true;
                            node['children'] ? node['children'].length=0 : node['children']=[];
                        }else if(node['isbranch'] || (node['children'] && !node['children'].length)){// 级联时的延迟加载作为叶子处理
                            node['children'] = undefined;
                        }
                        if(node['children'] && node['children'].length){// 有子节点
                            ctrl.setMultiInit(node['children'],node);
                        }
                        node['__selected'] && selCount++;
                    });
                    if(pNode && conf.cascade){// 级联，根据子节点修改父节点 __selected
                        if(selCount == nodes.length){//全选
                            pNode['__selected']=true;
                            pNode['__semi']=false;
                        }else if(selCount == 0){// 未选
                            pNode['__selected']=false;
                            pNode['__semi']=false;
                        }else{// 半选
                            pNode['__selected']=false;
                            pNode['__semi']=true;
                        }
                    }
                };
                ctrl.setRadioInit = function(nodes, pNode){
                    var _level= pNode ? pNode['__level']+1 : 0;
                    angular.forEach(nodes, function (node) {
                        node['__level'] = _level;
                        pNode && (node['__parent'] = pNode);
                        node['__closed']=node['closed'];
//                        node['__semi']=false;
//                        node['__loading']=false;
//                        node['__current']=false;
                        if(node['selected'] && !selNode){// 用户定义其选中且未定义其他选中项，选中、高亮并展开其所有父节点，
                            node['__selected']=true;
                            node['__current']=true;
                            curNode=node;
                            selNode=node;
                            (function(p){
                                while(p){
                                    p['__closed']=false;
                                    p=p['__parent'];
                                }
                            })(pNode);// 打开所有父节点
                        }else{
                            node['__selected']=false;
                            node['__current']=false;
                        }
                        if(node['children']) {// 有子节点
                            ctrl.setRadioInit(node['children'], node);
                        }else{
                            if(node['isbranch']){
                                node['__closed']=true;
                                node['children']=[];
                            }
                        }
                    });
                };

                ctrl.changeCur = function(node){// 切换高亮行
                    if(curNode == node) return;
                    if(curNode) curNode['__current']=false;// 取消原高亮行
                    curNode = node;
                    curNode && (curNode['__current'] = true);// node 为 undefined，仅清空高亮行
                };
                ctrl.changeSel = function(node){// 单选情况下切换选中项
                    if(selNode == node) return;
                    if(selNode) selNode['__selected']=false;// 取消原高亮行
                    selNode = node;
                    selNode && (selNode['__selected'] = true);// node 为 undefined，仅取消选中
                };

                /**
                 * 向 hash 注册 nodes 及其子节点
                 * @param {Array=} nodes 树形结构的数据
                 */
                var registerHash = function(nodes){
                    angular.forEach(nodes,function(node){
                        ctrl._hashData[node[conf.idfield]] = node;
                        node['children'] && registerHash(node['children']);
                    });
                };
                /**
                 * 转换 nodes 为树形，并向 hash 中注册
                 * @param {Array} nodes
                 * @param {Object=} pNode 父节点，未定义表示 nodes 均为一级节点
                 */
                ctrl.transData = function(nodes, pNode){
                    // 如果是递归的数据，需要转换
                    if(!conf['isTree']){
                        // 转换数据并注册 hash
                        var _data = treeService.transData(nodes,{
                            'idfield':conf.idfield
                            ,'pidfield':conf.pidfield
                            ,'childrenfield':'children'
                        });
                        angular.extend(ctrl._hashData, _data[0]);// 扩展 hash
                        nodes = _data[1];
                    }else{
                        registerHash(nodes);// 树形需手动注册
                    }
                    ctrl.initData(nodes,pNode);
                    return nodes;
                };
                // 移除 node 及其子节点
                ctrl.removeNode = function(node){
                    // 移除节点前，先处理高亮及选中
                    if(node['__current']) curNode=undefined;
                    if(node['__selected']) selNode=undefined;
                    node['children'] && angular.forEach(node['children'], function(child){
                        ctrl.removeNode(child);
                    });
                    delete ctrl._hashData[node[conf.idfield]];// 从 hash 数据中移除键值对
                };
                ctrl.destroyData = function(){// 存在历史数据源时，清除组件附加属性
                    curNode = undefined;
                    selNode = undefined;
                    if(!!ctrl._hashData){
                        angular.forEach(ctrl._hashData,function(data){
                            // 数据源解除 __parent、children 绑定，防止循环引用
                            if(data['__parent']) data['__parent']=null;
                            if(data['children']) data['children']=null;
                        });
                    }
                };
            }],
            compile: function(element) {
                return RecursionHelper.compile(element,{
                    post: function(scope,element,attrs){
                        var isRoot = scope.isRoot
                            ,ctrl = scope._treeCtrl;
                        var vm = scope.vm = {}// 记录每个子树不同的属性（_data）
                            ,conf = scope.conf = ctrl.conf;// 用户配置
                        var handler = scope.handler = ctrl.handler;// 所有子树公用的方法
                        /*** 根节点 ***/
                        if(isRoot){
                            var parentScope = scope.$parent;
                            // 默认值
                            angular.extend(conf, {
                                idfield: attrs['idfield'] || 'id'
                                ,pidfield: attrs['pidfield'] || 'pid'
                                ,labelfield: attrs['labelfield'] || 'text'
                                ,pCls: attrs['pcls']
                                ,cCls: attrs['ccls'] || 'icon-file'
                                ,multiselect: false
                                ,itemrenderer: attrs['itemrenderer']
                                ,isTree: attrs['istree']=='true'
                                ,cascade: attrs['cascade']=='true'
                            });
//                            conf.orderby = scope.orderby || conf.idfield;
                            // 事件监听
                            conf.onitemclick = scope.onitemclick() || angular.noop;
                            conf.onloadbranch = scope.onloadbranch() || angular.noop;
                            conf.onbeforeexpand = scope.onbeforeexpand() || angular.noop;
                            conf.onexpand = scope.onexpand() || angular.noop;
                            conf.onbeforecollapse = scope.onbeforecollapse() || angular.noop;
                            conf.oncollapse = scope.oncollapse() || angular.noop;
                            conf.onbeforeselect = scope.onbeforeselect() || angular.noop;
                            conf.onselect = scope.onselect() || angular.noop;
                            conf.oncancelselect = scope.oncancelselect() || angular.noop;
                            /* 多选支持 */
                            (function(){
                                var _setMultisel;
                                if (attrs.multiselect) {// 有 multiselect 属性，监听
                                    var _getMultisel = $parse(attrs.multiselect);
                                    _setMultisel = _getMultisel.assign;
                                    conf.multiselect = _getMultisel(parentScope);
                                    _setMultisel && parentScope.$watch(_getMultisel, function(val, wasVal) {
                                        if(val !== wasVal){
                                            conf.multiselect = val;
                                            ctrl.changeCur();
                                            ctrl.initData(vm._data);
                                        }
                                    });
                                }
                                if(angular.isUndefined(_setMultisel)){// 不会变化，标记 ctrl.conf.multiselect
                                    ctrl.conf.multiselect = conf.multiselect;
                                }
                            })();
                            /* 数据源监听 */
                            scope.$watch('dataprovider', function (newValue) {
                                if(newValue) {
                                    ctrl.destroyData();// 销毁可能存在的原数据，避免其中children等对转换数据产生影响
                                    // 转换 nodes 为树形，并向 hash 中注册，配置树节点附加属性
                                    vm._data = ctrl.transData(scope.dataprovider);
                                }
                            },false);
                            /* 过滤监听 */
                            scope.$watch('filterby', function (newValue,oldValue) {
                                if(newValue != oldValue) {
                                    angular.forEach(ctrl._hashData, function (item) {
                                        if (item['__selected']) item['__selected']=false;
                                    });
                                    vm._data = $filter('treeNodeFilter')(ctrl._hashData,
                                        scope.filterby,
                                        conf.labelfield,
                                        conf.pidfield,
                                        conf.idfield);
                                }
                            },false);
                            /* 销毁 */
                            scope.$on('$destroy',function(){
                                ctrl.destroyData()
                            });

                            /*** 事件 ***/
                            /**
                             * 向 pNode 添加 nodes 及其子节点
                             * @param {Array} children
                             * @param {Object=} pNode
                             */
                            var registerNode = function (children, pNode) {
                                children = ctrl.transData(children, pNode);// 转换 children 为树形，配置树节点附加属性
                                if(pNode){
                                    pNode['children'] = pNode['children'] ?
                                        pNode['children'].concat(children) : children;
                                    pNode['__closed']=false;// 展开父节点
                                }else{// 根节点
                                    vm._data = vm._data.concat(children);
                                }
                            };
                            // 注销节点信息
                            var unregisterNode = function (node) {
                                var parent = node['__parent']
                                    ,children;
                                if(parent) {// 从 parent 的 children 中移除node
                                    children = parent['children'];
                                    children.splice(children.indexOf(node), 1);
                                    children.length==0 && (parent['children'] = undefined);
                                }else{// 根节点
                                    children = vm._data;
                                    children.splice(children.indexOf(node), 1);
                                }
                                ctrl.removeNode(node);
                            };

                            // 根据 node['__selected'] 设置其子节点选中状态
                            var setChildrenCheck=function(node) {
                                angular.forEach(node['children'], function (child) {
                                    child['__selected'] = node['__selected'];
                                    child['__semi'] = false;
                                    child['children'] && setChildrenCheck(child);// 级联孙子节点
                                });
                            };
                            // 根据子节点调整 node 选中状态
                            var setCheckByChildren=function(node) {
                                var count = 0;// 已选项总数
                                angular.forEach(node['children'], function (child) {
                                    child['__selected'] && count++;
                                });
                                if(count == 0){// 未选
                                    node['__selected'] = false;
                                    node['__semi'] = false;
                                }
                                else if(count == node['children'].length){// 全选
                                    node['__selected'] = true;
                                    node['__semi'] = false;
                                }
                                else{// 半选
                                    node['__selected'] = false;
                                    node['__semi'] = true;
                                }
                                node['__parent'] && setCheckByChildren(node['__parent']);// 可能影响父节点选中状态
                            };
                            // 展开 node
                            var expandNode=function(node){
                                if(!node['children'] || !node['__closed'] || conf.onbeforeexpand(node)===false) return;
                                node['__closed'] = false;// 展开
                                if(node['isbranch'] && !node['children'].length &&  !node['__loading']) {// 未展开的延迟加载节点
                                    node['__loading'] = true;
                                    conf.onloadbranch(node,function(children){
                                        // 延迟加载成功的回调函数
                                        node['__loading'] = false;
                                        if(angular.isArray(children)) {
                                            registerNode(children, node);
                                            //scope.$apply();//不知道这边为什么$apply报错
                                        }
                                        conf.onexpand(node);
                                    },function(){
                                        node['__loading'] = false;
                                        // 延迟加载失败的回调函数
                                    });
                                }else{
                                    conf.onexpand(node);
                                }
                            };
                            // 折叠 node
                            var collapseNode=function(node){
                                if(!node['children'] || node['__closed'] || conf.onbeforecollapse(node)===false) return;
                                node['__closed'] = true;// 折叠
                                conf.oncollapse(node);
                            };
                            // 选中 node
                            var selectNode=function(node){
                                var oldStatus = node['__selected'];
                                if(oldStatus) return;// 已被选中，单选不作处理，多选时反转选中状态
                                if(conf.multiselect){
                                    if(conf.onbeforeselect(node)!==false){
                                        node['__selected'] = true;// 反选
                                        node['__semi'] = false;// 非半选
                                        if(conf.cascade){
                                            node['children'] && setChildrenCheck(node);// 级联子节点
                                            node['__parent'] && setCheckByChildren(node['__parent']);// 设置父节点状态
                                        }
                                        conf.onselect(node);
                                    }
                                    ctrl.changeCur(node);// 切换高亮
                                }else{
                                    if(conf.onbeforeselect(node)!==false){
                                        ctrl.changeSel(node);// 切换选中
                                        ctrl.changeCur(node);// 切换高亮
                                        conf.onselect(node);
                                    }
                                }
                            };

                            handler.clickRow = function(node){
                                conf.onitemclick(node);
                                var oldStatus = node['__selected'];
                                if(oldStatus){// 已被选中，单选不作处理，多选时反转选中状态
                                    if(conf.multiselect){
                                        node['__selected'] = false;// 反选
                                        node['__semi'] = false;// 非半选
                                        if(conf.cascade){
                                            node['children'] && setChildrenCheck(node);// 级联子节点
                                            node['__parent'] && setCheckByChildren(node['__parent']);// 设置父节点状态
                                        }
                                        conf.oncancelselect(node);
                                        ctrl.changeCur(node);// 切换高亮
                                    }
                                }else{// 未被选中
                                    selectNode(node);
                                }
                            };

                            handler.customClickBtn = function(data){
                                scope.$parent.controllerClickBtn(data);
                            };

                            // 节点展开/闭合
                            handler.toggleNode = function (e,node) {
                                if(node['__closed']){
                                    expandNode(node);
                                }else{
                                    collapseNode(node);
                                }
                                e.stopPropagation();
                            };
                            // 切换悬停标记（node['light-treehover']）
                            handler.toggleHover =function(node){
                                node['light-treehover']=!node['light-treehover'];
                            };

                            /* 开放接口，需定义双向绑定的 lightd */
                            /**
                             * @ngdoc object
                             * @name light.tree.lightd
                             * @module light.tree
                             * @description lightTree 对外开放的接口，双向绑定，使用前需在指令属性中指定 lightd="xx"，并指定 scope.xx={}
                             */
                            if(attrs.lightd && angular.isObject(scope.lightd)) {
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#options
                                 * @methodOf light.tree.lightd
                                 * @description 获取当前树的配置
                                 * @return {Object} 返回一个包含用户自定义设置的对象。<br />
                                 * - idfield id字段.<br />
                                 * - pidfield parentid字段.<br />
                                 * - labelfield 显示字段.<br />
                                 * - cCls 叶子节点图标 class<br />
                                 * - pCls 父节点图标 class<br />
                                 * - cascade 是否级联父子节点的选中状态.<br />
                                 * - isTree 数据源是否为树形.<br />
                                 * - itemrenderer 自定义节点渲染.<br />
                                 * - multiselect 多选，false|true.<br />
                                 * - onbeforecollapse 节点折叠前的回调函数.<br />
                                 * - oncollapse 节点折叠时的回调函数.<br />
                                 * - onbeforeexpand 节点展开前的回调函数.<br />
                                 * - onexpand 节点展开时的回调函数.<br />
                                 * - onbeforeselect 节点选中前的回调函数.<br />
                                 * - oncancelselect 取消节点选中时的回调函数.<br />
                                 * - onitemclick 点击节点时的回调函数.<br />
                                 * - onloadbranch 加载延迟节点（isbranch=true 的节点）时的回调函数.<br />
                                 * - onselect 节点选中时的回调函数.
                                 */
                                scope.lightd.options = function(){
                                    return conf;
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#loadData
                                 * @methodOf light.tree.lightd
                                 * @description 重置数据源
                                 * @param {Array} data 新的数据源
                                 * @param {boolean=} isTree data 是否为树形，默认为 false
                                 */
                                scope.lightd.loadData = function(data, isTree){
                                    conf.isTree=isTree||false;
                                    scope.dataprovider = data;
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#getNode
                                 * @methodOf light.tree.lightd
                                 * @description 获取符合条件的第一个节点
                                 * @param {string} key 键
                                 * @param {Object} val 值
                                 * @return {Object} 第一个符合 data[key]=val 的节点 data，找不到时为 undefined.
                                 */
                                scope.lightd.getNode = function(key, val){
                                    var _hashData = ctrl._hashData;
                                    for(var name in _hashData){
                                        if (_hashData.hasOwnProperty(name)){
                                            if (_hashData[name][key]==val) return _hashData[name];
                                        }
                                    }
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#getNodes
                                 * @methodOf light.tree.lightd
                                 * @description 获取符合条件的所有节点
                                 * @param {string} key 键
                                 * @param {Object} val 值
                                 * @return {Array} 所有符合 data[key]=val 的节点 data 组成的数组，找不到时为 [].
                                 */
                                scope.lightd.getNodes = function(key, val){
                                    var _hashData = ctrl._hashData
                                        ,nodes=[];
                                    for(var name in _hashData){
                                        if (_hashData.hasOwnProperty(name)){
                                            if (_hashData[name][key]==val) nodes.push(_hashData[name]);
                                        }
                                    }
                                    return nodes;
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#getSelected
                                 * @methodOf light.tree.lightd
                                 * @description 获取选中的节点
                                 * @returns {Object | Array} 单选时为选中节点 data，无选中项时为 undefined；多选时为选中节点 data 组成的数组，无选中项时为 [].
                                 */
                                scope.lightd.getSelected = function () {
                                    var _hashData = ctrl._hashData
                                        ,name;
                                    if (conf.multiselect) {
                                        var nodes=[];
                                        for(name in _hashData){
                                            if (_hashData.hasOwnProperty(name)){
                                                if (_hashData[name]['__selected']==true) nodes.push(_hashData[name]);
                                            }
                                        }
                                        return nodes;
                                    } else {
                                        for(name in _hashData){
                                            if (_hashData.hasOwnProperty(name)){
                                                if (_hashData[name]['__selected']==true) return _hashData[name];
                                            }
                                        }
                                    }
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#select
                                 * @methodOf light.tree.lightd
                                 * @description 选中指定节点
                                 * @param {object} node 要选中的节点 data
                                 */
                                scope.lightd.select = function(node){
                                    selectNode(node);
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#expandNode
                                 * @methodOf light.tree.lightd
                                 * @description 展开指定节点
                                 * @param {object} node 要展开的节点 data
                                 */
                                scope.lightd.expandNode = function(node){
                                    expandNode(node);
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#collapseNode
                                 * @methodOf light.tree.lightd
                                 * @description 折叠指定节点
                                 * @param {object} node 要折叠的节点 data
                                 */
                                scope.lightd.collapseNode = function(node){
                                    collapseNode(node);
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#append
                                 * @methodOf light.tree.lightd
                                 * @description 向 parent 添加子节点 data
                                 * @param {Array} nodes 要添加的节点 data 数组（需要与 dataprovider 结构相同）
                                 * @param {object=} parent 添加到的节点 data，默认为根节点
                                 */
                                scope.lightd.append = function (nodes, parent) {
                                    if (angular.isArray(nodes)) {
                                        registerNode(nodes, parent);
                                        scope.$evalAsync();// 不使用apply，可能由外部ng-事件或$watch触发
                                    }
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#remove
                                 * @methodOf light.tree.lightd
                                 * @description 删除节点 node，及其子节点
                                 * @param {object} node 添加到的节点 data
                                 */
                                scope.lightd.remove = function (node) {
                                    unregisterNode(node);
                                };
                                /**
                                 * @ngdoc method
                                 * @name light.tree.lightd#updateNode
                                 * @methodOf light.tree.lightd
                                 * @description 重置指定节点设置
                                 * @param {object} node 要重置的节点 data
                                 * @param {object} options 节点设置
                                 */
                                scope.lightd.updateNode = function(node, options){
                                    angular.extend(node, options);
                                };
                            }
                        }
                        /*** 子节点 ***/
                        else{
                            /* 数据源监听 */
                            scope.$watch('dataprovider', function (newValue) {
                                if(newValue) {
                                    vm._data = scope.dataprovider;
                                }
                            },false);
                        }
                    }
                });
            }
        };
    }]);

'use strict';
angular.module('light.messagetip', [])
/**
 * @ngdoc service
 * @name light.messagetip.ltMessageTip
 *
 * @description
 * 消息提示窗口
 *
 * 主要功能：<br>
 * （1）支持自定义弹出位置<br>
 * （2）支持内容自定义HTML<br>
 */
    .service('ltMessageTip', ['$document','$timeout','$injector',function ($document,$timeout,$injector) {
        var tipParent=angular.element(window.parent.document.body);
        var tips = [];//窗口列表
        var tip = null;
        var tip_index = 1;//用于生成窗口id
        var _opts;

        /**
         * @ngdoc method
         * @name light.messagetip.ltMessageTip#open
         * @methodOf light.messagetip.ltMessageTip
         * @description 打开消息提示窗口
         *
         * @param {Object} options
         * {<br>
         *  width : Number类型，[可选]窗口宽度，默认自适应<br>
         *  height : Number类型，[可选]窗口高度，默认自适应<br>
         *  title : String类型，标题<br>
         *  position  : String类型，消息框位置，bottom或right<br>
         *  content  : String类型，消息内容，可以使普通字符串或HTML<br>
         *  isshake  : Boolean类型，[可选]弹出窗口后是否抖动，不支持IE9<br>
         *  delay  : Number类型，[可选]弹出窗口后是否延迟自动关闭，单位秒<br>
         *  click : Function类型，[可选]窗体点击回调，可以根据回调方法参数获取具体点击对象<br>
         *  }
         *
         * @return {String} id 弹出框的id
         *
         */
        this.open = function(opts) {
            //初始化参数
            var dest_opts = {
                width: 'auto',
                height: 'auto',
                title: '消息',
                position: 'bottom',
                isshake: false,
                delay: 0,
                click: null
            }
            angular.extend(dest_opts, opts);
            _opts = dest_opts;

            //创建并初始化消息框
            tip = angular.element(generateHTML());
            tip.bind('click', clickHandler);
            tip.data('$id', 'ltMessageTip_'+tip_index++);
            tipParent.append(tip);

            //滑入特效
            tip.css('bottom', '-500px');
            tip.css('right', '-500px');
            if (opts.position == 'bottom') {
                tip.css('right', '5px');
                tip.css('bottom', tip[0].clientHeight+'px');
                tip.css('transition', 'bottom 1s');
                tip.css('bottom', '30px');
            } else if (opts.position == 'right') {
                tip.css('bottom', '30px');
                tip.css('right', tip[0].clientWidth+'px');
                tip.css('transition', 'right 1s');
                tip.css('right', '5px');
            }

            //抖动特效
            if (_opts.isshake) {
                $timeout(function(){
                    tip.css('animation', 'shake-hard 1s');
                    tip.css('-webkit-animation', 'shake-hard 1s');
                }, 1000);
            }

            tips.push(tip);
            return tip.data('$id');
        }

        /**
         * @ngdoc method
         * @name light.messagetip.ltMessageTip#closeOne
         * @methodOf light.messagetip.ltMessageTip
         * @description 关闭消息提示窗口
         *
         * @param {String} id 窗口id
         *
         */
        this.closeOne = function(tipid) {
            closeTip(tipid);
        }

        function clickHandler(e) {
            var isCloseBtn = angular.element(e.target).hasClass('lt-messagetip-close');
            if (isCloseBtn) {
                closeTip(tip.data('$id'));
            } else if (_opts.click != null) {
                _opts.click.$inject = ['e'];
                $injector.invoke(_opts.click,{},{'e':e});
            }
        }

        function closeTip(tipid) {
            tip.unbind('click', clickHandler);
            if (_opts.position == 'bottom') {
                tip.css('bottom', -tip[0].clientHeight + 'px');
            } else if (_opts.position == 'right') {
                tip.css('right', -tip[0].clientWidth + 'px');
            }
            $timeout(function () {
                for (var i=0; i<tips.length; i++) {
                    if (tipid == tips[i].data('$id')) {
                        tips.splice(i, 1);
                        break;
                    }
                }
                tip.remove();
                tip = null;
                if (tips.length > 0) {
                    tip = tips[tips.length-1];
                }
            }, 1000);
        }

        function generateHTML() {
            var w = angular.isNumber(_opts.width)?_opts.width+'px':_opts.width;
            var h = angular.isNumber(_opts.height)?_opts.height+'px':_opts.height;
            var html = [
                '<div class="lt-messagetip-box" style="width:'+w+';height:'+h+';">',
                '<div class="lt-messagetip-head">'+_opts.title+'<span class="lt-messagetip-close glyphicon glyphicon-remove"></span></div>',
                '<div class="lt-messagetip-content">'+_opts.content+'</div>',
                '</div>'
            ];

            if (_opts.delay > 0) {
                $timeout(function(){
                    closeTip();
                }, _opts.delay*1000);
            }

            return html.join('');
        }
    }]
);

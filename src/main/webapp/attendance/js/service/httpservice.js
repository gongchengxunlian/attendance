/**
 * Created by bianbian on 2017/8/4.
 */
service.service('httpService', ['$rootScope', '$q', '$http', 'Upload', function ($rootScope, $q, $http, Upload) {
    //请求参数处理------------------
    this.webroot = "/";
    this.handleParams = function (params) {
        params = params ? params : {};
        return params;
    };

    //创建post请求-------------
    this.c_post = function (url, params) {
        var deferred = $q.defer();
        var url = this.webroot + url;
        var params = this.handleParams(params);
        var promise = $http.post(url, params);
        promise.then(
            // 通讯成功的处理
            function (answer) {
                //在这里可以对返回的数据集做一定的处理,再交由controller进行处理
                answer.status = true;
                deferred.resolve(answer.data);
            },
            // 通讯失败的处理
            function (error) {
                // 可以先对失败的数据集做处理，再交由controller进行处理
                error.status = false;
                deferred.reject(error);
            });
        //返回promise对象，交由controller继续处理成功、失败的业务回调
        return deferred.promise;
    };
    //创建get请求-------------
    this.c_get = function (url, params) {
        var deferred = $q.defer();
        var url = this.webroot + url;
        var params = this.handleParams(params);
        var promise = $http.get(url, {
                params: params
            }
        );
        promise.then(
            // 通讯成功的处理
            function (answer) {
                //在这里可以对返回的数据集做一定的处理,再交由controller进行处理
                answer.status = true;
                deferred.resolve(answer.data);
            },
            // 通讯失败的处理
            function (error) {
                // 可以先对失败的数据集做处理，再交由controller进行处理
                error.status = false;
                deferred.reject(error);
            });
        //返回promise对象，交由controller继续处理成功、失败的业务回调
        return deferred.promise;
    };
    //文件upload请求-------------
    this.file_upload = function (file, url) {
        var deferred = $q.defer();
        var url = this.webroot + url;

        var promise = Upload.upload({
            //服务端接收
            url: url,
            file: file
        });
        promise.then(
            // 通讯成功的处理
            function (answer) {
                //在这里可以对返回的数据集做一定的处理,再交由controller进行处理
                answer.status = true;
                deferred.resolve(answer);
            },
            // 通讯失败的处理
            function (error) {
                // 可以先对失败的数据集做处理，再交由controller进行处理
                error.status = false;
                deferred.reject(error);
            });
        //返回promise对象，交由controller继续处理成功、失败的业务回调
        return deferred.promise;
    };


    /*controller的接口*/

    /*查询所有信息*/
    this.getAll = function (url, params) {
        return this.c_get(url, params);
    };
    /*新增信息*/
    this.addRow = function (url, params) {
        return this.c_post(url, params);
    };
    /*批量删除*/
    this.delRows = function (url, params) {
        return this.c_get(url, params);
    };
    /*删除一条数据*/
    this.delRow = function (url, params) {
        return this.c_post(url, params);
    };

    /*获取一条数据*/
    this.getOneRow = function (url, params) {
        return this.c_post(url, params);
    };

    /*更新一条数据*/
    this.updateRow = function (url, params) {
        return this.c_post(url, params);
    };

    /*导出excel表格*/
    this.exportExcel = function (url, params) {
        if (params) {
            window.open(this.webroot + url + "?adminid=" + params);
        } else {
            window.open(this.webroot + url);
        }
    };
    /*导入excel表格*/
    this.importExcel = function (file, url) {
        return this.file_upload(file, url);
    };


    this.addThird = function (url, params) {
        return this.c_post(url, params);
    };
    /*导入excel表格*/
    this.importExcel = function (url, params) {
        return this.c_post(url, params);
    };
    this.codeUnique = function (url, params) {
        return this.c_post(url, params);
    };
    this.exportExcel1 = function (url, params) {
        window.open(this.webroot + url + "?entpid=" + params);
    };
    this.exportExcelUser = function (url, params) {
        window.open(this.webroot + url + "?mark=" + params);
    };
}]);
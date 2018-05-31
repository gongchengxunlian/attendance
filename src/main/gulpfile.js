// 引入 gulp
var gulp = require('gulp');

//（1）淘宝镜像：npm install -g cnpm --registry=https://registry.npm.taobao.org
//（2）安装gulp: cnpm install -g gulp
//（3）gulp安装到项目本地：cnpm install --save-dev gulp
//（4）安装依赖：cnpm install gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename --save-dev
//（5）引入组件
var jshint = require('gulp-jshint');//安装    cnpm install jshint gulp-jshint --save-dev
var ngAnnotate = require('gulp-ng-annotate');//安装   cnpm install gulp-ng-annotate --save-dev
var concat = require('gulp-concat');//安装    cnpm install gulp-concat --save-dev
var uglify = require('gulp-uglify');//安装    cnpm install gulp-uglify --save-dev
var rename = require('gulp-rename');//安装    cnpm install gulp-rename --save-dev
var minifyCss = require('gulp-minify-css');//安装     cnpm install gulp-minify-css --save-dev



gulp.task('lint', function() {
    gulp.src([
        './webapp/attendance/js/controller/**/*.js',
        './webapp/attendance/js/controller/**/*.js'

    ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//合并，压缩平台登录css文件
gulp.task('login_css', function() {
    gulp.src([				//需要操作的文件
       /* './webapp/common/css/default_login.css',*///登录整体全局css
        './webapp/common/css/login.css' ,//登录css
       /* './webapp/common/css/gotoSystem.css',*/ //选择系统css
        './webapp/common/css/sweetalert.css', //弹出框
        './webapp/common/css/loadingModal.css' //londing遮罩层

    ])
        .pipe(concat('all.min.css')) //合并成一个文件
        .pipe(minifyCss())			//压缩css成一行
        .pipe(gulp.dest('./webapp/common/dist')); //输出文件夹
});



//合并，压缩平台的js文件
gulp.task('attendance_scripts', function() {
    gulp.src([
        './webapp/attendance/js/config/app.js', //加载APP模块
        './webapp/attendance/js/config/route*.js', //加载route模块
        './webapp/attendance/js/config/config.js', //常量配置模块

    ])
        .pipe(ngAnnotate())
        .pipe(uglify())//压缩
        .pipe(concat('all.min.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
        }))
        .pipe(gulp.dest('./webapp/attendance/dist'));
});
//合并，压缩平台css文件
gulp.task('attendance_css', function() {
    gulp.src([				//需要操作的文件
        './webapp/attendance/css/common/**/*.css',//登录整体全局css
        './webapp/attendance/css/common/*.css'
    ])
        .pipe(concat('all.min.css')) //合并成一个文件
        .pipe(minifyCss())			//压缩css成一行
        .pipe(gulp.dest('./webapp/attendance/dist'));   //输出文件夹
});
//合并，压缩平台的controller文件
gulp.task('attendance_controllers', function() {
    gulp.src([
        './webapp/attendance/js/controller/**/*.js', //加载angular模块
    ])
        .pipe(ngAnnotate())
        .pipe(uglify())//压缩
        .pipe(concat('controller.min.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
        }))
        .pipe(gulp.dest('./webapp/attendance/dist'));
});
//合并，压缩平台的service文件
gulp.task('attendance_services', function() {
    gulp.src([
        './webapp/attendance/js/service/*.js', //加载angular模块
    ])
        .pipe(ngAnnotate())
        .pipe(uglify())//压缩
        .pipe(concat('service.min.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
        }))
        .pipe(gulp.dest('./webapp/attendance/dist'));
});

//合并，压缩平台的directive文件
gulp.task('attendance_directive', function() {
    gulp.src([
        './webapp/attendance/js/directive/*.js', //加载angular模块
    ])
        .pipe(ngAnnotate())
        .pipe(uglify())//压缩
        .pipe(concat('directive.min.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
        }))
        .pipe(gulp.dest('./webapp/attendance/dist'));
});

//合并，压缩平台的filter文件
gulp.task('attendance_filters', function() {
    gulp.src([
        './webapp/attendance/js/filter/*.js' //加载angular模块
    ])
        .pipe(ngAnnotate())
        .pipe(uglify())//压缩
        .pipe(concat('filter.min.js'))
        .pipe(uglify({
            mangle: true//类型：Boolean 默认：true 是否修改变量名
        }))
        .pipe(gulp.dest('./webapp/attendance/dist'));
});


// 默认任务
gulp.task('default', function(){
    gulp.run('lint','login_css','attendance_scripts','attendance_css','attendance_services','attendance_directive','attendance_controllers','attendance_filters');

    //考勤系统平台登录css
    gulp.watch('./webapp/common/css/*.css',function () {
        gulp.run('login_css');
    });

    //监听all.min.js的变动
    gulp.watch('./webapp/attendance/js/**/*.js', function(){
        gulp.run('attendance_scripts');
    });

    //监听all.min.css的变动
    gulp.watch('./webapp/attendance/css/**/*.css', function(){
        gulp.run('attendance_css');
    });


    //监听service的变动
    gulp.watch('./webapp/attendance/js/service/*.js', function(){
        gulp.run('attendance_services');
    });

    //监听directive的变动
    gulp.watch('./webapp/attendance/js/directive/*.js', function(){
        gulp.run('attendance_directive');
    });

    //监听controller的变动
    gulp.watch('./webapp/attendance/js/controller/**/*.js', function(){
        gulp.run('attendance_controllers');
    });

    //监听filter的变动
    gulp.watch('./webapp/attendance/js/filter/**/*.js', function(){
        gulp.run('attendance_filters');
    });


});
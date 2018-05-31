/**
 * Created by panzx on 2016/12/30.
 */
app.filter('trustHTML', ['$sce',function($sce){
    return function(html){
        return $sce.trustAsHtml(html)
    }
}]);

app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

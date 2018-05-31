/**
 * Created by 便便 on 2017/2/8.
 */
app.filter('PercentValue', function () {

    return function (o) {

        if (o != undefined && /(^(-)*\d+\.\d*$)|(^(-)*\d+$)/.test(o)) {

            var v = parseFloat(o);

            return Number(Math.round(v * 10000) / 100).toFixed(2) + "%";

        } else {

            return "undefined";

        }

    }

});
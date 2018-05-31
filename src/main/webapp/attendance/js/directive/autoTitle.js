/**
 * Created by huhu on 2018/3/31.
 */

app.directive('autoTitle', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            function getText() {
                var text = elem.text();
                var reg1 = /[ \t]{2,}/g;
				var reg2 = /[ \n]{2,}/g;
				var reg3 = /[ \r\n]{2,}/g;
				if (text.indexOf('{{') == -1){
					text = text.replace(reg1, " ");
					text = text.replace(reg2, "\n");
					text = text.replace(reg3, "\r\n");
					if (attr.title) {
						text = attr.title + text;
					}
                    elem[0].title = text;
                }else {
                    setTimeout(function () {
                        getText();
                    },500);
                }
            }
            getText();
        }
    };
});
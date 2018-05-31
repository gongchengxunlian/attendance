/**
 * Created by feifei on 2017/8/26.
 */

// 创建Inputlist控件
function createInputlist(obj) {
    // INPUTLIST已存在，直接重新排列option
    if($(obj).parent()[0].tagName=="INPUTLIST"){
        sortInputDateOption(obj);
        return;
    }
    // INPUTLIST不存在，构建各种Element
    var datalist_id = obj.getAttribute("datalist");
    var inputdatelist = document.getElementById(datalist_id);
    var inputlist = document.createElement('inputlist');
    var inputshowlist = document.createElement('inputshowlist');
    $(inputdatelist).css({
        "max-height": window.screen.height/3,
        "top": obj.offsetHeight?obj.offsetHeight+2:parseInt($(obj).css("height"))+1,
        // "width": obj.offsetWidth?obj.offsetWidth-parseInt($(inputdatelist).css("border-width"))*2-parseInt($(inputdatelist).css("padding"))*2:"100%",
    });
    inputshowlist.innerText = "▼";
    inputshowlist.setAttribute("datalist",datalist_id);
    var pre = $(obj).prev();
    var pra = $(obj).parent();
    $(inputlist).append(inputshowlist);
    $(inputlist).append(inputdatelist);
    if(pre[0]){
        pre.after(inputlist);
    }else {
        pra.prepend(inputlist);
    }
    $(inputlist).prepend(obj);
    $(inputshowlist).css("padding",parseInt($(inputshowlist).css("padding"))+parseInt($(obj).css("padding")));

}

// 将option重新排版
function sortInputDateOption(obj) {
    var options = [];
    if(obj){
        // 指定input进行构建
        var datalist_id = obj.getAttribute("datalist");
        var option = {
            id:datalist_id,
            option:[]
        };
        // $("#"+datalist_id).slideDown();
        // slideUpTimwOut($("#"+datalist_id));
        $("#"+datalist_id+" option").each(function () {
            option.option.push(this);
        });
        options.push(option);
    }else {
        // 未指定input,全部input进行构建
        $('inputlist').each(function () {
            var option = {
                id:$(this).find("inputdatelist").attr("id"),
                option:[]
            };
            $(this).find("option").each(function () {
                option.option.push(this);
            });
            options.push(option);
        });
    }
    for (var i in options){
        var temp1 = [];
        var temp2 = [];
        var input = $("inputlist input[type='inputlist'][datalist='"+options[i].id+"']");
        input.attr("title","");
        input.attr("realValue","");
        var hasText = false;
        for (var j in options[i].option){
            if(!hasText&&options[i].option[j].innerHTML){
                hasText=true;
            }
            if(options[i].option[j].value==input.val() || ( options[i].option[j].innerHTML==input.val() && options[i].option[j].innerHTML!='')){
                input.attr("title",options[i].option[j].value);
                input.attr("realValue",options[i].option[j].value);
                $(options[i].option[j]).attr("selected","");
                try {
                    var ngModel = input.attr("ng-model");
                    var scope = angular.element(input[0]).scope();
                    scope[ngModel] = options[i].option[j].value;
                }catch (e){
                    console.log(e);
                }
            }else {
                $(options[i].option[j]).removeAttr("selected");
            }
            if(options[i].option[j].value.indexOf(input.val())!=-1 || ( options[i].option[j].innerHTML.indexOf(input.val())!=-1 && options[i].option[j].innerHTML!='' )){
                if (options[i].option[j].value==input.val() || options[i].option[j].innerHTML==input.val()){
                    temp1.splice(0,-1,options[i].option[j]);
                }else {
                    temp1.push(options[i].option[j]);
                }
            }else {
                temp2.push(options[i].option[j]);
            }
        }
        for (var k in temp2)temp1.push(temp2[k]);
        var inputdatelist = $("#"+options[i].id);
        inputdatelist.html('');
        for (var u in temp1){
            inputdatelist.append(temp1[u]);
        }
        // if(hasText){
        createOptionText(inputdatelist[0],hasText);
        // }
        addEventOption(inputdatelist[0]);
    }
}

// 给option添加点击事件
function addEventOption(inputdatelist) {
    var datalist_id = $(inputdatelist).attr("id");
    $(inputdatelist).find("option").each(function () {
        $(this).click(function () {
            $("input[datalist='"+datalist_id+"']").val(this.value);
            sortInputDateOption();
            $(inputdatelist).slideUp("fast");
        });
    });
}

// 定时5秒后下拉框隐藏
var slideUpTimwOut_Time = [];
function slideUpTimwOut(obj) {
    clearSlideUpTimwOut(obj);
    var slideUpTimwOut_time = setTimeout(function () {
        obj.slideUp("fast");
    },5000);
    slideUpTimwOut_Time.push({
        id:obj[0].id,
        timeout:slideUpTimwOut_time
    });
}

// 清除定时下拉框隐藏
function clearSlideUpTimwOut(obj) {
    for(var i in slideUpTimwOut_Time){
        if(slideUpTimwOut_Time[i].id==obj[0].id){
            clearTimeout(slideUpTimwOut_Time[i].timeout);
            slideUpTimwOut_Time.splice(i,1);
        }
    }
}

/*将下拉内容格式
┌──────────┐
│text               ┃
│text               ┃
└──────────┘
改写成
┌──────────┐
│text         value ┃
│text         value ┃
└──────────┘*/
function createOptionText(obj,hasText) {
    $(obj).find("option").each(function () {
        var optionlist = document.createElement("optionlist");
        var optiontext =  document.createElement("optiontext");
        $(optiontext).css({
            "padding":$(this).css("padding")
        });
        optiontext.innerText = this.value;
        optiontext.title = this.value;
        $(optiontext).click(function () {
            $(this).prev().click();
        });
        if(hasText){
            $(optionlist).append(this);
            $(optionlist).append(optiontext);
        }else {
            $(optionlist).append(optiontext);
            $(optionlist).append(this);
        }
        $(obj).append(optionlist);
        if($(this).attr("selected")){
            $(this).parent().css("background-color","#c7fbea");
        }else {
            $(this).parent().css("background-color","");
        }
    });
}

//显示和隐藏下拉单
function inputshowlistslide(obj) {
    var datalist_id = obj.getAttribute("datalist");
    var inputdatelist = document.getElementById(datalist_id);
    if($(inputdatelist).css("display")=="none"){
        $(inputdatelist).slideDown("fast");
        slideUpTimwOut($(inputdatelist));
    }else {
        $(inputdatelist).slideUp("fast");
    }
}

//检索Inputlist
function searchInputlist(obj) {
    if(obj){
        createInputlist(obj);
        obj.onkeyup = function () {
            sortInputDateOption(this);
            var datalist_id = $(this).attr("datalist");
            $("#"+datalist_id).slideDown();
            slideUpTimwOut($("#"+datalist_id));
        };
        $(obj).next()[0].onclick = function () {
            inputshowlistslide(this);
        };
        $(obj).next().next().hover(function () {
            clearSlideUpTimwOut($(this));
        },function () {
            slideUpTimwOut($(this));
        });
        sortInputDateOption(obj);
    }else {
        $("input[type='inputlist']").each(function () {
            createInputlist(this);
        });
        $("input[type='inputlist']").each(function () {
            this.onkeyup = function () {
                sortInputDateOption(this);
                var datalist_id = $(this).attr("datalist");
                $("#"+datalist_id).slideDown();
                slideUpTimwOut($("#"+datalist_id));
            };
        });
        $("inputshowlist").each(function () {
            this.onclick = function () {
                inputshowlistslide(this);
            };
        });
        $("inputdatelist").each(function () {
            $(this).hover(function () {
                clearSlideUpTimwOut($(this));
            },function () {
                slideUpTimwOut($(this));
            });
        });
        sortInputDateOption();
    }
}


// angular调用方式
// ng-class="createinputlist($index,'orgP')"
/*var createinputlistOption = '';
$scope.createinputlist = function (count,id) {
    if(count===$scope.root.data.length-1&&createinputlistOption.indexOf(id+',')==-1){
        searchInputlist($("input[type='inputlist'][datalist='"+id+"']")[0]);
        createinputlistOption+=id+',';
    }
};*/

// 普通使用方式
// searchInputlist();

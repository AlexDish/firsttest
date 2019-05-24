/// <reference path="jquery-1.4.1.js" />
var DM5_IF_ACTION = false;
var DM5_SHOWPOP_INDEX = 1;
var DM5_SHOWWIN_INDEX = 1;
var DM5_SHOWPOP_TIME = 12;
var DM5_SHOWPOP_TIME_STOP = false;
var DM5_SHOWPOP_ShanSHUO_STOP = null;
$(function () {
    $("#left_NewBgt_a").click(function (event) {
        if (window.event) {
            event.cancelBubble = true; //IE

        }
        event.stopPropagation();
    });
    $("#right_NewBgt_a").click(function (event) {
        if (window.event) {
            event.cancelBubble = true; //IE
        }
        event.stopPropagation();
    });
});
function delarr(arr, n) {
    var v = new Array(arr.length - 1);
    var j = 0;
    for (var i = 0; i < arr.length; i++) {
        if (n != i) {
            v[j] = arr[i];
            j++;
        }
    }
    return v;
}
function addarr(name, v) {
    var arr = v.join(",");
    $.cookie(name, arr, { path: "/", expires: 1, domain: "dm5.com" });
}
function getarr(name) {
    var v = $.cookie(name);
    var arr = [];
    if (v) {
        arr = v.split(",");
    }
    return arr;
}
function setCookieTime(cName, value, cExpires) {
    if (!cExpires || cExpires <= 0) {
        cExpires = 12;

    }
    var cookie_time;
    try {
        cookie_time = parseFloat(cExpires) * 1;
    }
    catch (e) {
        cookie_time = 86400;
    }

    if (isNaN(cookie_time)) {
        cookie_time = 86400;
    }
    var then = new Date();
    then.setTime(then.getTime() + cookie_time * 60 * 1000);
    document.cookie = cName + '=' + value + ';expires=' + then.toGMTString() + ';path=/;';
}

function getCookieTime(name) {
    return $.cookie(name);
}

function isshowwin() {
    if (typeof (DM5_FLOAT_INDEX) == "undefined") {
        DM5_FLOAT_INDEX = 1;
    }
    if (DM5_FLOAT_INDEX == DM5_SHOWWIN_INDEX) {
        return !getCookieTime("dm5popwin");
    }
        return false;
}

var tc_state = 0;
function tc_click(url, obody, minute, rock) {
    if (typeof (rock) == "undefined" || rock == 0 || typeof (DM5_IMAGE_COUNT) == "undefined") {
        DM5_SHOWWIN_INDEX = 1;
    }
    else {
        DM5_SHOWWIN_INDEX = Math.round(rock * DM5_IMAGE_COUNT * 0.01);

        if (DM5_SHOWWIN_INDEX > DM5_IMAGE_COUNT) {
            DM5_SHOWWIN_INDEX = DM5_IMAGE_COUNT;
        }
        else {
            if (DM5_SHOWWIN_INDEX < 1) {
                DM5_SHOWWIN_INDEX = 1;
            }
        }
    }
    if (isshowwin()) {
        var uagent = navigator.userAgent;
        popobject = {
        };
        popobject.ver = {
            ie: /MSIE/.test(uagent),
            ie6: !/MSIE 7\.0/.test(uagent) && /MSIE 6\.0/.test(uagent) && !/MSIE 8\.0/.test(uagent),
            tt: /TencentTraveler/.test(uagent),
            i360: /360SE/.test(uagent),
            sogo: /SE/.test(uagent),
            gg: window.chrome,
            opera: /Opera/.test(uagent),
            _v1: '<object id="p01" width="0" height="0" classid="CLSID:6BF5' + '2A52-394' + 'A-1' + '1D3-B15' + '3-00' + 'C04F' + '79FAA6"></object>',
            _v2: '<object id="p02" style="position:absolute;left:1px;top:1px;width:1px;height:1px;" classid="clsid:2D' + '360201-FF' + 'F5-11' + 'd1-8D0' + '3-00A' + '0C95' + '9BC0A"></object>'
        };
        popobject.fs = null; popobject.fdc = null; popobject.timeid = 0; popobject.first = 1; popobject.url = url; popobject.w = 0; popobject.h = 0; popobject.gowin = null;
        popobject.init = function () {
            try {
                if (typeof document.body.onclick == "function") {
                    popobject.fs = document.body.onclick;
                    document.body.onclick = null;
                }
                if (typeof document.onclick == "function") {
                    if (document.onclick.toString().indexOf('clickpp') < 0) {
                        popobject.fdc = document.onclick;
                        document.onclick = function () { popobject.clickpp(popobject.url, popobject.w, popobject.h) }
                    }
                }
            } catch (q) { }
        };
        popobject.donepp = function (c, g) {
            if (tc_state) return;
            try {
                document.getElementById("p01").launchURL(c);
            } catch (q) { }
        };
        popobject.clickpp = function (c, e, f) {
            popobject.open(c, e, f); clearInterval(popobject.timeid); document.onclick = null;
            if (typeof popobject.fdc == "function") try { document.onclick = popobject.fdc } catch (q) { }
            if (typeof popobject.fs == "function") try { document.body.onclick = popobject.fs } catch (q) { }
        }
        popobject.open = function (c, e, f) {
            if (tc_state) return;
            popobject.url = c; popobject.w = e; popobject.h = f;
            if (popobject.timeid == 0) popobject.timeid = setInterval(popobject.init, 100);
            var b = 'height=' + f + ',width=' + e + ',left=0,top=0,toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes';
            var j = 'window.open("' + c + '", "_blank", "' + b + '")';
            var m = null;
            try { m = eval(j); } catch (q) { }
            if (m && !(popobject.first && (popobject.ver.gg || popobject.ver.opera))) {
                self.focus();
                if (popobject.ver.gg) {
                    if (popobject.gowin) {
                        popobject.gowin.close();
                        popobject.gowin = null;
                    }
                }
                tc_state = 1;
                setCookieTime("dm5popwin", "1", minute);
                if (typeof popobject.fs == "function")
                    try {
                        document.body.onclick = popobject.fs;
                    } catch (q) { }
                clearInterval(popobject.timeid);
            } else {
                var i = this, j = false;
                if (popobject.ver.ie || popobject.ver.tt) {
                    document.getElementById("p01");
                    document.getElementById("p02");
                    setTimeout(function () {
                        var obj = document.getElementById("p02");
                        if (tc_state || !obj) return;
                        try {
                            var wPop = obj.DOM.Script.open(c, "_blank", b);
                            if (wPop) {
                                wPop.blur();
                                window.focus();
                                tc_state = 1;
                                setCookieTime("dm5popwin", "1", minute);
                            }
                        } catch (q) { }
                    }, 200);
                }

                if (popobject.first) {
                    if (popobject.ver.gg) {
                        popobject.gowin = m;
                    }
                    popobject.first = 0;
                    try {
                        if (typeof document.onclick == "function") {
                            popobject.fdc = document.onclick;
                        }
                    } catch (p) { }
                    document.onclick = function () {
                        try {
                            if (window.external && window.external.max_version) {
                                c = "/qu.ashx?t=1&&u=" + encodeURIComponent(c);
                            }
                        }
                        catch (e) { }
                        if (popobject.ver.sogo) {

                            c = "/qu.ashx?t=1&&u=" + encodeURIComponent(c);
                        }
                        i.clickpp(c, popobject.w, popobject.h);
                    };



                    if (popobject.ver.ie) {
                        if (window.attachEvent) {
                            window.attachEvent("onload", function () { i.donepp(c, 1); });
                        }
                        else if (window.addEventListener) {
                            window.addEventListener("load", function () { i.donepp(c, 1); }, true);
                        }
                        else {
                            window.onload = function () { i.donepp(c, 1); };
                        }
                    }
                }
            }
        };
        if (popobject.ver.ie || popobject.ver.tt) {
            document.write(popobject.ver._v1);
            document.write(popobject.ver._v2);
        }
        try {
            window.popup = popobject;
            var popset = popup.open(url, window.screen.width, window.screen.height);
            popset.blur();
        } catch (e) {
        }
    }
}
function isshowfloat_tc(id, adtime) {
    if (typeof (DM5_SHOWPOP_ISSHOW) != "undefined" && !DM5_SHOWPOP_ISSHOW) {
        return false;
    }
    if (id && adtime) {
        var cookiename = "dm5_show_pop_" + id;
        var v = $.cookie(cookiename);
        if (typeof (DM5_SHOWPOP_From) != "undefined" || v == "1") {
            if (v != "1") {
                var cookie_time;
                if (!adtime || adtime <= 0) {
                    cookie_time = 12;
                }

                try {
                    cookie_time = parseFloat(adtime) * 1;
                }
                catch (e) {
                    cookie_time = 86400;
                }

                if (isNaN(cookie_time)) {
                    cookie_time = 86400;
                }
                var then = new Date();
                then.setTime(then.getTime() + cookie_time * 60 * 1000);
                document.cookie = cookiename + '=' + 1 + ';expires=' + then.toGMTString() + ';path=/;domain=dm5.com';
            }
            return false;
        }
    }
    if (typeof (DM5_FLOAT_INDEX) == "undefined") {
        DM5_FLOAT_INDEX = 1;
    }
    if (DM5_FLOAT_INDEX == DM5_SHOWPOP_INDEX) {
        return !getCookieTime("dm5_float_tc");
    }
    return false;
}

function float_tc(id, width, height, n, adtime) {
    if (isshowfloat_tc(id, adtime)) {
        var f = $("#" + id);
        f.dialog({
            width: width,
            height: 200,
            resizable: false,
            autoOpen: true,
            modal: true,
            draggable: false,
            title: '广告'
        });
        var f_head = f.parent().find(".ui-widget-header");
        f_head.click(function () { f.dialog("close"); });
        var f_clone = f_head.clone(true);
        var f_diglog = f.parent();
        f.parent().append(f_clone);
        var x = (($(window).width()) / 2 - (parseInt(width) / 2));
        var y = 30;
        f.dialog("option", "position", [x, y]);
        setCookieTime("dm5_float_tc", "true", adtime);
        $(window).scroll(function () {
            f.dialog("option", "position", [x, y]);
        })
    }
}
function float_tc_url(id, width, height, n, adtime) {
    if (isshowfloat_tc(id, adtime)) {
        var bd = $(document.documentElement);
        var f = $("#" + id);
        f.dialog({
            width: width + 10,
            height: height + 28,
            resizable: false,
            autoOpen: true,
            modal: true,
            draggable: false,
            title: '广告',
            close: function (event, ui) {
                bd.css("overflow", "");
                bd.attr("scroll", "yes");
                $(this).dialog("destroy");
                $(this).remove();
            }
        });

        var x = (($(window).width()) / 2 - (parseInt(width) / 2));
        var y = 30;
        f.dialog("option", "position", [x, y]);
        $(window).scroll(function () {
            f.dialog("option", "position", [x, y]);
        });
        bd.css("overflow", "hidden");
        bd.attr("scroll", "no");
        var f_head = f.parent().find(".ui-widget-header");
        f_head.click(function () { f.dialog("close"); });
        var f_clone = f_head.clone(true);
        var f_diglog = f.parent();
        f.parent().append(f_clone);

        setCookieTime("dm5_float_tc", "true", adtime);

    }
    DM5_SHOWPOP_TIME = n;
    closeNum(id);
}

var ttt;
var _isallowclose = true;
function float_tc_openurl(id, url, width, height, n, adtime, waitTime, rock,timeclose) {
    var timeoutclose = -1;
    if (typeof (timeclose) == "undefined") {
        timeoutclose = 6;
    }
    else {
        timeoutclose = timeclose;
    }
  
    if (typeof (rock) == "undefined" || rock == 0) {
        DM5_SHOWPOP_INDEX = 1;
    }
    else {
        DM5_SHOWPOP_INDEX = Math.round(rock * DM5_IMAGE_COUNT * 0.01);

        if (DM5_SHOWPOP_INDEX > DM5_IMAGE_COUNT) {
            DM5_SHOWPOP_INDEX = DM5_IMAGE_COUNT
        }
        else {
            if (DM5_SHOWPOP_INDEX < 1) {
                DM5_SHOWPOP_INDEX = 1;
            }
        }
    }
    if (isshowfloat_tc(id, adtime)) {
        var bd = $(document.documentElement);
        var f = $("#float_tc_pop_" + id);
        var ifurl = $('#float_tc_pop_frame_' + id);
        ifurl.attr('src', url);
        var x = (($(window).width()) / 2 - (parseInt(width) / 2));
        var y = 30;
        f.dialog({
            width: width + 10,
            height: height + 28,
            resizable: false,
            autoOpen: true,
            modal: true,
            draggable: false,
            title: '广告',
            close: function (event, ui) {
                bd.css("overflow", "");
                bd.attr("scroll", "yes");
                $(this).dialog("destroy");
            },
            position: [x, y],
            open: function (event, ui) {
                if (timeoutclose > 0) {
                    floathideclose();
                    timehidwshow(timeoutclose);
                }
                setTimeout(function () {
                    ifurl.hover(function () { DM5_SHOWPOP_TIME_STOP = true; DM5_SHOWPOP_ShanSHUO_STOP = setInterval(flicker, 500); if (ttt) { clearTimeout(ttt); } }, function () { if (DM5_SHOWPOP_TIME_STOP) { DM5_SHOWPOP_TIME_STOP = false; ttt = setTimeout(function () { closeNum("float_tc_pop_" + id); }, 100); } });
                    $(window).blur(function () { if (DM5_SHOWPOP_TIME_STOP) { DM5_SHOWPOP_TIME_STOP = false; ttt = setTimeout(function () { closeNum("float_tc_pop_" + id); }, 100); } });
                }, 1000);
            }
        });
        bd.css("overflow", "hidden");
        bd.attr("scroll", "no");
        var f_head = f.parent().find(".ui-widget-header");
        f_head.click(function () { if (_isallowclose) { f.dialog("close"); } });
        var f_clone = f_head.clone(true);
        var f_diglog = f.parent();

        f.parent().append(f_clone);

        $(".ui-dialog-titlebar-close").unbind("mouseover");
        $(".ui-dialog-titlebar-close").unbind("mouseout");
        $(".ui-dialog-titlebar-close").bind("mouseover", function (event) { $(this).addClass("ui-state-hover"); });
        $(".ui-dialog-titlebar-close").bind("mouseout", function (event) { $(this).removeClass("ui-state-hover"); });

        var isload = false;
        var beginCountingAD = false;
        var stime = adtime / 60 + "小时";

        waitTime = waitTime || 5;


        if (waitTime) {
            setTimeout(function () {
                if (!beginCountingAD) {
                    beginCountingAD = true;
                    DM5_SHOWPOP_TIME = n;
                    $(".ui-dialog-title").html("<span class=\"ui-dialog-adtime-title\">广告剩余 <font class=\"hongzi time_ft\"> " + DM5_SHOWPOP_TIME + " </font> 秒</span>");
                    f_head.find(".ui-dialog-title").after("<span class=\"ui-dialog-title\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离下次显示时间还有：" + stime + "</span>");
                    closeNum("float_tc_pop_" + id);
                }
            }, 1000 * waitTime);
        }
        ifurl.load(function () {
            if (!isload) {
                var dt = new Date();
                dt = dt.setMinutes(dt.getMinutes() + adtime);
                dt = new Date(dt);
                isload = true;
                f.dialog("open");
                setCookieTime("dm5_float_tc", "true", adtime);

                if (!beginCountingAD) {
                    beginCountingAD = true;
                    DM5_SHOWPOP_TIME = n;
                    $(".ui-dialog-title").html("<span class=\"ui-dialog-adtime-title\">广告剩余 <font class=\"time_ft hongzi\"> " + DM5_SHOWPOP_TIME + " </font> 秒 </span>");
                    f_head.find(".ui-dialog-title").after("<span class=\"ui-dialog-title\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离下次显示时间还有：" + stime + "</span>");
                    closeNum("float_tc_pop_" + id);
                    
                }
            }
        });
        $(window).scroll(function () {
            f.dialog("option", "position", [x, y]);
        });

        setCookieTime("dm5_float_tc", "true", adtime);

    }
}

function float_tc_close(id) {
    $("#" + id).dialog("close");
    $("#" + id).dialog("destroy");
    $("#" + id).remove();
}
function closeNum(id) {
    if (DM5_SHOWPOP_ShanSHUO_STOP != null) {
        clearInterval(DM5_SHOWPOP_ShanSHUO_STOP);
        $('.ui-dialog-adtime-title').css('visibility', 'visible');
        DM5_SHOWPOP_ShanSHUO_STOP = null;
    }
    $(".time_ft").text(" " + DM5_SHOWPOP_TIME + " ");
    if (DM5_SHOWPOP_TIME <= 0) {
        clearTimeout(ttt);
        float_tc_close(id);
        return;
    }
    DM5_SHOWPOP_TIME = DM5_SHOWPOP_TIME - 1;
    ttt = setTimeout(function () { closeNum(id); }, 1000);
}
function flicker() {
    $('.ui-dialog-adtime-title').visibilityToggle();
}

function floathideclose() {
    $(".ui-dialog-titlebar-close").hide();
    _isallowclose = false;
}

var flicker_closecount = 6;
function flicker_close() {
    var bt = $(".ui-dialog-titlebar-close");
    bt.toggle();
    flicker_closecount--;
    if (flicker_closecount > 0) {
        setTimeout("flicker_close()", 500);
    }

}
function floathideshow() {
    var bt = $(".ui-dialog-titlebar-close");
    bt.show();
    setTimeout("flicker_close()", 500);
}
function timehidwshow(timeout) {
    setTimeout('floathideshow()', timeout*1000+1000)
}

jQuery.fn.visibilityToggle = function () {
    return this.css('visibility', function (i, visibility) {
        return (visibility == 'visible') ? 'hidden' : 'visible';
    });
}

			
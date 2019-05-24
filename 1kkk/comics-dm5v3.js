/// <reference path="jquery-1.4.1.js" />
var DM5_N = 3;
var DM5_NUM = "num";
var DM5_ISLOGINSHOW = false;
//鼠标在广告区域标识
var DM5_ISINADVERTIS = false;
//鼠标在支付区域标识
var DM5_ISINPAY = false;
//当前广告组ID
var DM5_AdGroupID = 0;
//当前页类型
var DM5_PageType = 0;
//当前广告ID
var DM5_AdID = 0;
var DM5_AID = 0;
var DM5_AdGroupQueue = [];

//广告文件采集队列
var DM5_AdFilesQueue = new Array();
var DM5_ISEMAILSHOW = false;
var DM5_EMAIL_DIAG;
$(function () {
    if ($(".btn_collection").length > 0) {
        if ($(".btn_collection").length == 1) {
            $(".btn_collection").each(function () {
                var mid = $(this).attr("mid");
                var collection = $(this);
                $.ajax({
                    url: 'userdata.ashx?d=' + new Date().getTime(),
                    dataType: 'json',
                    data: { tp: 7, mid: mid },
                    type: 'POST',
                    success: function (data) {
                        if (data && data.msg == "1") {
                            collection.addClass("active");
                            collection.html('<i class="icon icon-fav2-full"></i>已收藏');
                        }
                    }
                });
            });
        }
        else {
            var collmids = "";
            $(".btn_collection").each(function () {
                var mid = $(this).attr("mid");
                collmids += mid + ",";

            });
            $.ajax({
                url: 'userdata.ashx?d=' + new Date().getTime(),
                dataType: 'json',
                data: { tp: 13, mids: collmids },
                type: 'POST',
                success: function (data) {
                    if (data && data.comicids) {
                        $(".btn_collection").each(function () {
                            var mid = parseInt($(this).attr("mid"));
                            if ($.inArray(mid, data.comicids) >= 0) {
                                $(this).addClass("active");
                                $(this).html('<i class="icon icon-fav2-full"></i>已收藏');
                            }
                        });
                    }
                }
            });
        }
    }
    showerrorlog();

    $(window).unbind("blur");

    $(window).blur(function () {
        if (DM5_ISINADVERTIS) {
            DM5_ISINADVERTIS = false;
            if (DM5_AdGroupID > 0 || DM5_AID > 0) {
                $.ajax({
                    url: '/adgroup.ashx?d=' + new Date().getTime(),
                    dataType: 'json',
                    async: false,
                    data: { gid: DM5_AdGroupID, pagetype: DM5_PageType, aid: DM5_AdID, naid: DM5_AID, language: 1 },
                    error: function (msg) {
                    },
                    success: function (json) {
                        if (json.Value == "0") {
                            $(".clDiv").each(function () {
                                var groupid = $(this).attr("AdGroupID");
                                var repTag = $(this).attr("RepTag");
                                var nlid = $(this).attr("aid");
                                var aid = $(this).attr("adid");
                                var t = $(this);
                                if (groupid == DM5_AdGroupID && groupid != 0) {
                                    setTimeout(function () {
                                        if (typeof (json.Items) != 'undefined') {
                                            for (var i = 0; i < json.Items.length; i++) {
                                                if (json.Items[i].Locationid == aid && json.Items[i].Adid != nlid && json.Items[i].Codeid > 0) {
                                                    var classname = "";
                                                    if (typeof (json.Items[i].isrefresh) != 'undefined' && json.Items[i].isrefresh) {
                                                        classname = "fastrefresh";
                                                    }
                                                    var frame = "<iframe frameborder='no' marginwidth='0' marginheight='0' scrolling='no' allowtransparency='yes' width='" + t.width() + "px' height='" + t.height() + "px' id='frame_" + json.Items[i].Codeid + "' src='wxhfm.html?cid=" + json.Items[i].Codeid + "' class='" + classname + "'></iframe>";
                                                    t.html(frame);
                                                    t.attr("AdGroupID", json.Items[i].AdGroupid);
                                                    t.attr("aid", json.Items[i].Adid);
                                                    adjs();
                                                    return;
                                                }
                                            }
                                        }
                                        t.hide();
                                        if ($("#" + repTag).length > 0) {
                                            $("#" + repTag).hide();
                                        }
                                        adjs();
                                    }, 500);
                                }
                                else if (nlid == DM5_AID) {
                                    setTimeout(function () {
                                        if (typeof (json.Items) != 'undefined') {
                                            for (var i = 0; i < json.Items.length; i++) {
                                                if (json.Items[i].Locationid == aid && json.Items[i].Adid != nlid && json.Items[i].Codeid > 0) {
                                                    var classname = "";
                                                    if (typeof (json.Items[i].isrefresh) != 'undefined' && json.Items[i].isrefresh) {
                                                        classname = "fastrefresh";
                                                    }
                                                    var frame = "<iframe frameborder='no' marginwidth='0' marginheight='0' scrolling='no' allowtransparency='yes' width='" + t.width() + "px' height='" + t.height() + "px' id='frame_" + json.Items[i].Codeid + "' src='wxhfm.html?cid=" + json.Items[i].Codeid + "' class='" + classname + "'></iframe>";
                                                    t.html(frame);
                                                    t.attr("AdGroupID", json.Items[i].AdGroupid);
                                                    t.attr("aid", json.Items[i].Adid);
                                                    adjs();
                                                    return;
                                                }
                                            }
                                        }
                                        t.hide();
                                        if ($("#" + repTag).length > 0) {
                                            $("#" + repTag).hide();
                                        }
                                        adjs();
                                    }, 500);
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

function adLimit() {
    $(".clDiv").each(function () {
        //广告点击次数限制
        var left = $(this).offset().left;
        var right = $(this).offset().left + $(this).width();
        var top = $(this).offset().top;
        var bottom = $(this).offset().top + $(this).height();
        $(this).mouseover(function (e) {
            $(window).focus();
            DM5_ISINADVERTIS = !DM5_ISINPAY;
            DM5_AdGroupID = $(this).attr("AdGroupID");
            DM5_AdID = $(this).attr("AdID");
            DM5_AID = $(this).attr("AID");
        }).mouseleave(function (e) {
            if (e.clientX != -1 && (e.clientX <= left || e.clientX >= right || (e.clientY + $(window).scrollTop()) <= top || (e.clientY + $(window).scrollTop()) >= bottom)) {
                DM5_ISINADVERTIS = false;
            }
        });
        var thisHeight = parseInt($(this).css("height").replace("px", ""));
        var thisWidth = parseInt($(this).css("width").replace("px", ""));
        var obj = $(this).children().not("script").each(function () {
            try {
                if (!$(this).is("iframe")) {
                    $(this).width(thisWidth).height(thisHeight).css("float", "left").css("overflow", "hidden");
                }
            }
            catch (err) { }
        });
        try {
            $(this).height(thisHeight).width(thisWidth);
        }
        catch (err)
        { }
        var left = $(this).width() + parseInt($(this).css("padding-right").replace("px", ""))
            + parseInt($(this).css("border-right-width").replace("px", ""));
        var top = parseInt($(this).css("padding-top").replace("px", ""))// + parseInt($(this).css("margin-top").replace("px", ""))
            + parseInt($(this).css("border-top-width").replace("px", ""));
        if (getIEBrowserVer() < 8) {
            top += $(this).height();
        }
        return;
    });
}
function adFileLimit(clDiv, adgroupid, adid) {
    if (adgroupid == 0 && adid == 0) return;
    if (clDiv.html()) {
        if (clDiv.html().toLowerCase().indexOf("<iframe") >= 0) {
            var regIframe = new RegExp("<iframe[\\s\\S]+?id=\"?([\\s\\S]+?)\"? ", "i");
            var iframeId = regIframe.exec(clDiv.html());
            if (iframeId != null) {
                var fid = iframeId[1];
                if (fid) {
                    var iframe = document.getElementById(fid);
                    fn = function () {
                        var contents = $("#" + fid).contents();
                        if (adgroupid > 0) {
                            var content = AdShieldFilter(adgroupid, $($("#" + fid).contents()[0].documentElement).html());
                            if (content != $($("#" + fid).contents()[0].documentElement).html())
                                clDiv.html(content);
                        }
                        if (adid > 0 && $("#" + fid).contents().length > 0)
                            CollectAdShield(adid, $($("#" + fid).contents()[0].documentElement).html());
                    };
                    if (iframe.attachEvent) {
                        try {
                            iframe.attachEvent("onload", fn);
                        } catch (ex) { }
                    } else {
                        iframe.onload = fn;
                    }
                }
            }
        }
        else {
            if (adgroupid > 0) {
                var content = AdShieldFilter(adgroupid, clDiv.html());
                if (content != clDiv.html())
                    clDiv.html(content);
            }
            if (adid > 0)
                CollectAdShield(adid, clDiv.html());
        }
    }
}

function addtogroup(lid, adgroupid, adid, adtag) {
    //    var o = new Object();
    //    o.GroupID = adgroupid;
    //    o.AdId = adid;
    //    o.Tag = adtag;
    //    DM5_AdGroupQueue.push(o);
    var o = $("#" + adtag);
    o.attr("AdGroupID", adgroupid);
    o.attr("AdID", lid);
    o.attr("AID", adid);
    o.addClass("clDiv");
}
function AdShieldFilter(adgroupid, content) {
    if (DM5_ADShields) {
        for (var i = 0; i < DM5_ADShields.length; i++) {
            if (adgroupid == DM5_ADShields[i].ID && DM5_ADShields[i].AdShield != "") {
                var adShields = DM5_ADShields[i].AdShield.split("{换行符}");
                for (var j = 0; j < adShields.length; j++)
                    if (content.indexOf(adShields[j]) >= 0)
                        return DM5_ADShields[i].AdShieldReplace;
            }
        }
    }
    return content;
}
function CollectAdShield(adid, content) {
    if ($.cookie("CollectAdShield") && $.cookie("CollectAdShield").indexOf("," + adid + ",") >= 0) {
        return;
    }
    if (DM5_AdItemCollectFiles.Ids.indexOf("," + adid + ",") >= 0) {
        var collectUrl = "";
        var reEmbed = new RegExp("(<embed[^>]+?>)");
        var emb = reEmbed.exec(content.toLowerCase());
        if (emb == null) {
            var reObject = new RegExp("(<object[^>]+>[\\s\\S]+?</object>)");
            var obj = reObject.exec(content.toLowerCase());
            if (obj) {
                var data = new RegExp("data=(?:'|\")([\\s\\S]+?)(?:'|\")").exec(obj[1])
                if (data)
                    collectUrl = data[1];
            }
        }
        else {
            var src = new RegExp("src=(?:'|\")([\\s\\S]+?)(?:'|\")").exec(emb[1])
            if (src)
                collectUrl = src[1];
        }

        if (collectUrl != "") {
            collectUrl = collectUrl.indexOf("?") > 0 ? collectUrl.substring(0, collectUrl.indexOf("?")) : collectUrl;
            var cadids = "";
            if ($.cookie("CollectAdShield") && collectUrl != "")
                cadids = $.cookie("CollectAdShield") + adid + ",";
            else if (collectUrl != "")
                cadids = "," + adid + ",";
            if (cadids != "")
                $.cookie("CollectAdShield", cadids, { path: "/", expires: "1" });

            var adFileObj = { "adid": adid, "curl": collectUrl };
            DM5_AdFilesQueue[DM5_AdFilesQueue.length] = adFileObj;
        }
    }
}

function AdFileCollect() {
    if (DM5_AdFilesQueue.length > 0) {
        var adids = "";
        var curls = "";
        for (var i = 0; i < DM5_AdFilesQueue.length; i++) {
            adids += (adids == "" ? "" : ",") + DM5_AdFilesQueue[i].adid;
            curls += (curls == "" ? "" : ",") + DM5_AdFilesQueue[i].curl;
        }
        $.ajax({
            type: "POST",
            url: "/AdShieldCollector.ashx",
            data: "adids=" + adids + "&curls=" + escape(curls),
            success: function (msg) {

            }
        });
    }
}

function SetIframeAction(iframeName) {
    //    var iframeWindow = window.frames[iframeName];
    var iframeWindow = document.getElementById(iframeName).contentWindow;
    //内容是否加载完
    if (iframeWindow.document.readyState == "complete") {
        $("a", iframeWindow.document).each(function () {
            alert($(this).attr("href"));
        });
    }
    else {
        setTimeout(function () {
            SetIframeAction(iframeName);
        }, 10);
    }
}
function userBrowser() {
    var browserName = navigator.userAgent.toLowerCase();
    if (/msie/i.test(browserName) && !/opera/.test(browserName)) {
        return "IE";
    } else if (/firefox/i.test(browserName)) {
        return "Firefox";
    } else if (/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)) {
        return "Chrome";
    } else if (/opera/i.test(browserName)) {
        return "Opera";
    } else if (/webkit/i.test(browserName) && !(/chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName))) {
        return "Safari";
    } else {
        return "unKnow";
    }
}
function getIEBrowserVer() {
    var ver; //浏览器版本
    var bType; //浏览器类型
    var vNumber; //版本号
    ver = navigator.appVersion;
    bType = navigator.appName;
    if (bType == "Microsoft Internet Explorer") {
        vNumber = parseFloat(ver.substring(ver.indexOf("MSIE") + 5, ver.lastIndexOf("Windows")));
        return vNumber;
    }
    return 9;
}

var DM5_ERROR_DIAG;
function showerrorlog() {
    $("#posterror").click(function () {
        if (!DM5_ERROR_DIAG) {
            $('#ui-dialog').show();
            // $("#errorlog").load("/showerror/?language=1");
            // DM5_ERROR_DIAG = $("#errorlog");
            // DM5_ERROR_DIAG.dialog({
            //     width: 410,
            //     resizable: false,
            //     autoOpen: false,
            //     modal: true,
            //     draggable: false,
            //     title: '报告错误'
            // });
        }
        else {
            $("#errorform").show();
            $("#posting").hide();
            $("#poststatus").text("");
        }
        DM5_ERROR_DIAG.dialog("open");
    });
}

function showerrorlog2() {
    $("#cp_fun_yj").click(function () {
        if (!DM5_ERROR_DIAG) {
            var tf = "<div id='yj_ct' style='display:none'><iframe id=\"createerror_fm\" width=\"800px\" height=\"574px\" marginheight=\"0\" marginwidth=\"0\" scrolling=\"auto\" frameborder=\"0\"></iframe><div>";
            $("#yj_lg").append(tf);
            $("#createerror_fm").attr("src", "/helppop/");
            $("#createerror_fm").load(function () {
                $("#yjloading").hide();
                $("#yj_ct").show();
                //                $("#createerror_fm").contents().find("#txtHelpTargetUrl").val(window.location.href);
                $("#createerror_fm").contents().find("#hdrepage").val(window.location.href);
            });
            //$("#yj_lg").load("/showerror/?language=1&type=2", function () { LoadErrorForm(); });
            DM5_ERROR_DIAG = $("#yj_lg");
            DM5_ERROR_DIAG.dialog({
                width: 800,
                resizable: false,
                autoOpen: false,
                modal: true,
                draggable: false,
                title: '意见反馈'
            });
        }
        else {
            $("#createerror_fm").contents().find(".helpmain").show();
            $("#createerror_fm").contents().find("#posting").hide();
            $("#createerror_fm").contents().find("#txtErrorMsg").text("");
            $("#createerror_fm").height(574);
            //            $("#createerror_fm").contents().find("#txtHelpTargetUrl").val(window.location.href);
            $("#createerror_fm").contents().find("#hdrepage").val(window.location.href);
        }
        DM5_ERROR_DIAG.dialog("open");
        $(window).scroll(function () {
            DM5_ERROR_DIAG.dialog("option", "position", 'center');
        })
    });
}

function posterrorajax() {
    $("#errorform").hide();
    $("#posting").text("数据正在提交中..");
    $("#posting").show();
    var content = $("#txt_errorcontent").val();
    var email = $("#txt_erroremail").val();
    var browserLanguage = $("#hdnBrowserLanguage").val();
    if (content == "" || content.length == 0) {
        $("#poststatus").text("内容不能为空");
        $("#errorform").show();
        $("#posting").hide();
        return;
    }
    if (email == "" || email.length == 0) {
        $("#poststatus").text("请填写您的Email以便我们给您反馈");
        $("#errorform").show();
        $("#posting").hide();
        return;
    }
    else if (!isemail($("#txt_erroremail").val())) {
        $("#poststatus").text("请输入正确的Email以便我们给您反馈");
        $("#errorform").show();
        $("#posting").hide();
        return;
    }
    $.ajax({
        url: 'usererror.ashx?d=' + new Date().getTime(),
        dataType: 'json',
        data: { content: content, email: email, url: DM5_COMIC_URL, browserLanguage: browserLanguage },
        error: function (msg) {
            $("#poststatus").text("网络异常，请稍后再试");
            $("#errorform").show();
            $("#posting").hide();
        },
        success: function (json) {
            if (json.msg == 'success') {
                $("#errorform").hide();
                $("#posting").text("信息提交成功");
                $("#poststatus").text("");
                $("#posting").show();
            }
            else {
                $("#errorform").show();
                $("#poststatus").text(json.error);
                $("#posting").hide();
            }
        }
    });
    return false;
}


function GetFirstChapterUrl(mid, t) {
    $.ajax({
        url: 'dm5.ashx?d=' + new Date().getTime(),
        dataType: 'json',
        data: { mid: mid, lt: 1, action: "getfirstchapterurl" },
        type: 'Get',
        async: false,
        success: function (msg) {
            if (msg.urlkey) {
                $(t).attr("target", '_blank');
                $(t).attr("href", '/' + msg.urlkey + '/');
            } else if (msg.errormessage) {
                ShowDialog(msg.errormessage);
            }
        },
        error: function (msg) {
            ShowDialog("发生异常错误");
        }
    });
}

function showlogin() {
    var html = '<section class="modal-wrap" style="display: table">\n' +
        '    <div class="modal">\n' +
        '        <div class="modal-body login-modal">\n' +
        '            <span class="close" onclick="$(this).parents(\'.modal-wrap\').hide();"><i class="icon icon-close"></i></span>\n' +
        '            <h1>登录</h1>\n' +
        (isSupportPhoneRegister=="true"?'<p class="account-tip">依据《网络安全法》，为保障您的帐号安全与正常使用，请尽快绑定您的手机号，感谢您的理解及支持！</p>\n':'')
        '            <div class="account-login-form">\n' +
        '                <div class="form-wrap">\n' +
        '                    <form>\n' +
        '                        <p class="tip color-main">请输入注册时用的邮箱或者手机号</p>\n' +
        '                        <p><input name="user" type="text" value="" placeholder="您的手机号／邮箱／用户名"></p>\n' +
        '                        <p><input name="pwd" type="password" value="" placeholder="密码"></p>\n' +
        '                        <p class="verify">\n' +
        '                            <input name="verify" type="text" value="" placeholder="验证码">\n' +
        '                            <span><img class="js_verify_img"  src="http://www.dm5.com/image.ashx" alt=""></span>\n' +
        '                            <a href="#" reg-href="http://www.dm5.com/image.ashx" class="reloadimg">换一张</a>\n' +
        '                        </p>\n' +
        '                        <p>\n' +
        '                            <button class="button">立即登录</button>\n' +
        '                        </p>\n' +
        '                        <p class="options">\n' +
        '                            <label><input name="auto" type="checkbox" value="a">自动登录</label>\n' +
        '                            <span class="find-pwd"><a href="#">忘记密码？</a></span>\n' +
        '                            <span class="tabs-link pull-right"><a class="" href="#">去注册</a></span>\n' +
        '                        </p>\n' +
        '                    </form>\n' +
        '                </div>\n' +
        '                <dl class="three">\n' +
        '                    <dt>其他账号登录</dt>\n' +
        '                    <dd><span><img src="{ProtocolHeader}{css}/v<脚本版本号>/{templatepath}/images/account-icon-facebook.png" alt=""></span></dd>\n' +
        '                    <dd><span><img src="{ProtocolHeader}{css}/v<脚本版本号>/{templatepath}/images/account-icon-vk.png" alt=""></span></dd>\n' +
        '                    <dd><span><img src="{ProtocolHeader}{css}/v<脚本版本号>/{templatepath}/images/account-icon-ok.png" alt=""></span></dd>\n' +
        '                    <dd><span><img src="{ProtocolHeader}{css}/v<脚本版本号>/{templatepath}/images/account-icon-instagram.png" alt=""></span></dd>\n' +
        '                    <dd><span><img src="{ProtocolHeader}{css}/v<脚本版本号>/{templatepath}/images/account-icon-twitter.png" alt=""></span></dd>\n' +
        '                    <dd><span><img src="{ProtocolHeader}{css}/v<脚本版本号>/{templatepath}/images/account-icon-rss.png" alt=""></span></dd>\n' +
        '                </dl>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</section>';
    if ($('.modal-wrap .login-modal').length == 0) {
        $('body').append(html);
    }
    $('.modal-wrap .login-modal').parents('.modal-wrap').css('display', 'table');
}


function SetBookmarker(cid, mid, p, uid) {
    if (uid == 0) {
        showlogin();
    }
    else {
        var t = $("#btn_collection" + mid);
        var cancel = 0;
        if (t.length > 0) {
            if (t.hasClass("active")) {
                cancel = 1;
            }
        }
        $.ajax({
            url: 'bookmarker.ashx?d=' + new Date().getTime(),
            dataType: 'json',
            data: { cid: cid, mid: mid, page: p, uid: uid, language: 1, cancel: cancel },
            type: 'POST',
            success: function (msg) {
                if (msg.Value == "1") {
                    if (t.length > 0) {
                        if (t.hasClass("active")) {
                            t.removeClass("active");
                            t.html('<i class="icon icon-fav2"></i>收藏')
                        } else {
                            t.addClass("active");
                            t.html('<i class="icon icon-fav2-full"></i>已收藏')
                        }
                    }
                    if (cancel == 1) {
                        ShowDialog("取消收藏成功");
                    }
                    else {
                        ShowDialog("收藏成功");
                    }
                }
                else if (msg.Value == "2") {
                    ShowDialog("操作失败！书签重复");
                }
                else {
                    ShowDialog("操作失败！参数错误");
                }
            }
        });
    }
};
function isemail(strIn) {
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return myreg.test(strIn);
}
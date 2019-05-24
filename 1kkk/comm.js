/// <reference path="jquery-1.8.3.min.js" />
var isloaduserinfo = false;

//关于用户登录
$(function () {
    //$(".collection").click(
    //    function () {
    //        if (DM5_USERID < 1) {
    //            showLoginModal();
    //        }
    //        else if ("undefined" != typeof indexImg) {
    //            setBookmarker(DM5_CID, DM5_MID, indexImg, DM5_USERID);
    //        }
    //        else if ("undefined" != typeof DM5_PAGE) {
    //            setBookmarker(DM5_CID, DM5_MID, 1, DM5_USERID);
    //        }
    //        else {
    //            setBookmarker(DM5_CID, DM5_MID, 1, DM5_USERID);
    //        }
    //    }

    //);
    //$(".readmode").click(function () {
    //    var mode = $(this).attr("val");
    //    readmode(mode);
    //});
    if ($(".collection").length > 0) {
        var iscollection = true;
        $(".collection").each(function () {
            if (!$(this).hasClass("active")) {
                iscollection = false;
            }
        });
        if (!iscollection) {
            $.ajax({
                url: 'userdata.ashx?d=' + new Date().getTime(),
                dataType: 'json',
                data: { tp: 7, mid: DM5_MID },
                type: 'POST',
                success: function (data) {
                    if (data && data.msg == "1") {
                        $(".collection").each(function () {
                            if ($(this).hasClass("active")) {
                                $(this).addClass("active");
                                if ($(this).hasClass("logo_4")) {
                                    $(this).html('已收藏');
                                }
                            }
                        });
                    }
                }
            });
        }
    }
    $(".collection").click(function () {
        if (DM5_USERID == 0) {
            showLoginModal();
        }
        else {
            var page = 1;
            if ("undefined" != typeof indexImg) {
                page = indexImg;
            }
            else if (typeof (DM5_PAGE) != "undefined") {
                page = DM5_PAGE;
            }
            var collection = $(this);
            if ($(this).hasClass("active")) {
                $.ajax({
                    url: 'bookmarker.ashx?d=' + new Date().getTime(),
                    dataType: 'json',
                    data: { cid: DM5_CID, mid: DM5_MID, page: page, uid: DM5_USERID, language: 1, cancel: 1 },
                    type: 'POST',
                    success: function (msg) {
                        if (msg.Value == "1") {
                            collection.removeClass("active");
                            if (!collection.hasClass("logo_4")) {
                                collection.html('收藏');
                            }
                            $(".collection").each(function () {
                                $(this).removeClass("active");
                                if (!$(this).hasClass("logo_4")) {
                                    $(this).html('收藏');
                                }
                            });
                            ShowDialog("取消收藏");
                            resetbookstatus();
                        }
                        else if (msg.Value == "2") {
                            ShowDialog("取消收藏失败");
                        }
                        else {
                            ShowDialog("取消收藏失败");
                        }
                    }
                });
            }
            else {
                $.ajax({
                    url: 'bookmarker.ashx?d=' + new Date().getTime(),
                    dataType: 'json',
                    data: { cid: DM5_CID, mid: DM5_MID, page: page, uid: DM5_USERID, language: 1 },
                    type: 'POST',
                    success: function (msg) {
                        if (msg.Value == "1") {
                            collection.addClass("active");
                            if (!collection.hasClass("logo_4")) {
                                collection.html('已收藏');
                            }
                            $(".collection").each(function () {
                                $(this).addClass("active");
                                if (!$(this).hasClass("logo_4")) {
                                    $(this).html('已收藏');
                                }
                            });
                            ShowDialog("收藏成功");
                            resetbookstatus();
                        }
                        else if (msg.Value == "2") {
                            ShowDialog("收藏失败");
                        }
                        else {
                            ShowDialog("收藏失败");
                        }
                    }
                });
            }
        }
    });
    $(".userbtn").click(
        function () {
            if (DM5_USERID < 1) {
                showLoginModal();
            }
        }
    ).mouseover(function () {
        showUserInfo();
    });
    $(document).on('click', '.modal-wrap .close', function () {
        $(this).parents('.modal-wrap').hide()

    })
    //刷新验证码
    $(document).on('click', '.reloadimg', function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        console.log("111111", $(this).attr('reg-href') + '?&_=' + new Date().getTime())
        $('.js_verify_img').attr('src', $(this).attr('reg-href') + '?&_=' + new Date().getTime())
    })
});


function resetbookstatus() {
    var $booklist = $('.hover .bookshelf');
    if ($booklist && $booklist.length > 0) {
        $booklist.data('isload', 0);
    }
}


function setBookmarker(cid, mid, p, uid) {
    $.ajax({
        url: 'bookmarker.ashx?d=' + new Date().getTime(),
        dataType: 'json',
        data: { cid: cid, mid: mid, page: p, uid: uid, language: 1 },
        type: 'POST',
        success: function (msg) {
            if (msg.Value == "1") {
                ShowDialog("收藏成功");
                resetbookstatus();
            }
            else if (msg.Value == "2")
                ShowDialog("收藏失败");
            else
                ShowDialog("收藏成功");
        }
    });
}

function getLoginStatus() {
    var result;
    $.ajax({
        url: '/showstatus.ashx?d=' + new Date().getTime(),
        async: false,
        error: function (msg) {
            result = "0";
        },
        success: function (json) {
            result = json;
        }
    });
    return result;
}
function isLogin() {
    var ustatus = getLoginStatus();
    if (!ustatus || ustatus == "0") {
        return false;
    }
    return true;
}

//dish 设置登录
function showLoginModal() {
    $('.modal-wrap .login-modal').parents('.modal-wrap').css('display', 'table');
}
function ShowDialog(title) {
    $("#alertTop_1").text(title);
    $(".alertTop_1").show();
    setTimeout(function () {
        alertTopHide_1();
    }, 1000);
}
function alertTopHide_1() {
    $(".alertTop_1").hide();
    $(".mask").hide();
}
function showUserInfo() {
    if (DM5_USERID > 0 && !isloaduserinfo) {
        $.get("/dm5.ashx", { action: "getuserinfo", t: new Date().getTime() }, function (data) {
            var result = JSON.parse(data);
            if (result && result["isSuccess"]) {
                $(".hover-user .subtitle").text("到期：" + (result["expireTime"] || ""));
                $(".hover-user .line:eq(0) span").text((result["mangaCoin"] || 0));
                $(".hover-user .line:eq(1) span").text((result["giftCoin"] || 0));
                $(".hover-user .line:eq(2) span").text((result["readingCount"] || 0));
                isloaduserinfo = true;
            }
        });
    }
}

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


function getuserinfo(self) {
    var isload = $(self).data("isload");
    if (isload === 0) {
        $.get("/dm5.ashx",
            { action: "getuserinfo", t: new Date().getTime() },
            function (data) {
                var result = JSON.parse(data);
                if (result && result["isSuccess"]) {
                    if (result["isVip"]) {
                        $(".hover-user .subtitle").html("到期：" + (result["expireTime"] || "") +
                            "<a href=\"/vipopen/\" class=\"right\" target=\"_blank\">VIP续费</a>");
                    } else {
                        $(".hover-user .subtitle").html("<a href=\"/vipopen/\" class=\"right\" target=\"_blank\">开通VIP</a>");
                    }
                    $(".hover-user .line:eq(0) span").text((result["mangaCoin"] || 0));
                    $(".hover-user .line:eq(1) span").text((result["giftCoin"] || 0));
                    $(self).data("isload", 1);
                }
            });
    }
}

function getreadhistorys(self) {
    var isload = $(self).data("isload");
    if (isload === 0) {
        $.getJSON("/dm5.ashx", { action: "getreadhistorys", t: new Date().getTime() }, function (data) {
            var $list = $(".hover-list:eq(0) ul").empty();
            if (data && data.items && data.items.length > 0) {
                $(data.items).each(function (index, item) {
                    var str = "<li><div class=\"cover\"><a href=\"/" +
                        item.MUrlKey +
                        "/\"><img src=\"" +
                        item.ShowPicUrlB +
                        "\"></a></div>";
                    str +=
                        "<div class=\"info\"><p class=\"title\" style=\"width: 130px; overflow: hidden; text - overflow: ellipsis; white - space: nowrap;\">";
                    str += "<a href=\"/" + item.MUrlKey + "/\">" + item.MName + "</a></p>";
                    if ($.trim(item.CShowName) !== '') {
                        str += "<p class=\"subtitle\">阅读至&nbsp;&nbsp;<a href=\"/" +
                            item.ReadUrlKey +
                            "/ \" target=\"_blank\">" +
                            (item.CShowName || "") +
                            "</a></p>";
                    } else {
                        str += "<p class=\"subtitle\">尚未阅读</p>";
                    }
                    str +=
                        "<p class=\"tip\" style=\"width: 130px; overflow: hidden; text - overflow: ellipsis; white - space: nowrap;\">更新至&nbsp;&nbsp;" +
                        "<a href=\"/" +
                        item.LastPartTypeKey +
                        "/\" target=\"_blank\" class=\"red\">" +
                        item.LastPartShowName +
                        "</a></p>";
                    str += "</div></li>";
                    $list.append(str);
                });
                $list.next().text("全部历史(" + (data.count || 0) + ")");
                $('.hover-list:eq(0) .block:eq(1)').removeClass('empty');
                $(".hover-list:eq(0) .block:eq(0)").addClass('active');
            } else {
                $(".hover-list:eq(0) .block:eq(0)").removeClass('active');
                $('.hover-list:eq(0) .block:eq(1)').addClass('empty');
            }
            $(self).data("isload", 1);
        });
    }
}


function getbookmarkers(self) {
    var isload = $(self).data("isload");
    if (isload === 0) {
        $.getJSON("/dm5.ashx", { action: "getbookmarkers", t: new Date().getTime() }, function (data) {
            var $list = $(".hover-list:eq(1) ul").empty();
            var $block = $(".hover-list:eq(1) .block:eq(0)");
            var $empty = $(".hover-list:eq(1) .block:eq(1)");
            var $sign = $(".header-bar .hover .red-sign");
            if ($list.length === 0 && $(".hover-list ul").length === 1) {
                $list = $(".hover-list ul").empty();
                $block = $(".hover-list .block:eq(0)");
                $empty = $(".hover-list .block:eq(1)");
            }
            if (data && data.items && data.items.length > 0) {
                $(data.items).each(function (index, item) {
                    var str = "<li><div class=\"cover\"><a href=\"/" +
                        item.MUrlKey +
                        "/\"><img src=\"" +
                        item.MComicPicB +
                        "\"></a></div>";
                    str +=
                        "<div class=\"info\"><p class=\"title\" style=\"width: 130px; overflow: hidden; text - overflow: ellipsis; white - space: nowrap;\">";
                    str += "<a href=\"/" + item.MUrlKey + "/\">" + item.MName + "</a></p>";
                    if ($.trim(item.CShowName) !== '') {
                        str += "<p class=\"subtitle\">阅读至&nbsp;&nbsp;<a href=\"/" +
                            item.LastUrlKey +
                            "/ \" target=\"_blank\">" +
                            (item.CShowName || "") +
                            "</a></p>";
                    } else {
                        str += "<p class=\"subtitle\">尚未阅读</p>";
                    }
                    str +=
                        "<p class=\"tip\" style=\"width: 130px; overflow: hidden; text - overflow: ellipsis; white - space: nowrap;\">更新至&nbsp;&nbsp;" +
                        "<a href=\"/" +
                        item.LastPartTypeKey +
                        "/\" target=\"_blank\" class=\"red\">" +
                        item.LastPartShowName +
                        "</a></p>";
                    str += "</div></li>";
                    $list.append(str);
                });
                $list.next().text("全部收藏(" + (data.count || 0) + ")");
                $block.addClass('active');
                $empty.removeClass('empty');
            } else {
                $block.removeClass('active');
                $empty.addClass('empty');
            }
            $(self).data("isload", 1);
        });
    }
}

function readmode(mode) {
    if (mode == "2") {
        $.cookie("readmode", "1", { path: "/", expires: 365 });
        window.location.reload(true);
    }
    else if (mode == "1") {
        $.cookie("readmode", 2, { path: "/", expires: 365 });
        window.location.reload(true);
    }
}

function getPostCheckStatus() {
    var result;
    $.ajax({
        url: '/showstatus.ashx?real=1&d=' + new Date().getTime(),
        async: false,
        error: function (msg) {
            result = "0";
        },
        success: function (json) {
            result = json;
        }
    });
    return result;
}
function isPostCheck() {
    var ustatus = getPostCheckStatus();
    if (!ustatus || ustatus == "0") {
        return false;
    }
    return true;
}
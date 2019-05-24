/// <reference path="jquery.min.js" />
var zanbtn;
var commentbtn;
var chaptercommentbtn;
var chaptercommentform;
var reCommentbtn;
var commentPID = 0;
var commentUser = "";
var comment;
var commentInput;
var codeInput;
var postForm;
var postpage;
var commentfastbtn;
var btnnewposts;
var btnhotposts;
var itemindex = 0;
var canChaptnerComment = true;
$(function () {
    zanbtn = $(".zanbtn");
    commentbtn = $(".commentbtn");
    recommentbtn = $(".recommentbtn");
    commentInput = $(".comment-input");
    chaptercommentbtn = $(".chaptercommentbtn");
    chaptercommentform = $(".chaptercommentform");
    commentfastbtn = $(".comment-btn-fast");
    postForm = $(".postForm");
    codeInput = $(".code input");
    postpage = $(".bottom-page");
    btnnewposts = $("#btnnewposts");
    btnhotposts = $("#btnhotposts");
    if (typeof (DM5_PAGETYPE) != "undefined") {
        if (DM5_PAGETYPE == 9) {
            getPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE);
            loadPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE);
        }
        else if (DM5_PAGETYPE == 4) {
            getMangaPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE);
            loadMangaPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE);
        }
    }

    var isttt = true;
    codeInput.focus(function () {
        $(this).parent().find("img").show().attr("src", "image.ashx?action=bar&d=" + new Date().getTime());
    });
    recommentbtn.click(function () {
        $('body').addClass('toolbar');
        reComment($(this).attr("pid"), $(this).attr("data"), $(this));
    });
    zanbtn.click(function () {
        praisepost($(this).attr("pid"), $(this));
    });
    postForm.submit(
        function () {
            var $btn = $(this).find('.comment-item .commentbtn');
            if ($btn && $btn.length > 0 && $btn.data('isenable') === 1) {
                var result = commentVerify($(this));
                if (result) {

                    posting($btn, '发表');
                    commentSubmit($(this), function () {
                        $btn.data('isenable', 1);
                    });
                    return false;
                }
                return result;
            } else {
                return false;
            }
        }
    );
    chaptercommentform.submit(function () {
        if (canChaptnerComment) {
            if (chapterSubmit($(this))) {
                canChaptnerComment = false;
                commentSubmit($(this), function () {
                    canChaptnerComment = true;
                });
            }
        }
        return false;
    });
    commentfastbtn.click(
        function () {

        }
    );
    btnnewposts.click(function () {
        if (DM5_PAGETYPE == 9) {
            getPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE);
            loadPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE);
        }
        else if (DM5_PAGETYPE == 4) {
            getMangaPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE);
            loadMangaPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE);
        }
        $(this).find('span').addClass('active')
        btnhotposts.find('span').removeClass('active')
    });
    btnhotposts.click(function () {
        getHotPost(1, 10, DM5_COMIC_MID, 10);
        postpage.html("");
        $(this).find('span').addClass('active')
        btnnewposts.find('span').removeClass('active')
    });
    commentInput.click(function () {
        if (!isLogin()) {
            showLoginModal();
            return false;
        }
        if(isPostCheck())
        {
            showCheckPostModal();
            return false;
        }
    });

    $(document).on('input propertychange', '.js_max_text_length', function (ev) {
        var leng = 2000 - $(this).val().length;
        if ($(this).val().length < 1900) {
            $(this).parent().find('.red').prev().text('请您文明上网，理性发言，注意文明用语');
            $(this).parent().find('.red').text('');
            $(this).parent().find('.red').next().text('');
        } else if (leng >= 0) {
            $(this).parent().find('.red').text(leng);
            $(this).parent().find('.red').next().text('字');
            $(this).parent().find('.red').prev().text('还可以输入');
        } else {
            $(this).parent().find('.red').text((-leng));
            $(this).parent().find('.red').prev().text('超出');
            // var oldtext = $(this).val()
            // $(this).val(oldtext.substring(0, 180))
        }
    });
    $('textarea').keydown(function (event) {
        if (event.ctrlKey && event.keyCode == 13) {
            $(this).parent().find('.comment-item a.btn').click();
        }
    });
});
function getTextCount(item) {
    $(item).parent().find('.red').text(2000 - $(item).val().length);
}
function reComment(pid, user, t) {
    if (!isLogin()) {
        showLoginModal();
        return false;
    }
    if(isPostCheck())
    {
        showCheckPostModal();
        return false;
    }
    var dataid = t.attr('dataid');
    if (dataid == undefined || dataid == '') {
        dataid = 'comment_' + itemindex + "_" + pid;
        t.attr('dataid', dataid);
        itemindex++;
    }

    $(".repostForm").each(function () {
        var _form = $(this);
        var _dataid = _form.attr('commentdataid');
        if (_dataid == dataid)
            return;
        if (_form.css('display') != 'none') {
            $("#comment-input-" + _dataid).val('');
            $("#comment-input-" + _dataid).parent().find('.red');
            _form.hide();
        }
    });

    var cmmentCointainerForm = $("#formpl" + dataid);
    if (cmmentCointainerForm.length < 1) {
        t.parent().parent().after('<form action="/" commentdataid="' + dataid + '" name="formpl" id="formpl' + dataid + '" method="post" class="postForm repostForm" style="margin-top: 20px;" pid="' + pid + '"><textarea class="comment-input js_max_text_length" placeholder="回复 ' + user + '" id="comment-input-' + dataid + '" tocommentuser="' + $.trim(user) + '"></textarea><p class="comment-item"><span class="right"><span>请您文明上网，理性发言，注意文明用语</span><span class="red"></span><span></span><a href="javascript:void(0);" onclick="$(\'#formpl' + dataid + '\').submit();" class="btn commentbtn" data-isenable="1">回复</a></span></p></form>');
        $('textarea').keydown(function (event) {
            if (event.ctrlKey && event.keyCode == 13) {
                $(this).parent().find('.comment-item a.btn').click();
            }
        });
        commentPID = parseInt(pid);
        commentUser = user;
        $("#comment-input-" + dataid).focus();
        $("#comment-input-" + dataid).parent().find('.red');
        $("#formpl" + dataid).submit(
            function () {
                var $btn = $(this).find('.comment-item .commentbtn');
                if ($btn && $btn.length > 0 && $btn.data('isenable') === 1) {
                    var result = commentVerify($(this));
                    if (result) {

                        posting($btn, '回复');
                        commentSubmit($(this), function () {
                            $btn.data('isenable', 1);
                        });
                        return false;
                    }
                    return result;
                } else {
                    return false;
                }
            }
        );
    } else if (cmmentCointainerForm.css('display') == 'none') {
        cmmentCointainerForm.show();
        commentPID = parseInt(pid);
        commentUser = user;
        $("#comment-input-" + dataid).focus();
        $("#comment-input-" + dataid).parent().find('.red');
    }
    else {
        cmmentCointainerForm.hide();
        $('#comment-input-' + dataid).val('');
        $('#comment-input-' + dataid).parent().find('.red');
        commentPID = 0;
        commentUser = "";
    }
}

function commentVerify(form) {
    if (!isLogin()) {
        showLoginModal();
        return false;
    }
    if (isPostCheck()) {
        showCheckPostModal();
        return false;
    }
    var content = form.find(".comment-input").val();
    var codeInput = form.find(".code-input");
    var codeimg = form.find(".codeimg");
    if (content.length < 5) {
        ShowDialog("评论字数不能小于5个");

        return false;
    }
    else if (content.length > 2000) {
        ShowDialog("评论字数不能高于2000字");
        return false;
    }
    else if (codeInput.length > 0 && !validcode(codeimg, codeInput.val(), 1)) {
        ShowDialog("啊勒嘞？验证码不对诶!");
        return false;
    } else if (codeInput.length > 0 && codeInput.val().length == 0) {
        ShowDialog("啊勒嘞？验证码不能为空!");
        return false;
    }
    else {
        return true;
    }
}

function validcode(codeimg, code, action) {
    var result = false;
    var act = "";
    if (action) {
        act = "bar";
    }

    $.ajax({
        url: '/checkcode.ashx?d=' + new Date().getTime(),
        dataType: 'json',
        data: { code: code, action: act },
        async: false,
        error: function (msg) {
        },
        success: function (json) {
            if (json.result == 'success') {
                result = true;
            }
            else {
                if (act == "bar") {
                    codeimg.attr("src", "/image.ashx?action=bar&d=" + new Date());
                }
                else {
                    codeimg.attr("src", "/image.ashx?d=" + new Date());
                }
                result = false;
            }
        }
    });
    return result;
}
function position(id, v) {
    $.ajax({
        url: 'position.ashx?d=' + new Date().getTime(),
        dataType: 'json',
        data: { pid: id, v: v },
        error: function (msg) {
            ShowDialog("操作出现异常");
        },
        success: function (json) {
            ShowDialog("点赞成功");
        }
    });
}

function praisepost(id, t) {
    if (!isLogin()) {
        showLoginModal();
        return false;
    }
    if (isPostCheck()) {
        showCheckPostModal();
        return false;
    }
    var praise = 0;
    if (!$(t).hasClass("active")) {
        praise = 1;
    }
    $.ajax({
        url: 'post.ashx?d=' + new Date().getTime(),
        dataType: 'json',
        data: { pid: id, praise: praise, action: "praisepost" },
        error: function (msg) {
            ShowDialog("操作出现异常");
        },
        success: function (json) {
            if (json.msg == 'success') {
                if (!$(t).hasClass("active")) {
                    $(t).addClass("active");
                    var praisecount = parseInt($(t).text());
                    if (isNaN(praisecount)) {
                        praisecount = 0;
                    }
                    praisecount++;
                    $(t).text(praisecount);
                    ShowDialog("点赞成功");
                }
                else {
                    $(t).removeClass("active");
                    var praisecount = parseInt($(t).text());
                    if (isNaN(praisecount)) {
                        praisecount = 0;
                    }
                    if (praisecount > 0) {
                        praisecount--;
                    }
                    if (praisecount == 0) {
                        $(t).text("赞");
                    }
                    else {
                        $(t).text(praisecount);
                    }
                    ShowDialog("取消点赞成功");
                }
            }
            else {
                if (!$(t).hasClass("active")) {
                    ShowDialog("点赞失败");
                }
                else {
                    ShowDialog("取消点赞成功");
                }
            }
        }
    });
}

function commentSubmit(form, callback) {

    var _commentInput = form.find(".comment-input");
    var content = _commentInput.val();
    var tocommentuser = _commentInput.attr('tocommentuser');
    if (tocommentuser != '' && tocommentuser != null && tocommentuser != undefined) {
        content = '@' + tocommentuser + ' ' + content;
    }

    var code = "";
    if (commentPID != 0) {
        if (content.indexOf("@" + commentUser) == -1) {
            commentPID = 0;
            commentUser = "";
        }
    }
    var codeInput = form.find(".code-input");
    if (codeInput.length > 0) {
        code = codeInput.val();
    }
    var cid = 0;
    if (typeof (DM5_CID) != "undefined") {
        cid = DM5_CID;
    }
    $.ajax({
        url: '/post.ashx?d=' + new Date().getTime(),
        type: 'POST',
        dataType: 'json',
        data: { message: content, code: code, mid: COMIC_MID, cid: cid, commentid: commentPID },
        error: function (msg) {
            ShowDialog("评论发生异常，请重试");
            if (callback != undefined)
                callback();
        },
        success: function (json) {
            if (json.msg == 'success') {
                DM5_POSTCOUNT++;
                $(".commentcount").html("(共有" + DM5_POSTCOUNT + "条评论)");
                $(".vipcommentcount").html(DM5_POSTCOUNT);
                $(".nocomments").hide();
                if (commentPID > 0) {
                    ShowDialog("回复成功");
                }
                else {
                    ShowDialog("评论成功");
                }
                commentPID = 0;
                commentUser = "";
                $(".comment-input").val("");
                if (typeof (DM5_PAGETYPE) != "undefined") {
                    if (DM5_PAGETYPE == 9) {
                        getPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE);
                        loadPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_TIEBATOPICID, DM5_PAGETYPE);
                    }
                    else if (DM5_PAGETYPE == 4) {
                        getMangaPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE);
                        loadMangaPost(DM5_PAGEINDEX, DM5_PAGEPCOUNT, DM5_COMIC_MID, DM5_PAGETYPE);
                    }
                }
                //var href = window.location.href;
                //if (href.indexOf("?") >= 0)
                //{
                //    href = "&clear=1";
                //}
                //else
                //{
                //    href = "?clear=1";
                //}
                //if (window.location.href.indexOf("#topic") == -1) {
                //    window.location.href = href + "#topic";
                //}
                //else {
                //    window.location.href = href;

                //}
            }
            else if (json.msg == 'unlogin') {
                showLoginModal();
            }
            else {
                ShowDialog(json.msg);
            }

            if (callback != undefined)
                callback();
        }
    });
}

function chapterSubmit(form) {
    if (!isLogin()) {
        showLoginModal();
        return false;
    }
    if(isPostCheck())
    {
        showCheckPostModal();
        return false;
    }
    var content = form.find(".comment-input").val();
    var codeInput = form.find(".code-input");
    var codeimg = form.find(".codeimg");
    if (codeInput.length > 0) {
        if (codeInput.val() == "") {
            ShowDialog("验证码必须填写！");
            return false;
        }
        if (!validcode(codeimg, codeInput.val(), 1)) {
            ShowDialog("验证码错误！");
            return false;
        }
    }
    if (content.length < 5) {
        ShowDialog("内容字数不能小于5个！");
        return false;
    }
    else if (content.length > 2000) {
        ShowDialog("评论字数不能高于2000字");
        return false;
    }
    var result = validpost(content);
    if (result.result != '1') {
        ShowDialog(result.msg);
        return false;
    }
    return true;
}

function validpost(content, title) {
    var re = { "result": "0" };
    var type = 2;
    if (title) {
        type = 1;
    }
    else {
        title = "";
    }
    $.ajax({
        url: 'checkpost.ashx?d=' + new Date().getTime(),
        type: "POST",
        dataType: 'json',
        async: false,
        data: { type: type, title: title, content: content },
        error: function (msg) {

        },
        success: function (json) {
            re = json;
        }
    });
    return re;
}

function getPost(pageindex, pagesize, tid, type) {
    var html;
    if (DM5_READMODEL == 1) {
        html = "<div style=\"color:#666666;font-size:13px;width:840px;text-align: center;height:25px;\"><img src=\"" +
            DM5_LOADINGIMAGE + "\" style=\"margin-right: 10px;position: relative;top: 3px;\">加载中</div>";
    } else {
        html = "<div style=\"color:#666666;font-size:13px;width:100%;text-align: center;margin-top: 50px;height:25px;\"><img src=\"" +
            DM5_LOADINGIMAGE + "\" style=\"margin-right: 10px;position: relative;top: 3px;\">加载中</div>";
    }
    $(".postlist").html(html);
    var cid = 0;
    if (typeof (DM5_CID) != "undefined") {
        cid = DM5_CID;
    }
    $.ajax({
        url: 'pagerdata.ashx?d=' + new Date().getTime(),
        data: { pageindex: pageindex, pagesize: pagesize, tid: tid, cid: cid, t: type },
        error: function (msg) {
            //ShowDialog("服务器出现异常请重试");
        },
        success: function (json) {
            re = json;
            var objs = eval(json);
            html = "";
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                html += "<li class=\"dashed\">";
                html += "<div class=\"cover\"><img src=\"";
                html += obj.HeadUrl;
                html += "\"/></div>";
                html += "<div class=\"info\">";
                html += "<p class=\"title\">";
                html += obj.Poster;
                if (obj.VipLevel > 0) {
                    html += "<span class=\"vip\">VIP" + obj.VipLevel + "</span>";
                    if (obj.VipType == 1) {
                        html += "<span class=\"year\">年费</span>";
                    }
                }
                html += "</p>";
                if (obj.ToPostShowDataItems) {
                    var topostcount = obj.ToPostShowDataItems.length;
                    for (var j = 0; j < obj.ToPostShowDataItems.length; j++) {
                        var topost = obj.ToPostShowDataItems[j];
                        if (j == 0) {
                            html += '<ul class="child-list">'
                        }
                        if (topostcount >= 4) {
                            if (j == 1) {
                                html += '<li class="open"><a href="javascript:void(0);" class="openpostbtn" id="openpostbtn' + obj.ID + '" data="' + obj.ID + '">展开全部楼层</a></li>'
                            }
                            if (j == 0 || j == (topostcount - 1)) {
                                html += '<li>';
                            }
                            else {
                                html += '<li class="litopost' + obj.ID + '" style="display:none;">';
                            }
                        }
                        else {
                            html += '<li>';
                        }
                        html += '<div class="cover"><img src="' + topost.HeadUrl + '"></div><div class="info">';
                        html += '<p class="title">' + topost.Poster;
                        if (topost.VipLevel > 0) {
                            html += "<span class=\"vip\">VIP" + topost.VipLevel + "</span>";
                            if (topost.VipType == 1) {
                                html += "<span class=\"year\">年费</span>";
                            }
                        }
                        html += '</p><p class="content">' + topost.PostContent + '</p>';
                        html += '<p class="bottom">' + topost.PostTime + '<span class="right">';
                        html += "<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + topost.Id + "\" ";
                        html += " class=\"zan";
                        if (topost.IsPraise) {
                            html += " active";
                        }
                        html += " zanbtn\">";
                        if (topost.PraiseCount > 0) {
                            html += topost.PraiseCount;
                        }
                        else {
                            html += "赞";
                        }
                        html += "</a>";
                        html += "<a href=\"javascript:void(0)\"";
                        html += " data=\""
                        html += topost.Poster;
                        html += " \" pid=\"";
                        html += topost.Id;
                        html += "\" class=\"";
                        html += "comment recommentbtn";
                        html += "\">";
                        html += "评论";
                        html += "</a></span></p>";
                        if (j == (obj.ToPostShowDataItems.length - 1)) {
                            html += '</ul>'
                        }
                    }
                }
                html += "<p class=\"content\">";
                html += obj.PostContent;
                html += "</p>";
                html += " <p class=\"bottom\">";
                html += obj.PostTime;
                html += "<span class=\"right\">";
                html += "<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + obj.Id + "\" ";
                html += " class=\"zan";
                if (obj.IsPraise) {
                    html += " active";
                }
                html += " zanbtn\">";
                if (obj.PraiseCount > 0) {
                    html += obj.PraiseCount;
                }
                else {
                    html += "赞";
                }
                html += "</a>"
                html += "<a href=\"javascript:void(0)\"";
                html += " data=\""
                html += obj.Poster;
                html += " \" pid=\"";
                html += obj.Id;
                html += "\" class=\"";
                html += "comment recommentbtn";
                html += "\">";
                html += "评论";
                html += "</a></span></p>";
                html += "</div></li>";
            }
            $(".postlist").html(html);
            $(".postlist").find(".recommentbtn").click(function () {
                $('body').addClass('toolbar');
                reComment($(this).attr("pid"), $(this).attr("data"), $(this));
            });
            $(".postlist").find(".openpostbtn").click(function () {
                openpost($(this));
            });
            $(".postlist").find(".zanbtn").click(function () {
                praisepost($(this).attr("pid"), $(this));
            });
        }
    });
}

function getMangaPost(pageindex, pagesize, mid, type) {
    var html = "<div style=\"color:#666666;font-size:13px;width:830px;height:25px;text-align: center;\"><img src=\"" + DM5_LOADINGIMAGE +
        "\" style=\"margin-right: 10px;position: relative;top: 3px;\">加载中</div>";
    $(".postlist").html(html);
    $.ajax({
        url: 'pagerdata.ashx?d=' + new Date().getTime(),
        data: { pageindex: pageindex, pagesize: pagesize, mid: mid, t: type },
        error: function (msg) {
            //ShowDialog("服务器出现异常请重试");
        },
        success: function (json) {
            re = json;
            var objs = eval(json);
            html = "";
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                html += "<li class=\"dashed\">";
                html += "<div class=\"cover\"><img src=\"";
                html += obj.HeadUrl;
                html += "\"/></div>";
                html += "<div class=\"info\">";
                html += "<p class=\"title\">";
                html += obj.Poster;
                if (obj.VipLevel > 0) {
                    html += "<span class=\"vip\">VIP" + obj.VipLevel + "</span>";
                    if (obj.VipType == 1) {
                        html += "<span class=\"year\">年费</span>";
                    }
                }
                html += "</p>";
                if (obj.ToPostShowDataItems) {
                    var topostcount = obj.ToPostShowDataItems.length;
                    for (var j = 0; j < obj.ToPostShowDataItems.length; j++) {
                        var topost = obj.ToPostShowDataItems[j];
                        if (j == 0) {
                            html += '<ul class="child-list">'
                        }
                        if (topostcount >= 4) {
                            if (j == 1) {
                                html += '<li class="open"><a href="javascript:void(0);" class="openpostbtn" id="openpostbtn' + obj.ID + '" data="' + obj.ID + '">展开全部楼层</a></li>'
                            }
                            if (j == 0 || j == (topostcount - 1)) {
                                html += '<li>';
                            }
                            else {
                                html += '<li class="litopost' + obj.ID + '" style="display:none;">';
                            }
                        }
                        else {
                            html += '<li>';
                        }
                        html += '<div class="cover"><img src="' + topost.HeadUrl + '"></div><div class="info">';
                        html += '<p class="title">' + topost.Poster;
                        if (topost.VipLevel > 0) {
                            html += "<span class=\"vip\">VIP" + topost.VipLevel + "</span>";
                            if (topost.VipType == 1) {
                                html += "<span class=\"year\">年费</span>";
                            }
                        }
                        html += '</p><p class="content">' + topost.PostContent + '</p>';
                        html += '<p class="bottom">' + topost.PostTime + '<span class="right">';
                        html += "<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + topost.Id + "\" ";
                        html += " class=\"zan";
                        if (topost.IsPraise) {
                            html += " active";
                        }
                        html += " zanbtn\">";
                        if (topost.PraiseCount > 0) {
                            html += topost.PraiseCount;
                        }
                        else {
                            html += "赞";
                        }
                        html += "</a>";
                        html += "<a href=\"javascript:void(0)\"";
                        html += " data=\""
                        html += topost.Poster;
                        html += " \" pid=\"";
                        html += topost.Id;
                        html += "\" class=\"";
                        html += "comment recommentbtn";
                        html += "\">";
                        html += "评论";
                        html += "</a></span></p>";
                        if (j == (obj.ToPostShowDataItems.length - 1)) {
                            html += '</ul>'
                        }
                    }
                }
                html += "<p class=\"content\">";
                html += obj.PostContent;
                html += "</p>";
                html += " <p class=\"bottom\">";
                html += obj.PostTime;
                html += "<span class=\"right\">";
                html += "<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + obj.Id + "\" ";
                html += " class=\"zan";
                if (obj.IsPraise) {
                    html += " active";
                }
                html += " zanbtn\">";
                if (obj.PraiseCount > 0) {
                    html += obj.PraiseCount;
                }
                else {
                    html += "赞";
                }
                html += "</a>"
                html += "<a href=\"javascript:void(0)\"";
                html += " data=\""
                html += obj.Poster;
                html += " \" pid=\"";
                html += obj.Id;
                html += "\" class=\"";
                html += "comment recommentbtn";
                html += "\">";
                html += "评论";
                html += "</a></span></p>";
                html += "</div></li>";
            }
            $(".postlist").html(html);
            $(".postlist").find(".recommentbtn").click(function () {
                $('body').addClass('toolbar');
                reComment($(this).attr("pid"), $(this).attr("data"), $(this));
            });
            $(".postlist").find(".openpostbtn").click(function () {
                openpost($(this));
            });
            $(".postlist").find(".zanbtn").click(function () {
                praisepost($(this).attr("pid"), $(this));
            });
        }
    });
}

function openpost(t) {
    var val = t.val();
    var pid = t.attr("data");
    $(".litopost" + pid).show();
    t.hide();
}

function postPagerLink(p, pcount) {
    if (pcount <= 1) {
        $(".footer-bar").hide();
        return "";
    }
    if (p < 1) {
        p = 1;
    }
    var html = "&nbsp;";
    var maxlink = 10;
    if (pcount < 1 || p > pcount) {
        $(".footer-bar").hide();
        return "";
    }
    $(".footer-bar").show();
    var midle = maxlink / 2;
    if (pcount <= maxlink) {
        for (var i = 1; i <= pcount; i++) {
            if (i == p) {
                html += "<span class=\"current\">" + i + "</span>";
            }
            else {
                if (i != 1) {
                    html += "<a data='" + i + "'>" + i + "</a>";

                }
                else {
                    html += "<a data='" + i + "'>" + i + "</a>";
                }
            }

        }
    }
    else {
        for (var i = 1; i <= maxlink; i++) {
            if (i > 1 && i < 10) {
                if (p > midle) {
                    if (i == 2) {
                        html += "...";
                        continue;
                    }
                    if ((i == maxlink - 1) && (p > midle) && ((p + midle) < pcount)) {
                        //html += "...";
                        continue;
                    }
                    if ((p + midle) < pcount) {
                        if ((p - midle + i - 1) == p) {
                            html += "<span class=\"current\">" + (p - midle + i - 1) + "</span>";

                        }
                        else {
                            html += "<a data='" + (p - midle + i - 1) + "'>" + (p - midle + i - 1) + "</a>";

                        }
                    }
                    else {
                        if (pcount - (maxlink - i) == p) {
                            html += "<span class=\"current\">" + (pcount - (maxlink - i)) + "</span>";
                        }
                        else {
                            html += "<a data='" + (pcount - (maxlink - i)) + "'>" + (pcount - (maxlink - i)) + "</a>";

                        }
                    }

                }
                else {
                    if ((i == maxlink - 1) && (pcount > maxlink)) {
                        //html += "...";
                        continue;
                    }
                    if (i == p) {
                        html += "<span class=\"current\">" + i + "</span>";
                    }
                    else {
                        html += "<a data='" + i + "'>" + i + "</a>";
                    }
                }
            }
            else {
                if (i == 1) {
                    if (p == i) {
                        html += "<span class=\"current\">" + i + "</span>";
                    }
                    else {
                        html += "<a data='" + (p - 1) + "'><</a>";
                        html += "<a data='" + i + "'>" + i + "</a>";
                    }
                }
                if (i == maxlink) {
                    if (p == pcount) {
                        html += "<span class=\"current\">" + pcount + "</span>";
                    }
                    else {
                        //html += "<a data='" + pcount + "'>" + pcount + "</a>";
                        html += "<a data='" + (p + 1) + "'>></a>";
                    }
                }
            }

        }
    }
    return html;
}

function loadPost(pageindex, pagecount, tid, type) {
    postpage.html(postPagerLink(pageindex, pagecount)).find("a").click(
        function () {
            getPost(parseInt($(this).attr("data")), 10, tid, type);
            loadPost(parseInt($(this).attr("data")), pagecount, tid, type);
            $("html,body").stop().animate({ scrollTop: $(".view-comment-main").offset().top - 20 }, 500);
        }
    );
}

function loadMangaPost(pageindex, pagecount, mid, type) {
    postpage.html(postPagerLink(pageindex, pagecount)).find("a").click(
        function () {
            getMangaPost(parseInt($(this).attr("data")), 10, mid, type);
            loadMangaPost(parseInt($(this).attr("data")), pagecount, mid, type);
            $("html,body").stop().animate({ scrollTop: $(".view-comment-main").offset().top - 100 }, 500);
        }
    );
}


function getHotPost(pageindex, pagesize, mid, type) {
    var html = "<div style=\"color:#666;font-size:13px;width:830px;height:25px;text-align: center;\"><img src=\"" + DM5_LOADINGIMAGE +
        "\" style=\"margin-right: 10px;position: relative;top: 3px;\">加载中</div>";
    $(".postlist").html(html);
    $.ajax({
        url: 'pagerdata.ashx?d=' + new Date().getTime(),
        data: { pageindex: pageindex, pagesize: pagesize, mid: mid, t: 10 },
        error: function (msg) {
            //ShowDialog("服务器出现异常请重试");
        },
        success: function (json) {
            re = json;
            var objs = eval(json);
            html = "";
            for (var i = 0; i < objs.length; i++) {
                var obj = objs[i];
                html += "<li class=\"dashed\">";
                html += "<div class=\"cover\"><img src=\"";
                html += obj.HeadUrl;
                html += "\"/></div>";
                html += "<div class=\"info\">";
                html += "<p class=\"title\">";
                html += obj.Poster;
                if (obj.VipLevel > 0) {
                    html += "<span class=\"vip\">VIP" + obj.VipLevel + "</span>";
                    if (obj.VipType == 1) {
                        html += "<span class=\"year\">年费</span>";
                    }
                }
                html += "</p>";
                if (obj.ToPostShowDataItems) {
                    var topostcount = obj.ToPostShowDataItems.length;
                    for (var j = 0; j < obj.ToPostShowDataItems.length; j++) {
                        var topost = obj.ToPostShowDataItems[j];
                        if (j == 0) {
                            html += '<ul class="child-list">'
                        }
                        if (topostcount >= 4) {
                            if (j == 1) {
                                html += '<li class="open"><a href="javascript:void(0);" class="openpostbtn" id="openpostbtn' + obj.ID + '" data="' + obj.ID + '">展开全部楼层</a></li>'
                            }
                            if (j == 0 || j == (topostcount - 1)) {
                                html += '<li>';
                            }
                            else {
                                html += '<li class="litopost' + obj.ID + '" style="display:none;">';
                            }
                        }
                        else {
                            html += '<li>';
                        }
                        html += '<div class="cover"><img src="' + topost.HeadUrl + '"></div><div class="info">';
                        html += '<p class="title">' + topost.Poster;
                        if (topost.VipLevel > 0) {
                            html += "<span class=\"vip\">VIP" + topost.VipLevel + "</span>";
                            if (topost.VipType == 1) {
                                html += "<span class=\"year\">年费</span>";
                            }
                        }
                        html += '</p><p class="content">' + topost.PostContent + '</p>';
                        html += '<p class="bottom">' + topost.PostTime + '<span class="right">';
                        html += "<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + topost.Id + "\" ";
                        html += " class=\"zan";
                        if (topost.IsPraise) {
                            html += " active";
                        }
                        html += " zanbtn\">";
                        if (topost.PraiseCount > 0) {
                            html += topost.PraiseCount;
                        }
                        else {
                            html += "赞";
                        }
                        html += "</a>";
                        html += "<a href=\"javascript:void(0)\"";
                        html += " data=\""
                        html += topost.Poster;
                        html += " \" pid=\"";
                        html += topost.Id;
                        html += "\" class=\"";
                        html += "comment recommentbtn";
                        html += "\">";
                        html += "评论";
                        html += "</a></span></p>";
                        if (j == (obj.ToPostShowDataItems.length - 1)) {
                            html += '</ul>'
                        }
                    }
                }
                html += "<p class=\"content\">";
                html += obj.PostContent;
                html += "</p>";
                html += " <p class=\"bottom\">";
                html += obj.PostTime;
                html += "<span class=\"right\">";
                html += "<a href=\"javascript:void(0)\" data=\"1\" pid=\"" + obj.Id + "\" ";
                html += " class=\"zan";
                if (obj.IsPraise) {
                    html += " active";
                }
                html += " zanbtn\">";
                if (obj.PraiseCount > 0) {
                    html += obj.PraiseCount;
                }
                else {
                    html += "赞";
                }
                html += "</a>"
                html += "<a href=\"javascript:void(0)\"";
                html += " data=\""
                html += obj.Poster;
                html += " \" pid=\"";
                html += obj.Id;
                html += "\" class=\"";
                html += "comment recommentbtn";
                html += "\">";
                html += "评论";
                html += "</a></span></p>";
                html += "</div></li>";
            }
            $(".postlist").html(html);
            $(".postlist").find(".recommentbtn").click(function () {
                $('body').addClass('toolbar');
                reComment($(this).attr("pid"), $(this).attr("data"), $(this));
            });
            $(".postlist").find(".openpostbtn").click(function () {
                openpost($(this));
            });
            $(".postlist").find(".zanbtn").click(function () {
                praisepost($(this).attr("pid"), $(this));
            });
        }
    });
}

function posting(btnsubmit, msg) {
    var $btnsubmit = $(btnsubmit);
    $btnsubmit.css('background-color', '#666').data('isenable', 0);
    var count = 0;
    var interval = setInterval(function () {
        if (count % 6 === 0) {
            $btnsubmit.text(msg + '中');
        } else {
            $btnsubmit.text($btnsubmit.text() + '.');
        }
        count++;
        if ($btnsubmit.data('isenable') === 1) {
            $btnsubmit.text(msg).css('background-color', '#fd113a');
            clearInterval(interval);
        }
    }, 200);
}

function showCheckPostModal() {
    if ($(".checkpost-mask").length <= 0) {
        var html = '';
        html += '<div class="checkpost-mask" id="checkpost-mask"></div>';
        html += '<div class="checkpost-win">';
        html += '<p class="checkpost-win-title">您尚未验证手机号</p>';
        html += '<p class="checkpost-win-tip">依照《移动互联网应用程序信息服务管理规定》，通过实名认证后才能进行发帖、评论等操作。请先绑定手机号完成实名认证。</p>';
        html += '<a href="javascript:void(0);" class="checkpost-win-btn" >下次再说</a>';
        html += '<a href="/bindphone/" class="checkpost-win-btn">去验证</a>';
        html += '</div>';
        $("body").append(html);
        $(".checkpost-win-btn").click(function () {
            $('.checkpost-mask').hide();
            $('.checkpost-win').hide();
        });
        $('.checkpost-mask').show();
        $('.checkpost-win').show();
    }
    else {
        $(".checkpost-mask").show();
        $(".checkpost-win").show();
    }
}
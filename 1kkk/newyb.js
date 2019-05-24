var DM5_YB_ARRAY = [];
var DM5_YB_BODY = "";
var DM5_YB_COMPLETE = true;
var DM5_YB_CURRENT_CONTENT = "";
var index_new = 0;
function getjscallback(url, cback, obj) {
    $('#' + obj).append('<script src="'+url+'"></script>');
    // createjsasy(url, obj, cback);
}
function createjsasy(url, obj, cback) {
    var index = DM5_YB_ARRAY.length + 1;
    var jsFile = { url: url, idobj: obj, cback: cback, isfrist: true }
    DM5_YB_ARRAY.push(jsFile);
}
function rewritedcwrite() {
    document.write = function (s) { DM5_YB_BODY += s; }
    document.writeln = function (s) { DM5_YB_BODY += s; }
}
function execute() {
    DM5_YB_CURRENT_CONTENT = "";
    DM5_YB_BODY = "";
    DM5_YB_COMPLETE = false;
    if (DM5_YB_ARRAY.length == 0) {
        DM5_YB_COMPLETE = true;
        return;
    }
    var requestobj = DM5_YB_ARRAY.pop();
    if (requestobj.cback) {
        requestobj.cback();
    }
    var url = requestobj.url;
    var obj = requestobj.idobj;
    var tcclass = requestobj.tc_class;
    var isfrist = requestobj.isfrist;
    if (url && url != '') {
        var ga = document.createElement('script'); 
        ga.type = 'text/javascript'; 
        ga.async = true;
        ga.src = url;
        ga.onload = function(){
            var re = /<script.*?>([\s\S]*?)<\/script>/ig;
            var arrMactches = DM5_YB_BODY.match(re);
            DM5_YB_CURRENT_CONTENT = DM5_YB_BODY;
            if (arrMactches != null && arrMactches.length != 0) {
                for (var idx = 0; idx < arrMactches.length; idx++) {
                    var s = $(arrMactches[idx]).attr("src");
                    if (s && s != '' && s.trim() != '') {
                        var tc_class = obj + "tc_" + index_new;
                        index_new++;
                        var jsFile = { url: s, idobj: obj, cback: null, isfrist: false, tc_class: tc_class }
                        DM5_YB_ARRAY.push(jsFile);
                        DM5_YB_CURRENT_CONTENT = DM5_YB_CURRENT_CONTENT.replace(arrMactches[idx], "<div style='display:none' class=\"" + tc_class + "\"></div>");
                    }
                    else {
                        DM5_YB_BODY = "";
                        var t = $(arrMactches[idx]).text();
                        if (t && t != '' && t.trim() != '') {
                            eval(t);
                        }
                        if (DM5_YB_BODY != "") {
                            DM5_YB_CURRENT_CONTENT = DM5_YB_CURRENT_CONTENT.replace(arrMactches[idx], DM5_YB_BODY);
                        }
                    }

                }
            }
            var ob;
            if (obj && $("#" + obj).length > 0) {
                ob = $("#" + obj);
            }
            else {
                ob = $("body");
            }
            if (isfrist) {
                ob.append(DM5_YB_CURRENT_CONTENT);
            }
            else {
                if (tcclass && $("." + tcclass, ob).length > 0) {
                    if (DM5_YB_CURRENT_CONTENT != '') {
                        $("." + tcclass, ob).after(DM5_YB_CURRENT_CONTENT);
                    }
                    $("." + tcclass, ob).remove();
                }

            }
            if (DM5_YB_ARRAY.length > 0) { execute(); } else { DM5_YB_COMPLETE = true; }
        }
        var s = $("#"+obj)[0];
        s.appendChild(ga);
    }
}
$(function () {
    DM5_YB_ARRAY.reverse();
    rewritedcwrite();
    execute();
}
);

function refresh_yb(){
    var yc = $("iframe.fastrefresh");
    if (yc.length > 0) {
        yc.each(function () { $(this).attr("src", $(this).attr("src")); });
    }
    if($('.asyRefresh').length > 0){
        var yb_arr = $('.asyRefresh');
        for(var i=0;i<yb_arr.length;i++){
            var yb_i = yb_arr.eq(i);
            var s1 = yb_i.find("script:first").html();
            yb_i.children().not(".ad_logo").not(".ad_cross").remove();
            yb_i.prepend("<script>"+s1+"</script>");
        }
        $('#HMDownBox').remove();
        $('#HMUpBox').remove();
        adsbygoogle = null;
        window["ZVYGapmifNNIAkDSujD"] = undefined;
        window["pg222811052"] = undefined;
        window['wpRepeatCode'] = [];
        $('body').css('padding-top',0);
        execute();
    }
    if($('#mb-cc6.asyRefresh').length>0||$('#mb-cc6.fastrefresh').length>0||$('#mb-cc6 .fastrefresh').length>0){
        var oldsrc = $('#cnzz_cc6').attr('src');
        $('#cnzz_cc6').remove();
        var ga = document.createElement('script'); 
        ga.type = 'text/javascript'; 
        ga.async = true; 
        ga.id = 'cnzz_cc6';
        ga.src = oldsrc;
        var s = document.getElementsByTagName('script')[0]; 
        s.parentNode.insertBefore(ga, s);
    }
}

function add_asyRefresh(id){
    $('#'+id).addClass('asyRefresh');
}
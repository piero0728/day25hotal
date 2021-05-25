layui.use(['jquery','layer','form'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , form = layui.form  //引用form表单模块

    var verifyCheckIf = false;  //验证码验证的判断

    //效验用户名和密码
    form.verify({
        userName: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '用户名不能全为数字';
            }
            if(value.length<3||value.length>12){
                return '用户名长度为3-12位';
            }
        }
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格']
        ,verifyCheck: function (value,item) {//验证码验证
            checkVerifyCode(value);
            if (!verifyCheckIf){
                return "验证码输入错误!";
            }
        }
    });

    //登陆按钮监听
    form.on('submit(login)', function(data){
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        checkLogin(data.field);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    if($("#loginUIMsg").val()=='loginUIMsg'){
        layer.msg("请先登陆！",{icon: 7,time:2000,anim: 3,shade:0.5});
    }

    /************************自定义函数**********************************/
    //验证码效验
    function checkVerifyCode(yzm) {
        //在$.post()前把ajax设置为同步请求：
        $.ajaxSettings.async = false;
        $.post(
            "user/checkVerifyCode", //请求的url路径
            {"yzm":yzm},
            function (data){
                if(data === 'success'){
                    verifyCheckIf = true;
                    layer.tips('验证码验证正确。','#yzm', {tips: [2,'green'],time:2000,tipsMore: true});
                }else{
                    verifyCheckIf = false;
                    layer.tips('验证码验证错误！','#yzm', {tips: [2,'red'],time:2000,tipsMore: true});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    function checkLogin(jsonLogin){
        $.post(
            "user/checkLogin", //请求的url路径
            jsonLogin,
            function (data){
                if(data === 'success'){
                    layer.msg("登陆成功！！",{icon: 1,time:2000,anim: 4,shade:0.5});
                    //2秒之后应该去首页
                    setTimeout("window.location.href='model/toHome'",2000);
                }else{
                    layer.msg("登陆失败！！",{icon: 2,time:2000,anim: 3,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }


});
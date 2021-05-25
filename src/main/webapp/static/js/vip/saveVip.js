//static/js/vip/saveVip.js
layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    var checkIdcardIf = false;//验证身份证号
    var checkPhoneIf = false;//验证手机号

    //自定义验证
    form.verify({
        checkIdcard: function(value, item){ //value：表单的值、item：表单的DOM对象
            checkIdcard(value);
            if (!checkIdcardIf){
                return "该身份证号已被使用！";
            }
        }
        ,checkPhone: function(value, item){ //value：表单的值、item：表单的DOM对象
            checkPhone(value);
            if (!checkPhoneIf){
                return "手机号已被使用！";
            }
        }
    });

    //下拉框的监听
    form.on('select(vipRate)', function(data){
        console.log(data.value); //得到被选中的值
        /*得到日期的字符串格式*/
        var nowDateStr = getNowDate(new Date());
        //给隐藏域的日期赋值
        $("#createDate").val(nowDateStr);
        //判断会员折扣
        if(data.value == '0.8'){
            //生成卡号   日期数字 + 后缀 01:超级会员 /  02: 普通会员
            $("#vipNum").val(dateReplace(nowDateStr) + "01");
        }else{
            $("#vipNum").val(dateReplace(nowDateStr) + "02");
        }
    });

    //监听添加会员按钮，提交表单
    form.on('submit(demo2)', function(data){
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        //向服务器发送添加请求
        saveVip(data.field);
        layer.closeAll();
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });


    /************************自定义函数******************************/
    //验证身份证号
    function checkIdcard(idcard) {
        $.ajaxSettings.async = false;
        $.post(
            "vip/getCountByParams", //调用的是base系列的方法，只需要改mapper.xml文件
            {"idcard":idcard},
            function (data){
                console.log(data);
                if(data == 0){
                    checkIdcardIf = true;
                    layer.tips('此身份证号可以使用','#idcard', {tips: [2,'green'],time:2000,tipsMore: true});
                }else{
                    checkIdcardIf = false;
                    layer.tips('此身份证号已被使用','#idcard', {tips: [2,'red'],time:2000,tipsMore: true});
                }
            },"json"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }
    //验证手机号
    function checkPhone(phone) {
        $.ajaxSettings.async = false;
        $.post(
            "vip/getCountByParams", //调用的是base系列的方法，只需要改mapper.xml文件
            {"phone":phone},
            function (data){
                console.log(data);
                if(data == 0){
                    checkPhoneIf = true;
                    layer.tips('此手机号可以使用','#phone', {tips: [2,'green'],time:2000,tipsMore: true});
                }else{
                    checkPhoneIf = false;
                    layer.tips('此手机号已被使用','#phone', {tips: [2,'red'],time:2000,tipsMore: true});

                }
            },"json"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }

    function saveVip(saveJsonVip) {
        $.post(
            "vip/saveT", //调用的是base系列的方法，只需要改mapper.xml文件
            saveJsonVip,
            function (data){
                if(data === 'success'){
                    layer.msg("会员数据添加成功！",{icon: 1,time:2000,anim: 4,shade:0.5});
                    setTimeout("window.location.href='model/toShowVip'",2000)
                }else{
                    layer.msg("会员数据添加失败！",{icon: 2,time:2000,anim: 4,shade:0.5});
                }
            },"text"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }

});
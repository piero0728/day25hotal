//在webapp/static/js/inRoomInfo下新建saveInRoomInfo.js
layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    //加载可用的客房信息(0为未入住的房间,1为已入住的房间,2为打扫中)
    loadRoomsByRoomStatus("0");

    //执行一个laydate实例
    laydate.render({
        elem: '#createDate' //指定元素的id
        ,type:'datetime'  //日期格式
        ,format:'yyyy/MM/dd HH:mm:ss'  //日期字符串格式
        ,value:new Date()  //初始值为系统当前时间
        ,min:0  //表示只能选则当前数据之后的时间
    });


    //监听会员非会员的选择
    form.on('radio(isVip)', function(data){//填写lay-filter的值
        $("form").eq(0).find('input:text').val("");//设置清空表单的文本框的值
        console.log(data.value); //被点击的radio的value值
        if (data.value=='1'){
            isVipTrue();
        }else {
            isVipFalse();
        }
    });

    //自定义验证
    form.verify({  //做表单提交时的验证
        money:function (value) { //value：表单的值、item：表单的DOM对象
            if(value<100 || value>2000){
                return '押金范围在100-2000元之内';
            }
        }
    });

    form.on('submit(demo1)', function(data){
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        var saveJsonInRoomInfo = data.field;
        saveJsonInRoomInfo['outRoomStatus'] = '0';
        saveJsonInRoomInfo['status'] = '1';
        //执行添加，1.入住信息添加  2.客房状态由0（空闲）---->1（已入住）
        saveInRoomInfo(saveJsonInRoomInfo);
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    /**********************自定义绑定事件***************************/
    //给会员卡号输入框失去焦点事件
    $("#vip_num").blur(function () {
        //失去焦点时会有卡号验证
        var vipNum = $(this).val();
        //验证会员卡号的格式
        if((/(^[1-9]\d*$)/.test(vipNum))){
            if(vipNum.length==16){  //验证长度
                //发送ajax请求，查询会员卡号
                loadVipByVipNum(vipNum);  //根据会员卡号加载单个会员数据
            }else {
                //吸附框  会员卡号长度必须位16位：提示内容  ，#vip_num吸附的标签
                //{tips: [2,'green'],time:2000}  弹出位置（上右下左1-4）   背景颜色  显示时间
                layer.tips('会员卡号长度必须位16位','#vip_num', {tips: [2,'red'],time:2000});
            }
        }else {
            layer.tips('会员卡号必须为正整数','#vip_num', {tips: [2,'red'],time:2000});
        }
    });



    /**********************自定义函数***************************/
    //选择会员的表单操作
    function isVipTrue(){
        $("#vip_num").removeAttr("disabled")  //将会员卡号输入框可用
        $("#vip_num").attr("lay-verify","required|number|vip_num"); //添加验证的属性值
        //将客人姓名，手机号，身份证号，性别均不可用
        $("#customerName").attr("disabled","disabled");
        $("input[name=gender]").attr("disabled","disabled");
        $("#idcard").attr("disabled","disabled");
        $("#phone").attr("disabled","disabled");
    }

    //选择非会员的表单操作
    function isVipFalse() {
        $("#vip_num").attr("disabled","disabled"); //将会员卡号输入框不可用
        $("#vip_num").removeAttr("lay-verify")  //移除验证的属性值
        //将客人姓名，手机号，身份证号，性别均可用
        $("#customerName").removeAttr("disabled");
        $("input[name=gender]").removeAttr("disabled");
        $("#idcard").removeAttr("disabled");
        $("#phone").removeAttr("disabled");
    }

    //根据会员卡号查询信息
    function loadVipByVipNum(vipNum) {
        $.post(
            "vip/loadTByParams", //请求的url路径
            {"vipNum":vipNum}, //数据
            function (data){
                console.log("data：",data);
                //如果传回来的json是空的，就代表会员卡号输入有问题查不到
                if (!$.isEmptyObject(data)){
                    //给表单赋值
                    form.val("example", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                        "customerName": data.customerName // "name": "value"
                        ,"gender": data.gender
                        ,"idcard": data.idcard
                        ,"phone": data.phone
                    });
                    layer.tips('已查出此会员数据','#vip_num', {tips: [2,'green'],time:2000});
                }else {
                    layer.tips('没有此会员数据','#vip_num', {tips: [2,'red'],time:2000});
                }
            },"json" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    //加载所有未入住的客房信息
    function loadRoomsByRoomStatus(roomStatus) {
        $.post(
            "rooms/loadManyByParams", //请求的url路径
            {"roomStatus":roomStatus}, //数据
            function (data){
                console.log("data:",data);
                var roomStr = `<option value="">---请选择房间---</option>`;
                $.each(data,function (i,room){
                    roomStr += `<option value="${room.id}">${room.roomNum} - ${room.roomType.roomTypeName} - ${room.roomType.roomPrice }¥</option>`;
                })
                $("#selRoomNumId").html(roomStr);
                form.render("select"); //渲染

            },"json" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("服务器异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    //添加入住信息
    function saveInRoomInfo(saveJsonInRoomInfo) {
        $.post(
            "inRoomInfo/saveT", //请求的url路径
            saveJsonInRoomInfo, //数据
            function (data){
                if(data === 'success'){
                    layer.msg("信息添加成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                    //设置定时器于2秒后跳转到入住信息页面
                    setTimeout("window.location.href='model/toShowInRoomInfo'",2000);
                }else{
                    layer.msg("信息添加失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

});
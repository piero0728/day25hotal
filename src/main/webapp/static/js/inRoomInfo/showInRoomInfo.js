layui.use(['table'],function(){
    var table = layui.table
        ,$ = layui.jquery
        ,form = layui.form
        ,layer = layui.layer
        ,laydate = layui.laydate;

    //传入符合format格式的字符给初始值
    laydate.render({
        elem: '#endDate'
        ,format: 'yyyy/MM/dd HH:mm:ss'
        ,value: new Date() //必须遵循format参数设定的格式
    });

    var currentPage; //创建全局变量，指定当前页是第1页

    var selJSONInRoomInfo = {}; //全局变量。封装json格式的查询条件 表示空的json对象

    //七牛云的图片文件前缀地址
    var qnyName = "http://qt4k1ztnj.hn-bkt.clouddn.com";


    //初始化加载入住信息数据
    loadInRoomInfo();



    /**********************自定义的layui函数*************************/
    //封装了查询入住信息的函数
    function loadInRoomInfo(){
        //第一个实例
        table.render({
            elem: '#demo'  //表示跟表格容器的id进行绑定
            ,height: 500 //表格容器的高度
            //  默认会自动传递两个参数：?page=1&limit=30  page 代表当前页码、limit 代表每页数据量
            ,url: 'inRoomInfo/loadDataByParams' //数据接口, 用来访问到后端控制器中，获取数据返回 （JSON数据）
            ,page: true //开启分页
            ,width: 1600 //设定容器宽度。
            ,limits: [3,5,8,10,15,20] //自定义分页条数
            ,limit: 3  //默认每页显示3条记录
            //,where: selJSONInRoomInfo   //where : 表示查询条件,layui会把该查询条件传递到后端控制器
            ,even: true  //隔行变色效果
            ,cols: [[ //表头
                /*开启复选框*/
                {type:'checkbox', fixed: 'left'}
                ,{field: 'id', title: 'ID', align: 'center', width:80, sort: true}
                ,{field: 'roomNum', title: '房间编号', width:80, templet: '<div>{{d.rooms.roomNum}}</div>'}
                ,{field: 'roomPic', title: '封面图', width:130, sort: true, templet: '<div><img src="'+qnyName+'/{{d.rooms.roomPic}}" alt=""></div>'}
                ,{field: 'roomTypeName', title: '房间类型', width:130,templet: '<div>{{d.rooms.roomType.roomTypeName}}</div>'}
                ,{field: 'roomPrice', title: '价格', width: 100,sort: true,templet: '<div>{{d.rooms.roomType.roomPrice}}</div>'}
                ,{field: 'customerName', title: '客人姓名', width: 100}
                ,{field: 'gender', title: '性别', width: 80,templet: '#genderTpl'}
                ,{field: 'isVip', title: 'vip', width: 80, templet: '#isVipTpl'}
                ,{field: 'idcard', title: '身份证号', width: 160}
                ,{field: 'phone', title: '手机号', width: 100}
                ,{field: 'money', title: '押金', width: 80}
                ,{field: 'createDate', title: '入住时间', width: 160}
                ,{field: 'outRoomStatus', title: '状态', width: 100, templet: '#outRoomStatusTpl'}
                /* toolbar: '#barDemo' : 关联到工具条的id */
                ,{field: 'right', title: '操作', width: 160, toolbar: '#barDemo'}
            ]]
            /*渲染完毕之后的回调函数*/
            ,done: function(res, curr, count){
                //得到当前页码
                console.log(curr);
                //给currentPage赋值
                currentPage = curr;
                //渲染完成之后，加载放大镜函数
                hoverOpenImg();
            }
        });
    }


    //监听工具条事件
    table.on('tool(test)', function (obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

        console.log("data:",data);

        if (layEvent === 'del') { //删除
            layer.confirm('真的删除此入住信息吗？', function (index) {
                //向服务端发送删除（实际是更新操作）指令
                updRoomStatus(data.id,obj);
                layer.close(index);  //关闭当前的询问框
            });
        } else if (layEvent === 'exitRoom') { //退房

            //在弹窗之前需要对数据进行清除
            $("#vipNum").val("");  //清空会员卡号
            $("#vipRate").val(1);  //使折扣为1
            $("#otherPrice").val(0);  //将其它消费清0
            $("#remark").val("")  //清空退房备注

            var isVipStr;
            if (data.isVip == '1' ){
                //根据身份证号查询会员卡号,得到会员卡号
                loadVipByIdCard(data.idcard);
                isVipStr = "是"


            }else {
                isVipStr = "否"
            }

            //打开弹窗之前对基本的信息进行数据回显
            form.val("exitInRoomInfoForm",{
                "inRoomInfo_id":data.id //住房信息的主键id
                ,"roomNum":data.rooms.roomNum //房间编号
                ,"customerName":data.customerName //顾客姓名
                ,"idcard":data.idcard //身份证号
                ,"roomPrice":data.rooms.roomType.roomPrice //房间单价
                ,"createDate":data.createDate //入住时间
                ,"isVip":isVipStr //是否会员
            });
            //打开弹窗
            layer.open({
                type:1,  //弹出类型
                title:"退房操作界面",  //弹框标题
                area:['750px','600px'],  //弹框款高度
                anim: 4,  //弹出的动画效果
                shade:0.5,  //阴影遮罩
                content:$("#exitInRoomInfoDiv")  //弹出的内容
            });
            //弹窗显示以后需计算居住了多少天
            var days;
            //调取计算日期的工具函数计算入住天数
            days =getDays(getDateStr(data.createDate),getDateStr($("#endDate").val()))
            if(days == 0){
                days = 1;
            }
            // 将days入住天数回显
            $("#days").text(days)
            // 计算总金额  房间金额+额外消费
            var zprice = days * data.rooms.roomType.roomPrice * parseFloat($("#vipRate").val());
            $("#zprice").text(zprice);//讲房间金额回显到页面上
            //将其他消费的金额也加进总金额中
            $("#otherPrice").on('keyup click',function () {
                if ($(this).val()!=''){
                    $("#zprice").text(zprice + parseFloat($(this).val()));
                }else {
                    $("#zprice").text(zprice);
                }
            })
            // 点击退房按钮进行表单提交操作
            form.on('submit(demo3)',function (data) {
                console.log(data.field)//当前表单的全部字段信息,形式{name:value}
                // 创建表单需要的数据
                var saveOrdersJson = {};  //定义订单添加的数据
                var nowDateStr= getNowDate(new Date()); //获得当前时间并转换成一串数字 用于后续操作
                //订单编号
                saveOrdersJson['orderNum'] = dateReplace(nowDateStr) + getRandom(6);
                //消费总金额
                saveOrdersJson['orderMoney'] = $("#zprice").text();
                //备注
                saveOrdersJson['remark'] = data.field.remark;
                //支付状态 0 未支付
                saveOrdersJson['orderStatus'] = '0';
                //入住信息id
                saveOrdersJson['iriId'] = data.field.inRoomInfo_id;
                //创建订单时间
                saveOrdersJson['createDate'] = nowDateStr;
                //订单显示，1显示
                saveOrdersJson['flag'] = '1';
                //构建orderOther：退房时的客人信息时间等等
                saveOrdersJson['orderOther'] = data.field.roomNum+","+data.field.customerName+","
                    +data.field.createDate+","+data.field.endDate+","+$("#days").text();
                //构建orderPrice：退房时的各种金额
                saveOrdersJson['orderPrice'] = data.field.roomPrice+","+$("#otherPrice").val()+","+$("#zprice").text();
                //调用函数,实现退房操作,将订单需要的参数都传过去
                saveOrders(saveOrdersJson);
                layer.closeAll();//关闭窗口
                return false;
            });

        } else if(layEvent === 'query'){
            layer.msg("查看操作");
        }
    });



    /**********************标签事件绑定************************/



    /**********************自定义函数***************************/
    //图片放大镜函数
    function hoverOpenImg(){
        var img_show = null; // tips提示
        $('td img').hover(function(){
            var img = "<img class='img_msg' src='"+$(this).attr('src')+"' style='width:230px;' />";
            img_show = layer.tips(img, this,{
                tips:[2, 'rgba(41,41,41,.5)']
                ,area: ['260px']
            });
        },function(){
            layer.close(img_show);
        });
        $('td img').attr('style','max-width:70px');
    }

    //根据入住信息的id,更新状态
    function updRoomStatus(id,obj){
        $.post(
            "inRoomInfo/updT", //请求的url路径
            {"id":id, "status":"0"}, //数据
            function (data){
                if(data === 'success'){
                    layer.msg("删除成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                    obj.del(); //删除当前行
                }else{
                    layer.msg("删除失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    //根据身份证号查询会员卡号
    function loadVipByIdCard(idcard){
        //在$.post()前把ajax设置为同步请求：
        $.ajaxSettings.async = false;

        $.post(
            "vip/loadTByParams", //请求的url路径
            {"idcard":idcard}, //数据
            function (data){
                console.log(data)
                $("#vipRate").val(data.vipRate);
                $("#vipNum").val(data.vipNum);
            },"json"
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 6,time:2000,anim: 6,shade:0.5});
        })
    }

    //实现退房操作
    function saveOrders(saveOrdersJson){
        $.post(
            "orders/saveT", //请求的url路径
            saveOrdersJson, //数据
            function (data){
                if(data === 'success'){
                    layer.msg("退房成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                    //重新加载数据，加载当前页的数据
                    table.reload('demo', {  //"demo"为容器id的值
                        page: {
                            curr: currentPage //重新从 当前 页开始
                        }
                    }); //只重载数据，异步加载表格数据
                }else{
                    layer.msg("退房失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    /**********************自定义工具函数***************************/
    //将目前的时间格式2019/08/06 12:12:08  -->  2019/08/06
    function getDateStr(dateStr) {
        var indexOf = dateStr.indexOf(" ");  //取到" "的下标
        dateStr = dateStr.substring(0,indexOf);  //第1个参数为下标，第2个参数为切割的字符串长度
        return dateStr;
    }
    //计算天数
    function getDays(startDate,endDate){  //2019/09/09   2019/10/10
        var date1Str = startDate.split("/");
        var date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
        var date2Str = endDate.split("/");
        var date2Obj = new Date(date2Str[0],(date2Str[1]-1),date2Str[2]);
        var t1 = date1Obj.getTime();
        var t2 = date2Obj.getTime();
        var datetime=1000*60*60*24;
        var minusDays = Math.floor(((t2-t1)/datetime));
        var days = Math.abs(minusDays);
        return minusDays;
    }

    //获取当前时间字符串     Date()   ---->  yyyy/MM/dd HH:mm:ss 格式的字符串
    function getNowDate(date) {
        var sign1 = "/";
        var sign2 = ":";
        var year = date.getFullYear() // 年
        var month = date.getMonth() + 1; // 月
        var day  = date.getDate(); // 日
        var hour = date.getHours(); // 时
        var minutes = date.getMinutes(); // 分
        var seconds = date.getSeconds() //秒
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds ;
        return currentdate;
    }
    //把 2019/01/01 12:12:12  -->  20190101121212
    function dateReplace(date) {
        date = date.replace("/","");
        date = date.replace("/","");
        date = date.replace(" ","");
        date = date.replace(":","");
        date = date.replace(":","");
        return date;
    }
    //获取随机数
    function getRandom(num) {
        var count = '';   //随机数
        for (var i=0;i<num;i++){
            count += parseInt(Math.random()*10)  //0.123123123...
        }
        return count;
    }
})

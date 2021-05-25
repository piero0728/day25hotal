layui.use(['jquery','layer', 'element','form','laypage'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , element = layui.element  //引用element面板模块
        , form = layui.form  //引用form表单模块
        , laypage = layui.laypage;  //引用分页组件

    var page=1;
    var limit=3;
    var count;

    //验证房型是否可删的判断
    var checkRoomsOfRoomTypeIf = false;

    //验证房型名称是否唯一的判断
    var checkRoomTypeNameIf = false;

    //七牛云的图片文件前缀地址
    var qnyName = "http://qt4k1ztnj.hn-bkt.clouddn.com";

    //初始化加载客房类型数据
    loadPageRoomType();

    loadPage();

    //分页完整功能
    function loadPage(){
        laypage.render({
            elem: 'test1'//绑定分页的容器id
            ,count: count//总条数
            ,limit:limit//每页显示的条数
            ,limits:[3,5,8,10,20]//每页条数的选择项
            ,curr:page//表示当前页
            ,layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
            ,jump: function(obj,first){//obj包含了当前分页的所有信息
                console.log("obj",obj);
                console.log(obj.curr);
                console.log(obj.limit);
                page=obj.curr;
                limit=obj.limit;
                //首次不执行
                if (!first){
                    loadPageRoomType();
                }
            }
        });
    }

    //添加功能的表单验证
    form.verify({
        //效验名称
        roomTypeName: function(value, item) { //value：表单的值、item：表单的DOM对象
            checkRoomTypeName(value);
            if (!checkRoomTypeNameIf){
                return "客房类型重复!";
            }
        },
        //效验价格
        roomPrice: function (value, item) {
            if (value < 120 || value > 8888){
                return "房间价格在120 ~ 8888之间";
            }

        }
    });

    //监听添加按钮的表单提交操作
    form.on('submit(demo3)', function(data){
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        saveRoomType(data.field);
        layer.closeAll();
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //监听折叠
    element.on('collapse(test)', function(data){
        if (data.show){
            var roomTypeId = $(this).attr("roomTypeId");
            console.log("roomTypeId:",roomTypeId);
            //根据房间类型查询对应的房间信息
            loadRoomsByRoomTypeId(roomTypeId);
        }
    });


    /****************************自定义绑定函数**********************************/
    $("#collapseDiv").on('click','button',function () {
        //拿到按钮的event值确定是删除还是修改
        var event = $(this).attr("event");
        if (event == 'del'){//删除操作
            var roomTypeId = $(this).val();
            //1.验证改客房类型是否有入住信息
            checkRoomsOfRoomType(roomTypeId);
            //2.删除
            if (checkRoomsOfRoomTypeIf){
                layer.confirm('确定删除？', function(index) {
                    delRoomTypeById(roomTypeId);
                    layer.close(index);
                    //向服务端发送删除指令
                })
            }else {
                layer.msg("该客房类型有入住信息，无法删除",{icon: 3,time:2000,anim: 6,shade:0.5});
                }
        }else {//修改操作
            //1.数据回显
            var roomTypeArr = $(this).val().split(",");
            //给表单赋值
            form.val("updRoomTypeFromFilter", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                "id": roomTypeArr[0] // "name": "value"
                ,"roomTypeName": roomTypeArr[1]
                ,"roomPrice": roomTypeArr[2]
            });
            //2.弹框
            layer.open({
                type:1,  //弹出类型
                title:"房型修改操作界面",  //弹框标题
                area:['380px','280px'],  //弹框款高度
                anim: 4,  //弹出的动画效果
                shade:0.5,  //阴影遮罩
                content:$("#updRoomTypeDiv")  //弹出的内容
            });
            //3.监听修改表单的提交按钮操作
            form.on('submit(demo4)', function (data) {
                var updJsonRoomType = data.field;
                updRoomType(updJsonRoomType);  //执行修改
                layer.closeAll();  //关闭所有弹框
                return false;  //阻止表单跳转提交
            });
        }
    })

    //添加房型数据
    $("#saveRoomTypeBtn").click(function () {
        //1.清空添加表单上一次的数据
        $("#saveRoomTypeDiv form").find("input").val("");
        //2.弹框
        layer.open({
            type:1,  //弹出类型
            title:"房型添加操作界面",  //弹框标题
            area:['380px','280px'],  //弹框款高度
            anim: 3,  //弹出的动画效果
            shade:0.5,  //阴影遮罩
            content:$("#saveRoomTypeDiv")  //弹出的内容
        });
    });


    /***************************自定义函数**********************************/
    //加载所有房间类型
    function loadPageRoomType() {
        //在$.post()前把ajax设置为同步请求：
        $.ajaxSettings.async = false;
        $.post(
            "roomType/loadDataByParams", //调用的是base系列的方法，只需要改mapper.xml文件
            {"page":page,"limit":limit},
            function (data){
                console.log("data",data);
                count = data.count;
                var roomTypeStr = ``;
                $.each(data.data,function (i,roomType) {
                    roomTypeStr += `
                        <div class="layui-colla-item" id="item${roomType.id}" style="margin-top: 10px;">
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-danger" event="del" value="${roomType.id}" style="float: right;">删除</button>
                            <button type="button" class="layui-btn layui-btn-sm layui-btn-warm" event="upd" value="${roomType.id},${roomType.roomTypeName},${roomType.roomPrice}" style="float: right;">修改</button>
                            <h2 class="layui-colla-title" roomTypeId="${roomType.id}">${roomType.roomTypeName} -- ${roomType.roomPrice}元/天</h2>
                            <div class="layui-colla-content">
                                <p id="p${roomType.id}"></p>
                            </div>
                        </div>
                    `;
                })
                //把拼接好的房型面板数据放到面板容器中
                $("#collapseDiv").html(roomTypeStr);
                //渲染面板
                element.render("collapse");
            },"json"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }
    //验证房型是否可删除
    function checkRoomsOfRoomType(roomTypeId) {
        //在$.post()前把ajax设置为同步请求：
        $.ajaxSettings.async = false;
        $.post(
            "rooms/getCountByParams", //调用的是base系列的方法，只需要改mapper.xml文件
            {"roomTypeId":roomTypeId},
            function (data){
                console.log("data",data);
                if (data == 0){
                    checkRoomsOfRoomTypeIf = true;

                }else {
                    checkRoomsOfRoomTypeIf =false;
                }
            },"json"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }
    //删除房型信息
    function  delRoomTypeById(roomTypeId) {
        $.post(
            "roomType/delTById", //请求的url路径
            {"id":roomTypeId},
            function (data){
                if(data === 'success'){
                    loadPageRoomType();
                    loadPage();
                    layer.msg("删除成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                }else{
                    layer.msg("删除失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }
    //修改房型信息
    function updRoomType(updJsonRoomType) {
        $.post(
            "roomType/updT", //调用的是base系列的方法，只需要改mapper.xml文件
            updJsonRoomType,
            function (data){
                if(data === 'success'){
                    loadPageRoomType(); //重新加载当前页
                    layer.msg("房型数据修改成功！",{icon: 1,time:2000,anim: 4,shade:0.5});
                }else{
                    layer.msg("房型数据修改失败！",{icon: 2,time:2000,anim: 4,shade:0.5});
                }
            },"text"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }
    //验证房型名称是否唯一
    function checkRoomTypeName(roomTypeName) {
        //在$.post()前把ajax设置为同步请求：
        $.ajaxSettings.async = false;
        $.post(
            "roomType/getCountByParams", //请求的url路径
            {"roomTypeName":roomTypeName},
            function (data){
                console.log(data);
                if (data == 0){
                    checkRoomTypeNameIf = true;
                    layer.tips('没有重复的房型名称，验证通过','#roomTypeName', {tips: [2,'green'],time:2000});
                }else {
                    checkRoomTypeNameIf = false;
                    layer.tips('有重复的房型名称，验证不通过','#roomTypeName', {tips: [2,'red'],time:2000});
                }
            },"json" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }
    //添加客房类型
    function saveRoomType(saveJsonRoomType) {
        $.post(
            "roomType/saveT", //请求的url路径
            saveJsonRoomType,
            function (data){
                if(data === 'success'){
                    page =1;//页码重置为1
                    loadPageRoomType();//加载全部类型
                    loadPage();//加载分页
                    layer.msg("添加成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                }else{
                    layer.msg("添加失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }
    //根据房间类型查询对应的房间信息
    function loadRoomsByRoomTypeId(roomTypeId){
        $.post(
            "rooms/loadManyByParams", //请求的url路径
            {"roomTypeId":roomTypeId},
            function (data){
                console.log(data);
                if (!$.isEmptyObject(data)){
                    var rooms = `<ul class="site-doc-icon site-doc-anim">`;
                    $.each(data,function (i,room){
                        if(room.roomStatus == '0'){
                            rooms += `<li style="background-color: #009688;">`;
                        }else if(room.roomStatus == '1'){
                            rooms += `<li style="background-color: red;">`;
                        }else {
                            rooms += `<li style="background-color: blueviolet;">`;
                        }
                        rooms += `
                            <img class="layui-anim" id="demo1" src="${qnyName}/${room.roomPic}" width="135px" height="135px"/>
                            <div class="code">
                            <span style="display: block;color: #0C0C0C;">${room.roomNum} - ${room.roomType.roomTypeName} - ${room.roomType.roomPrice}元/天</span>
                            </div>
                            </li>`;
                    })
                    rooms += `</ul>`;
                    $("#p"+roomTypeId).html(rooms);
                }else {
                    layer.msg("该客房类型没有客房信息！",{icon: 7,time:2000,anim: 3,shade:0.5});
                }
            },"json" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }
})
//static/js/rooms/showRooms.js
layui.use(['jquery','layer', 'table','form','upload','element'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , upload = layui.upload  //文件上传组件
        , element = layui.element ; //引入常用元素操作的组件

    //初始化所有客房信息
    loadAllRooms();

    //初始化所有的客房类型数据
    loadAllRoomType();

    //找到div对应的ul
    var arrUl = $("#LAY_preview").find("ul");

    //七牛云的图片文件前缀地址
    var qnyName = "http://qt4k1ztnj.hn-bkt.clouddn.com";

    var checkRoomNumIf = false;
    //房间号唯一性验证
    form.verify({
        roomNum: function(value, item){ //value：表单的值、item：表单的DOM对象
            checkRoomNum(value);
            if (!checkRoomNumIf){
                return '房间号已被使用';
            }
        }
    });

    //监听添加按钮表单提交操作
    form.on('submit(demo3)', function(data){
        console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
        var saveJsonRooms = data.field;  //重新将查询条件赋值
        saveJsonRooms['flag'] = '1';
        saveJsonRooms['roomStatus'] = '0';
        saveRooms(saveJsonRooms);  //执行添加
        layer.closeAll();  //关闭所有弹框
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
    });

    //常规使用 - 普通图片上传
    var uploadInst = upload.render({
        elem: '#test1'
        ,url: 'rooms/uploadRoomPic' //改成您自己的上传接口
        ,data:{"path":"D://img"}
        ,field:"myFile"
        ,auto:false //取消自动上传
        ,bindAction:'#test9'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                $('#demo1').attr('src', result); //图片链接（base64）
            });

            element.progress('demo', '0%'); //进度条复位
            layer.msg('上传中', {icon: 16, time: 0});
        }
        ,done: function(res){
            console.log(res);
            //如果上传失败
            if(res.code > 0){
                return layer.msg("上传失败",{icon:7,time:2000,anim:3,shade:0.5});
            }else {
                console.log("newFileName",res.newFileName);
                $("#roomPicId").val(res.newFileName);
                return layer.msg("上传成功",{icon:1,time:2000,anim:4,shade:0.5});
            }
            //上传成功的一些操作
            //……
            $('#demoText').html(''); //置空上传失败的状态
        }
        ,error: function(){
            //演示失败状态，并实现重传
            var demoText = $('#demoText');
            demoText.html('<span style="color: #ff5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
        //进度条
        ,progress: function(n, index, e){
            element.progress('demo', n + '%'); //可配合 layui 进度条元素使用
            if(n == 100){
                layer.msg('上传完毕', {icon: 1});
            }
        }
    });

    /***********************自定义函数*******************************/
    //加载所有的房间
    function loadAllRooms() {
        $.post(
            "rooms/loadAllT", //请求的url路径
            function (data){
                console.log(data);
                var roomStatus0 = ""; //空闲客房状态数据标签字符串
                var roomStatus1 = "";//已入住客房状态数据标签字符串
                var roomStatus2 = "";//打扫客房状态数据标签字符串
                $.each(data, function (i,room) {
                    if (room.roomStatus == '0'){
                        roomStatus0 +=`
                        <li style="background-color: #009688;">
                        <img class="layui-anim" src="${qnyName}/${room.roomPic}" width="135" height="135">
                        <div class="code">
                        <span style="display: block; color: #0C0C0C;">
                        ${room.roomNum} - ${room.roomType.roomTypeName} - ${room.roomType.roomPrice} 元/天
                        </span>
                        <button type="button" value="del" roomid="${room.id}" class="layui-btn layui-btn-danger layui-btn-xs">删除</button>
                        </div>
                        </li>`;
                    }else if (room.roomStatus == '1'){
                        roomStatus1 +=`
                        <li style="background-color: red;">
                        <img class="layui-anim" src="${qnyName}/${room.roomPic}" width="135" height="135">
                        <div class="code">
                        <span style="display: block; color: #0C0C0C;">
                        ${room.roomNum} - ${room.roomType.roomTypeName} - ${room.roomType.roomPrice} 元/天
                        </span>
                        </div>
                        </li>`;
                    }else {
                        roomStatus2 +=`
                        <li style="background-color: blueviolet;">
                        <img class="layui-anim" src="${qnyName}/${room.roomPic}" width="135" height="135">
                        <div class="code">
                        <span style="display: block; color: #0C0C0C;">
                        ${room.roomNum} - ${room.roomType.roomTypeName} - ${room.roomType.roomPrice} 元/天
                        </span>
                        <button type="button" value="del" roomid="${room.id}" class="layui-btn layui-btn-danger layui-btn-xs">删除</button>
                        <button type="button" value="upd" roomid="${room.id}" class="layui-btn layui-btn-normal layui-btn-xs">空闲</button>
                        </div>
                        </li>
                        `;
                    }
                })
                //分别将三种状态的客房标签数据填充到对应的ul列表中
                $(arrUl[0]).html(roomStatus0);
                $(arrUl[1]).html(roomStatus1);
                $(arrUl[2]).html(roomStatus2);
                hoverOpenImg(); //加载图片放大函数
            },"json"
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 6,time:2000,anim: 6,shade:0.5});
        })
    }

    //加载所有的房间类型
    function loadAllRoomType(){
        $.post(
            "roomType/loadAllT", //调用的是base系列的方法，只需要改mapper.xml文件
            function (data){
                console.log(data);
                var roomTypeStr = `<option value="">---请选择客房类型---</option>`;
                $.each(data,function (i, roomType){
                    roomTypeStr += `<option value="${roomType.id}">${roomType.roomTypeName} - ${roomType.roomPrice}¥</option>`;
                })
                $("#selRoomType").html(roomTypeStr);
                form.render("select"); //渲染下拉框
            },"json"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }

    //验证房间号是否唯一
    function checkRoomNum(roomNum) {
        //在$.post()前把ajax设置为同步请求：
        $.ajaxSettings.async = false;
        $.post(
            "rooms/getCountByParams", //调用的是base系列的方法，只需要改mapper.xml文件
            {"roomNum":roomNum},
            function (data){
                console.log(data);
                if (data == 0){
                    checkRoomNumIf = true;
                    layer.tips('此房间号可以使用','#roomNum', {tips: [2,'green'],time:2000,tipsMore: true});
                }else {
                    checkRoomNumIf =false;
                    layer.tips('此房间号不可使用','#roomNum', {tips: [2,'red'],time:2000,tipsMore: true});
                }

            },"json"
        ).error(function (){
            layer.msg("服务器异常！！！",{icon: 3,time:2000,anim: 6,shade:0.5});
        })
    }

    //保存客房信息
    function saveRooms(saveJsonRooms) {
        $.post(
            "rooms/saveT", //请求的url路径
            saveJsonRooms, //数据
            function (data){
                if(data === 'success'){
                    //重新加载客房信息
                    loadAllRooms();
                    layer.msg("添加成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                }else{
                    layer.msg("添加失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    //图片放大镜
    function hoverOpenImg(){
        var img_show = null; // tips提示
        $('img').hover(function(){
            var img = "<img class='img_msg' src='"+$(this).attr('src')+"' style='width:580px;' />";
            img_show = layer.tips(img, this,{
                tips:[2, 'rgba(41,41,41,.5)']
                ,area: ['600px']
                ,time: -1  //永久显示
                ,anim: 3
            });
        },function(){
            layer.close(img_show);
        });
        $('img').attr('style','max-width:270px');
    }

    //修改房间状态为不可见
    function updRoomsFlag(roomid,flag){
        $.post(
            "rooms/updT", //请求的url路径
            {"id":roomid,"flag":flag}, //数据
            function (data){
                if(data === 'success'){
                    layer.msg("删除成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                    loadAllRooms();
                }else{
                    layer.msg("删除失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    /**************************自定义绑定函数**************************************/
    $("ul").eq(0).on('click','button',function () {
        //获取客房id
        var roomid = $(this).attr("roomid");
        layer.confirm('确定删除客房么', function(index){
            //向服务端发送删除指令
            updRoomsFlag(roomid,'0');
            layer.close(index);

        });
    })

    $("ul").eq(2).on('click','button',function () {
        var event = $(this).val();
        var roomid = $(this).attr("roomid");
        if (event == 'del'){
            layer.confirm('确定删除客房', function(index){
                //向服务端发送删除指令
                updRoomsFlag(roomid,'0');
                layer.close(index);
            });
        }else {
            layer.confirm('确定客房打扫完毕?', function(index){
                //向服务端发送删除指令
                updRoomsStatus(roomid,'0');
                layer.close(index);
            });
        }
    })

    //绑定添加按钮
    $("#saveRoomsUI").click(function () {
        //2.清空添加的表单
        $("form").eq(0).find("input").val("");
        element.progress('demo', '0%'); //进度条复位
        //3.默认回显图片
        $('#demo1').attr("src", "/img/fm1.jpg");
        $("#roomPicId").val("fm1.jpg");
        //1.将添加界面弹出
        layer.open({
            type:1,  //弹出类型
            title:"客房添加操作界面",  //弹框标题
            area:['400px','500px'],  //弹框款高度
            anim: 2,  //弹出的动画效果
            shade:0.5,  //阴影遮罩
            content:$("#saveRoomsDiv")  //弹出的内容
        });
    })


});
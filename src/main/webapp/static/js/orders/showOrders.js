layui.use(['jquery','layer', 'table','form','laydate'], function() {
    var $ = layui.jquery    //引入jquery模块
        , layer = layui.layer  //引用layer弹出层模块
        , table = layui.table  //引用table数据表格模块
        , form = layui.form  //引用form表单模块
        , laydate = layui.laydate;  //引用日期模块

    var selJsonOrders = {};   //查询订单数据的条件

    var currentPage = 1;  //全局的当前页

    //日期时间范围选择
    laydate.render({
        elem: '#test3'
        ,type: 'datetime'
        ,format: 'yyyy/MM/dd HH:mm:ss'
        ,range: true //或 range: '~' 来自定义分割字符
    });

    loadPageOrders();

    //根据条件查询订单数据,提交监听表单
    form.on('submit(demo1)', function (data) {
        console.log(data.field)
        selJsonOrders = {};  //将储存查询条件的json清空
        if(data.field.queryTimes!=''){
            //时间范围有选择,将时间进行切割
            var arrTimes = data.field.queryTimes.split("-");
            //起始时间
            selJsonOrders['minDate'] = arrTimes[0];
            //结束时间
            selJsonOrders['maxDate'] = arrTimes[1];
        }
        selJsonOrders['orderNum'] = data.field.orderNum;
        selJsonOrders['orderStatus'] = data.field.orderStatus;
        console.log(selJsonOrders)
        loadPageOrders();
        return false;  //阻止表单跳转提交
    });

    //工具条事件
    table.on('tool(test)', function(obj){ //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象（如果有的话）

        console.log(data)

        if(layEvent === 'del'){ //删除
            layer.confirm('确定删除订单么', function(index){
                //向服务端发送删除指令(实际为更新状态指令)
                updOrdersFlag(data.id,obj);

                layer.close(index);

            });
        } else if(layEvent === 'payUI'){ //编辑
            //跳转到支付宝支付页面,同时传递参数
            layer.confirm('确定支付订单么', function(index){
                //打开一个新窗口进行支付
                window.open("model/toOrdersPay?orderNum="+data.orderNum+"&orderMoney="+data.orderMoney);
                layer.close(index);

            });
        }
    });

    //头工具栏事件
    table.on('toolbar(test)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
            case 'delBatchOrders':
                var data = checkStatus.data;
                console.log(data);
                //判断是否选中数据
                if (data.length != 0){
                    //有选中的数据则将选中的数据的id拼成字符串传递至后端
                    var idsStr = "";
                    var checkDelIf =true;//判断是否能删除订单,如果有未支付订单,下面的if判断会改成 false
                    //循环data里存的数据
                    for (let i=0;i<data.length;i++){
                        //进行判断,如果有未支付的订单,提醒支付,支付过的订单才需要删除
                        if (data[i].orderStatus == '0'){
                                checkDelIf =false;
                            break;
                        }else {
                            idsStr += data[i].id+",";
                        }
                    }
                    if (checkDelIf){
                        //进到这里表示选中的都是未支付的订单
                        //下一步就应该截取字符串,传送到后端,进行修改的操作
                        idsStr = idsStr.substring(0,idsStr.length-1);
                        layer.confirm('真的删除订单么', function(index){
                            //向服务端发送删除指令(实际为更新状态指令)
                            updBatchOrdersFlag(idsStr);
                            layer.close(index);

                        });

                    }else {
                        layer.msg("有未支付的订单!",{icon:2,time:2000,anim:2,shade:0.5});
                    }

                }else {
                    layer.msg("请选择批量删除的订单!",{icon:2,time:2000,anim:2,shade:0.5});
                }

                break;
            //自定义头工具栏右侧图标 - 提示
            case 'LAYTABLE_TIPS':
                layer.alert('这是工具栏右侧自定义的一个图标按钮');
                break;
        };
    });

    /********************自定义layui函数**********************/
    //根据条件分页查询订单数据
    function loadPageOrders() {
        //表格的分页加载，数据表格方法级渲染
        table.render({  //数据表格的数据渲染(此UI框架底层是进行异步加载)
            elem: '#demo'  //绑定容器  根据标签（数据容器）的id属性来
            , height: 412   //容器高度
            , limit: 3   //每一页显示的数据条数，默认值为10
            , limits: [2, 3, 5, 8, 10, 15, 20]   //进行每一页数据条数的选择
            , url: 'orders/loadDataByParams' //访问服务器端的数据接口(异步请求)，返回的json格式的数据
            ,toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
            ,defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
            title: '提示'
            ,layEvent: 'LAYTABLE_TIPS'
            ,icon: 'layui-icon-tips'
            }]
            , where:selJsonOrders
            , even: true  //每一行有渐变效果
            , page: true //开启分页,此时会自动的将当前页page和每一页数据条数limit的数值传回服务器端
            , cols: [[ //表头
                //加入复选框列
                {type: 'checkbox'}
                , {field: 'id', title: 'ID', align: 'center', width: 80, sort: true}
                , {field: 'orderNum', title: '订单编号' , align: 'center', width: 180}
                , {field: 'customerName', title: '客人姓名', align: 'center', width: 140, sort: true,templet: '<div>{{d.inRoomInfo.customerName}}</div>'}
                , {field: 'idcard', title: '身份证号', align: 'center', width: 210,templet: '<div>{{d.inRoomInfo.idcard}}</div>'}
                , {field: 'isVip', title: 'vip', align: 'center', width: 100,templet: '#isVipTpl'}
                , {field: 'phone', title: '手机号', align: 'center', width: 180, sort: true,templet: '<div>{{d.inRoomInfo.phone}}</div>'}
                , {field: 'createDate', title: '下单时间', align: 'center', width: 240, sort: true}
                , {field: 'orderMoney', title: '总价',align: 'center', width: 140, sort: true}
                , {field: 'remark', title: '备注',align: 'center', width: 280, sort: true}
                , {field: 'orderStatus', title: '状态',align: 'center', width: 120, sort: true,templet:'#orderStatusTpl'}
                , {title: '操作', align: 'center', toolbar: '#barDemo',fixed:'right', width: 180}
            ]],
            done: function (res, curr, count) {  //执行分页是的函数回调；res为分页时服务器端的整个Map集合数据  curr为当前页  count为总的数据条数
                //每一次分页加载时调用图片放大镜函数
                currentPage = curr;  //将分页时的当前页赋值给次全局变量
            }
        });
    }

    /********************自定义函数*****************************/
    //修改订单状态为不显示
    function updOrdersFlag(id,obj){
        $.post(
            "orders/updT", //请求的url路径
            {"id":id,"flag":"0"},   //数据
            function (data){
                if(data === 'success'){
                    layer.msg("信息删除成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                    obj.del();//弹出信息删除成功以后再删除行数据
                }else{
                    layer.msg("信息删除失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }

    function updBatchOrdersFlag(idsStr){
        $.post(
            "orders/updBatchTByIds", //请求的url路径
            {"ids":idsStr,"flag":"0"},   //数据
            function (data){
                if(data === 'success'){
                    layer.msg("信息批量删除成功！",{icon: 1,time:2000,anim: 1,shade:0.5});
                    table.reload('demo', {  //"demo"为容器id的值
                        page: {
                            curr: currentPage //重新从 当前 页开始
                        }
                    }); //只重载数据，异步加载表格数据
                }else{
                    layer.msg("信息批量删除失败！",{icon: 2,time:2000,anim: 2,shade:0.5});
                }
            },"text" //text : 表示后端响应的是文本
        ).error(function (){
            layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
        })
    }



});
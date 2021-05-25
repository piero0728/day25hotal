<%--住房信息页面--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html>

<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<head>
    <base href="<%=basePath%>"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>Title</title>
    <!--引入layui的样式文件-->
    <link rel="stylesheet" href="static/lib/layui/css/layui.css">

    <style type="text/css">
        .layui-table td{
            height: 60px;
        }
        .layui-table td img{
            width:60px;
            height: 60px;
        }
    </style>

    <!--引入layui的js文件-->
    <script src="static/lib/layui/layui.js"></script>
</head>
<body>

    <%--显示标题--%>
    <div>
        <fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;">
            <legend>入住信息显示</legend>
        </fieldset>

        <%--数据表格--%>
        <table id="demo" lay-filter="test"></table>
    </div>
<%--    将退房的弹窗页面exitRooms.jsp引入--%>
    <jsp:include page="exitRooms.jsp"/>
</body>

<!--引入layui的js文件-->
<script src="static/js/inRoomInfo/showInRoomInfo.js"></script>

<!--自定义工具条,存放查看,退房,删除按钮-->
<script type="text/html" id="barDemo">
    <%--查看按钮--%>
    <a class="layui-btn layui-btn-xs" lay-event="query"><i class="layui-icon">&#xe615;</i>查看</a>

    <%--退房和删除按钮,做了一个if判断,未退房则显示退房,已退房则显示删除,这里的删除功能并不是真的实现删除功能而是改变状态不可见--%>
    {{#  if(d.outRoomStatus == 0){   }}
    <a class="layui-btn layui-btn-normal layui-btn-xs" lay-event="exitRoom"><i class="layui-icon">&#xe642;</i>退房</a>
    {{#  } else {    }}
    <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon">&#xe640;</i>删除</a>
    {{#  }    }}
</script>

<!--性别的自定义模板-->
<script type="text/html" id="genderTpl">
    {{#  if(d.gender == 1){ }}
    <font color="blue">男</font>
    {{#  } else { }}
    <font color="#ff1493">女</font>
    {{#  } }}
</script>

<!--是否会员的自定义模板-->
<script type="text/html" id="isVipTpl">
    {{#  if(d.isVip == 1){ }}
    <font color="red">VIP</font>
    {{#  } else { }}
<%--    <font color="#f5f5f5">否</font>--%>
    {{#  } }}
</script>

<!--入住信息状态的自定义模板-->
<script type="text/html" id="outRoomStatusTpl">
    {{#  if(d.outRoomStatus == 1){ }}
    <font color="green">已退房</font>
    {{#  } else { }}
    <font color="red">未退房</font>
    {{#  } }}
</script>
</html>

// 配置
layui.config({
	base: './static/hpModules/' // 扩展模块目录
}).extend({ // 模块别名 ，引入自定义模块
	hpTab: 'hpTab/hpTab',
	hpRightMenu: 'hpRightMenu/hpRightMenu',
	hpFormAll: 'hpFormAll/hpFormAll',
});

//JavaScript代码区域
layui.use(['element', 'carousel','hpTheme', 'hpTab', 'hpLayedit', 'hpRightMenu'], function() {
	
	var element = layui.element;
	var carousel = layui.carousel; //轮播
	var hpTab = layui.hpTab;
	var hpRightMenu = layui.hpRightMenu;
	var hpTheme=layui.hpTheme;
	var layer=layui.layer;
	$ = layui.$;
	
    // 初始化主题
	hpTheme.init();
	 //初始化轮播
	carousel.render({
		elem: '#test1',
		width: '100%', //设置容器宽度
		interval: 1500,
		height: '500px',
		arrow: 'none', //不显示箭头
		anim: 'fade', //切换动画方式
	});

    // 初始化 动态tab
    hpTab.init();
    // 右键tab菜单
    hpRightMenu.init();
	/************************自定义绑定事件**********************************/
	//绑定退出按钮
	$("#exit").click(function () {
		layer.confirm('确定退出', function(index) {
			exitUser();
			layer.close(index);
			//向服务端发送删除指令
		})
	})
	//退出用户界面
	function exitUser() {
		$.post(
			"user/exitUser", //请求的url路径
			function (data){
				if(data === 'success'){
					layer.tips('退出成功。','#yzm', {tips: [2,'green'],time:2000,tipsMore: true});
					//两秒之后跳转到登陆页面
					setTimeout("window.location.href = 'model/toLoginUI'",2000);

				}else{
					layer.tips('退出失败','#yzm', {tips: [2,'red'],time:2000,tipsMore: true});
				}
			},"text" //text : 表示后端响应的是文本
		).error(function (){
			layer.msg("数据请求异常！",{icon: 7,time:2000,anim: 3,shade:0.5});
		})
	}

});
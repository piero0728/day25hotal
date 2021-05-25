package cn.k0508.controller;

import cn.k0508.service.OrdersService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("model")
public class ModelController {

    //跳转到home主页
    @RequestMapping("toHome")
    public String toHome(){
        return "home";
    }

    //跳转到入住信息查询的页面---showInRoomInfo.jsp
    @RequestMapping("toShowInRoomInfo")
    public String toShowInRoomInfo(){
        return "inRoomInfo/showInRoomInfo";
    }

    //跳转到入住信息查询的页面---showInRoomInfo.jsp
    @RequestMapping("toSaveInRoomInfo")
    public String toSaveInRoomInfo(){
        return "inRoomInfo/saveInRoomInfo";
    }

    //跳转到查看订单页面---showOrders.jsp
    @RequestMapping("toShowOrders")
    public String toShowOrders(){
        return "orders/showOrders";
    }

    //跳转到支付宝支付页面----orderPay.jsp
    @RequestMapping("toOrdersPay")
    public String toOrdersPay(){
        return "alipay/orderPay";
    }

    @RequestMapping("toErrorPay")
    public String toErrorPay(){
        return "alipay/errorPay";
    }

    @RequestMapping("toShowRoomSale")
    public String toShowRoomSale(){
        return "roomSale/showRoomSale";
    }

    @RequestMapping("toShowVip")
    public String toShowVip(){
        return "vip/showVip";
    }

    @RequestMapping("toSaveVip")
    public String toSaveVip(){
        return "vip/saveVip";
    }

    @RequestMapping("toShowRooms")
    public String toShowRooms(){
        return "rooms/showRooms";
    }

    @RequestMapping("toShowRoomType")
    public String toShowRoomType(){
        return "roomType/showRoomType";
    }

    @RequestMapping("toLoginUI")
    public String toLoginUI(){
        return "login/login";
    }

    @RequestMapping("toShowDbi")
    public String toShowDbi(){
        return "dbi/showdbi";
    }
}

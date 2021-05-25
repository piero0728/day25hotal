package cn.k0508.controller;

import cn.k0508.pojo.Orders;
import cn.k0508.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("orders")
public class OrdersController extends BaseController<Orders>{
    @Autowired
    private OrdersService ordersService;

    @RequestMapping("afterOrdersPay")
    public String afterOrdersPay(String out_trade_no){
        try {
            return ordersService.afterOrdersPay(out_trade_no);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}

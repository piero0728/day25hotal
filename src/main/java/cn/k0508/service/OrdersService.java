package cn.k0508.service;

import cn.k0508.pojo.Orders;

public interface OrdersService extends BaseService<Orders> {

    String afterOrdersPay(String out_trade_no) throws Exception;
}

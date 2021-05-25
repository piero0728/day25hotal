package cn.k0508.service.impl;

import cn.k0508.dao.InRoomInfoMapper;
import cn.k0508.dao.OrdersMapper;
import cn.k0508.dao.RoomSaleMapper;
import cn.k0508.dao.RoomsMapper;
import cn.k0508.pojo.InRoomInfo;
import cn.k0508.pojo.Orders;
import cn.k0508.pojo.RoomSale;
import cn.k0508.pojo.Rooms;
import cn.k0508.service.OrdersService;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class OrdersServiceImpl extends BaseServiceImpl<Orders> implements OrdersService {
    @Autowired
    private OrdersMapper ordersMapper;
    @Autowired
    private InRoomInfoMapper inRoomInfoMapper;
    @Autowired
    private RoomsMapper roomsMapper;
    @Autowired
    private RoomSaleMapper roomSaleMapper;


    @Override
    public String saveT(Orders orders) {
        //1.生成订单数据(以订单的添加为主)
        //2.入住信息是否退房的状态的修改（未退房-->已退房）
        //3.客房的状态修改（已入住-->打扫）

        //1.生成订单数据(以订单的添加为主)
        int insOrdersCount = ordersMapper.insert(orders);

        //2.入住信息是否退房的状态的修改（未退房-->已退房 outRoomStatus 0->1）
        InRoomInfo inRoomInfo = new InRoomInfo();
        inRoomInfo.setId(orders.getIriId());//获得orders中的inRoomInfo的主键
        inRoomInfo.setOutRoomStatus("1");//将入住信息改为未入住
        int updInRoomInfoCount = inRoomInfoMapper.updateByPrimaryKeySelective(inRoomInfo);
        //3.客房的状态修改（已入住-->打扫） 1---->2
        InRoomInfo selInRoomInfo = inRoomInfoMapper.selectByPrimaryKey(orders.getIriId());//通过订单表的房间主键找到入住信息表对应的信息
        Rooms rooms = new Rooms();
        rooms.setId(selInRoomInfo.getRoomId());
        rooms.setRoomStatus("2");
        int updRoomsCount = roomsMapper.updateByPrimaryKeySelective(rooms);

        if(insOrdersCount>0 && updInRoomInfoCount>0 && updRoomsCount>0){
            return "success";
        }else {
            return "fail";
        }
    }

    //支付完成以后查询订单信息等操作
    @Override
    public String afterOrdersPay(String out_trade_no) throws Exception{
        //1.将订单状态从未结算改成已支付 0->1
        Orders parOrders = new Orders();//用来储存查询条件而创建
        parOrders.setOrderNum(out_trade_no);
        //方法中只有根据id查询,没有根据订单编号查询,因此需要重定义方法
        parOrders = ordersMapper.selectByParams(parOrders);

        Orders updOrders = new Orders();//用来修改而创建
        updOrders.setId(parOrders.getId());
        updOrders.setOrderStatus("1");
        int updOrdersCount = ordersMapper.updateByPrimaryKeySelective(updOrders);
        //2.在消费记录表新增一条消费记录
        RoomSale roomSale = new RoomSale();//创建一个消费记录
        String[] orderOthers = parOrders.getOrderOther().split(",");
        roomSale.setRoomNum(orderOthers[0]);
        roomSale.setCustomerName(orderOthers[1]);
        roomSale.setStartDate(DateUtils.parseDate(orderOthers[2],new String[]{"yyyy/MM/dd HH:mm:ss"}));
        roomSale.setEndDate(DateUtils.parseDate(orderOthers[3],new String[]{"yyyy/MM/dd HH:mm:ss"}));
        roomSale.setDays(Integer.valueOf(orderOthers[4]));

        String[] orderPrice = parOrders.getOrderPrice().split(",");
        //客房单价
        roomSale.setRoomPrice(Double.valueOf(orderPrice[0]));
        //其它消费
        roomSale.setOtherPrice(Double.valueOf(orderPrice[1]));
        //实际的住房金额
        roomSale.setRentPrice(Double.valueOf(orderPrice[2]));
        //订单的实际支付金额(订单的支付总金额)
        roomSale.setSalePrice(parOrders.getOrderMoney());
        //优惠金额（客房单价*天数-实际的住房金额）
        roomSale.setDiscountPrice(roomSale.getRoomPrice()*roomSale.getDays()-roomSale.getRentPrice());
        int roomSaleCount = roomSaleMapper.insert(roomSale);
        if (updOrdersCount>0 && roomSaleCount>0){
            //去到首页
            return "redirect:/model/toHome";
        }else {
            return "redirect:/model/toErrorPay";
        }
    }
}

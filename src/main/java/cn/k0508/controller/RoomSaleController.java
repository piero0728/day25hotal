package cn.k0508.controller;

import cn.k0508.pojo.RoomSale;
import cn.k0508.service.RoomSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("roomSale")
public class RoomSaleController extends BaseController<RoomSale> {
    @Autowired
    private RoomSaleService roomSaleService;
    //根据房间编号分组查询消费情况
    @RequestMapping("loadRoomSale")
    @ResponseBody
    public Map<String,Object> loadRoomSale(){
        try {
            return roomSaleService.findRoomSale();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

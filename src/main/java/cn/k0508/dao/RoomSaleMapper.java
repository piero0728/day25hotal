package cn.k0508.dao;

import cn.k0508.pojo.RoomSale;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

public interface RoomSaleMapper extends BaseMapper<RoomSale>{

    @Select("SELECT room_num roomNum,SUM(sale_price) salePriceAll from roomsale GROUP BY room_num")
    List<Map<String,Object>> selRoomSaleAll();
}
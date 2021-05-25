package cn.k0508.service;

import cn.k0508.pojo.RoomSale;

import java.util.Map;

public interface RoomSaleService extends BaseService<RoomSale> {
    Map<String, Object> findRoomSale();
}

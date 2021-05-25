package cn.k0508.service.impl;

import cn.k0508.dao.InRoomInfoMapper;
import cn.k0508.dao.RoomsMapper;
import cn.k0508.pojo.InRoomInfo;
import cn.k0508.pojo.Rooms;
import cn.k0508.service.InRoomInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class InRoomInfoServiceImpl extends BaseServiceImpl<InRoomInfo> implements InRoomInfoService {
    @Autowired
    private InRoomInfoMapper inRoomInfoMapper;

    @Autowired
    private RoomsMapper roomsMapper;

    @Override
    public String saveT(InRoomInfo inRoomInfo) {
        //1.添加入住信息
        Integer inRoomInfoCount = inRoomInfoMapper.insert(inRoomInfo);
        //2.修改房间状态 (未入住->已入住 0->1)
        Rooms rooms = new Rooms();
        rooms.setId(inRoomInfo.getRoomId());
        rooms.setRoomStatus("1");
        int updRoomsCount = roomsMapper.updateByPrimaryKeySelective(rooms);
        if (inRoomInfoCount>0 && updRoomsCount>0){
            return "success";
        }
        return "fail";
    }
}

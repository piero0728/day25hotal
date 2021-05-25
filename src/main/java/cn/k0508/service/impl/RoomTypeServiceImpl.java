package cn.k0508.service.impl;

import cn.k0508.pojo.RoomType;
import cn.k0508.service.RoomTypeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class RoomTypeServiceImpl extends BaseServiceImpl<RoomType> implements RoomTypeService {
}

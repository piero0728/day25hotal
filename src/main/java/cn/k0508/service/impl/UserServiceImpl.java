package cn.k0508.service.impl;

import cn.k0508.pojo.User;
import cn.k0508.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = false)
public class UserServiceImpl extends BaseServiceImpl<User> implements UserService {
}

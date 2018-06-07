package com.fzu.edu.service.impl;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.*;
import com.fzu.edu.model.*;
import com.fzu.edu.service.UserEduManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Map;

/**
 * Created by CLY on 2018/3/22.
 */
@Service("userEduManageService")
@Transactional(rollbackFor = Exception.class)
public class UserEduManageServiceImpl extends ServiceImpl<UserInfoMapper, UserInfo> implements UserEduManageService {
    @Resource
    private UserInfoMapper userInfoMapper;

    public int addUserEdu(Map params) {
        UserInfo userInfo = CDataSet.MapToData(params, UserInfo.class);
        if (userInfo.getId() == null) return userInfoMapper.insert(userInfo);
        else return userInfoMapper.updateById(userInfo);
    }
}

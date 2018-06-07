package com.fzu.edu.service.impl;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.UserInfoMapper;
import com.fzu.edu.model.UserInfo;
import com.fzu.edu.service.UserManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by CLY on 2018/3/22.
 */
@Service("userBasicManageService")
@Transactional(rollbackFor = Exception.class)
public class UserManageServiceImpl extends ServiceImpl<UserInfoMapper, UserInfo> implements UserManageService {
    @Resource
    private UserInfoMapper userInfoMapper;

    public Object addOrUpdateUserBasic(Map params) {
        UserInfo userInfo = CDataSet.MapToData(params, UserInfo.class);
        int n = 0;
        if (userInfo.getId() == null) n += userInfoMapper.insert(userInfo);
        else n += userInfoMapper.updateById(userInfo);
        if (n > 0){
            if (params.get("flag") == null) {
                userInfo.setFlag(0);
                userInfo = userInfoMapper.selectOne(userInfo);
                return userInfo;
            }else {
                return 1;
            }
        }else return 0;
    }

    public List getAll(Map params) {
        List u = userInfoMapper.getAllUserInfo(params);
        return u;
    }

}

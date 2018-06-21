package com.fzu.edu.service;

import com.baomidou.mybatisplus.service.IService;
import com.fzu.edu.model.UserInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 2018/3/22.
 */
public interface UserManageService extends IService<UserInfo> {

    List getAll(Map params);

    Object addOrUpdateUserBasic(Map params);

    int addScore(Map params);
}

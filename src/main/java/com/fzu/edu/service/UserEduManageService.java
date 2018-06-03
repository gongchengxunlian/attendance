package com.fzu.edu.service;

import com.baomidou.mybatisplus.service.IService;
import com.fzu.edu.model.UserInfo;

import java.util.Map;

/**
 * Created by ASUS on 2018/3/22.
 */
public interface UserEduManageService extends IService<UserInfo> {


    int addUserEdu(Map params);
}

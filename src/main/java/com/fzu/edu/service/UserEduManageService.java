package com.fzu.edu.service;

import com.baomidou.mybatisplus.service.IService;
import com.fzu.edu.model.UserBasicInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 2018/3/22.
 */
public interface UserEduManageService extends IService<UserBasicInfo> {


    int addUserEdu(Map params);
}
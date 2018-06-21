package com.fzu.edu.service;

import com.baomidou.mybatisplus.service.IService;
import com.fzu.edu.model.SchoolInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 2018/3/22.
 */
public interface SchoolManageService extends IService<SchoolInfo> {

    List getAll(Map params);

    int addOrUpdateSchool(Map params);

    int setSchoolStartTime(Map params);
}

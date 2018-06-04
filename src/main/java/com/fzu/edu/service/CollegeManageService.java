package com.fzu.edu.service;

import com.baomidou.mybatisplus.service.IService;
import com.fzu.edu.model.CollegeInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 2018/3/22.
 */
public interface CollegeManageService extends IService<CollegeInfo> {

    List getAll(Map params);

    int addOrUpdateCollege(String params, boolean b);

    List getSchoolAndCollege(Map params);
}

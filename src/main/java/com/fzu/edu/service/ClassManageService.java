package com.fzu.edu.service;

import com.baomidou.mybatisplus.service.IService;
import com.fzu.edu.model.ClassInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 2018/3/22.
 */
public interface ClassManageService extends IService<ClassInfo> {

    List getAll(Map params);

    int addOrUpdateClass(String params);
}

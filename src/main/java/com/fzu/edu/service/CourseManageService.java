package com.fzu.edu.service;

import com.baomidou.mybatisplus.service.IService;
import com.fzu.edu.model.CourseInfo;

import java.util.List;
import java.util.Map;

/**
 * Created by ASUS on 2018/3/22.
 */
public interface CourseManageService extends IService<CourseInfo> {

    List getAll(Map params);

    List getAllCourseArrage(Map params);

    int addOrUpdateCourse(String params);

    List getCollegeAndCourse(Map params);

    int addOrUpdateCourseArrage(String params);

}

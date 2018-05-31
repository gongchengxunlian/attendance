package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.CourseInfo;
import com.fzu.edu.model.CollegeInfo;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CourseManageMapper extends BaseMapper<CourseInfo> {

    List getAllCourse(Map params);

    List getCollegeAndCourse(CollegeInfo collegeInfo);
}
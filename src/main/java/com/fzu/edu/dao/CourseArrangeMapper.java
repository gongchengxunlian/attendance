package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.CourseArrange;
import com.fzu.edu.model.CourseArrangeDetail;
import com.fzu.edu.model.CourseFullArrange;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CourseArrangeMapper extends BaseMapper<CourseArrange> {

    int checkTeacherExist(CourseArrange courseArrange);

    int checkTimeConflict(CourseArrange courseArrange);

    List<CourseFullArrange> getAllCourseArrage(Map params);
}
package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.StudentAndCourse;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentAndCourseMapper extends BaseMapper<StudentAndCourse> {

    int insertOne(StudentAndCourse studentAndCourses);
}
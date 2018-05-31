package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.TeacherInfo;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public interface TeacherInfoMapper extends BaseMapper<TeacherInfo> {


    List<HashMap> getAllTeacher(Map params);

    HashMap<String,Integer> loginCheck(HashMap sqlWhere);
}
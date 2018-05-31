package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.StudentInfo;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public interface StudentInfoMapper extends BaseMapper<StudentInfo> {


    List<HashMap> getAllStudent(Map params);

    HashMap<String,Integer> loginCheck(HashMap sqlWhere);
}
package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.ClassInfo;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public interface ClassManageMapper extends BaseMapper<ClassInfo> {

    List<HashMap> getAllClass(Map params);
}
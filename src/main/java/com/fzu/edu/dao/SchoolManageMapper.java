package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.SchoolInfo;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


@Repository
public interface SchoolManageMapper extends BaseMapper<SchoolInfo> {

    List getAllSchool(Map params);
}
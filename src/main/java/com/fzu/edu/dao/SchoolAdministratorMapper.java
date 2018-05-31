package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.SchoolAdministrator;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public interface SchoolAdministratorMapper extends BaseMapper<SchoolAdministrator> {

    List getAll(Map params);

    HashMap<String,Integer> loginCheck(HashMap sqlWhere);

    List getAllSchoolAdministrator(Map params);
}
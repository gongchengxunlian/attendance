package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.SystemAdministrator;
import org.springframework.stereotype.Repository;

import java.util.HashMap;

@Repository
public interface SystemAdministratorMapper extends BaseMapper<SystemAdministrator> {

    HashMap<String,Integer> loginCheck(HashMap sqlWhere);
}
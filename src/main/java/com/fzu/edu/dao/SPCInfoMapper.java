package com.fzu.edu.dao;

import com.fzu.edu.model.SPCInfo;

public interface SPCInfoMapper {
    int insert(SPCInfo record);

    int insertSelective(SPCInfo record);
}
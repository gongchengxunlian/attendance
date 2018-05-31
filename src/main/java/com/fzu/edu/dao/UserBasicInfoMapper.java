package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.UserBasicInfo;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface UserBasicInfoMapper extends BaseMapper<UserBasicInfo> {

    List getAllUserBasic(Map params);
}
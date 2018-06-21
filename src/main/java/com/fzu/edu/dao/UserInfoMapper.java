package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.UserInfo;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface UserInfoMapper extends BaseMapper<UserInfo> {

    List getAllUserInfo(Map params);

    int resetPassword(Map params);

    int addScore(Map params);
}
package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.UserLoginType;
import org.springframework.stereotype.Repository;

/**
 * Created by huhu on 2018/5/12.
 */

@Repository
public interface UserLogMapper extends BaseMapper<UserLoginType> {  }

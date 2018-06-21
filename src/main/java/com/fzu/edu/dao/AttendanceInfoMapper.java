package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.AttendanceInfo;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceInfoMapper extends BaseMapper<AttendanceInfo> {

    int insertSelective(AttendanceInfo record);

}
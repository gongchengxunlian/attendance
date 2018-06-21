package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.SchoolStartTime;
import org.springframework.stereotype.Repository;

import java.util.Map;

/**
 * Created by huhu on 2018/6/13.
 */
@Repository
public interface SchoolStartTimeMapper extends BaseMapper<SchoolStartTime> {
    int insertSelective(SchoolStartTime schoolStartTime);

    int updateBySchoolId(Map params);
}

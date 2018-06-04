package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.CollegeChildren;
import com.fzu.edu.model.CollegeInfo;
import com.fzu.edu.model.CollegeInfoExtends;
import com.fzu.edu.model.SchoolInfo;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface CollegeManageMapper extends BaseMapper<CollegeInfo> {

    List getAllCollege(Map params);

    List getSchoolAndCollege(SchoolInfo schoolInfo);

    CollegeInfoExtends getCollegeParents(Integer collegeId);

    int insertCollegeChildren(CollegeChildren cc);
}
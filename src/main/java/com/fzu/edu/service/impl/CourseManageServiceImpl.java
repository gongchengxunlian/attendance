package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.CourseFullInfoMapper;
import com.fzu.edu.dao.CourseManageMapper;
import com.fzu.edu.model.CourseFullInfo;
import com.fzu.edu.model.CourseInfo;
import com.fzu.edu.model.CollegeInfo;
import com.fzu.edu.service.CourseManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by CLY on 2018/3/22.
 */
@Service("courseManageService")
@Transactional(rollbackFor = Exception.class)
public class CourseManageServiceImpl extends ServiceImpl<CourseManageMapper, CourseInfo> implements CourseManageService {

    @Resource
    private CourseManageMapper courseManageMapper;
    @Resource
    private CourseFullInfoMapper courseFullInfoMapper;

    public int addOrUpdateCourse(String params) {
        CourseInfo courseInfo = JSONObject.parseObject(params, CourseInfo.class);
        if (courseInfo.getId() == null) return courseManageMapper.insert(courseInfo);
        else return courseManageMapper.updateById(courseInfo);
    }

    public List getAll(Map params) {
        List<CourseFullInfo> course = courseManageMapper.getAllCourse(params);
        return course;
    }

    public List getCollegeAndCourse(Map params) {
        CollegeInfo collegeInfo = CDataSet.MapToData(params, CollegeInfo.class);
        List dt = courseManageMapper.getCollegeAndCourse(collegeInfo);
        List<String> fields = CDataSet.getDeclaredFieldsStrings(CollegeInfo.class);
        String[] fieldsS = fields.toArray(new String[0]);
        List data = CDataSet.MergeField(dt, fieldsS);
        return data;
    }
}

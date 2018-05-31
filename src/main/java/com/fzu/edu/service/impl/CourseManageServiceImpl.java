package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.CourseManageMapper;
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

    public int addOrUpdateCourse(String params) {
        CourseInfo courseInfo = JSONObject.parseObject(params, CourseInfo.class);
        if (courseInfo.getId() == null) return courseManageMapper.insert(courseInfo);
        else return courseManageMapper.updateById(courseInfo);
    }

    public List getAll(Map params) {
        List<HashMap> course = courseManageMapper.getAllCourse(params);
        for (HashMap h : course){
            String time = h.get("time").toString();
            ArrayList timeList = new ArrayList();
            String weekStr = h.get("week").toString();
            String classIndexStr = h.get("class_index").toString();
            String[] weeks = JSONObject.parseObject(weekStr, String[].class);
            String[] classIndexs = JSONObject.parseObject(classIndexStr, String[].class);
            int i = 0;
            for (; i < weeks.length; i++){
                String week = "星期" + CDataSet.numberToString(weeks[i]);
                String classIndex = "第" + CDataSet.numberToString(classIndexs[i]) + "节课";
                String timeTemp = week + ", " + classIndex;
                timeList.add(timeTemp);
                time += ", [" + timeTemp + "]";
            }
            h.put("timeHeader", h.get("time").toString());
            h.put("timeList", timeList);
            h.put("time", time);
            h.put("week", weeks);
            h.put("classIndex", classIndexs);
            h.put("studyHours", h.get("study_hours"));
            h.put("timeType", h.get("time_type"));
            h.put("startTime", h.get("start_time"));
        }
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

package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.*;
import com.fzu.edu.model.*;
import com.fzu.edu.service.CourseManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;

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
    @Resource
    private CourseArrangeMapper courseArrangeMapper;
    @Resource
    private CourseFullArrangeMapper courseFullArrangeMapper;
    @Resource
    private StudentCourseFullMapper studentCourseFullMapper;


    public int addOrUpdateCourse(String params) {
        CourseInfo courseInfo = JSONObject.parseObject(params, CourseInfo.class);
        if (courseInfo.getId() == null) return courseManageMapper.insert(courseInfo);
        else return courseManageMapper.updateById(courseInfo);
    }

    public int addOrUpdateCourseArrage(String params) {
        CourseArrange courseArrange = JSONObject.parseObject(params, CourseArrange.class);
        removeSameWeekAndClassIndex(courseArrange);

        if (checkTeacherExist(courseArrange)){
            return 0;
        }

        if (checkTimeConflict(courseArrange)){
            return 0;
        }

        if (courseArrange.getId() == null) {
            return courseArrangeMapper.insert(courseArrange);
        } else {
            return courseArrangeMapper.updateById(courseArrange);
        }
    }

    public int updateCourseArrage(Map params) {
        return courseArrangeMapper.updateById(JSON.parseObject(JSON.toJSONString(params), CourseArrange.class));
    }

    public List getAll(Map params) {
        List<CourseFullInfo> course = courseManageMapper.getAllCourse(params);
        return course;
    }

    public List getAllCourseArrage(Map params) {
        params.remove("pageNo");
        params.remove("pageSize");
        List l = null;
        if (params.get("teacherId") != null){
            List<CourseFullArrange> courseFullArranges = courseArrangeMapper.getAllCourseArrage(params);
            List<CourseArrangeDetail> courseArrangeDetails = new ArrayList<CourseArrangeDetail>();
            for (CourseFullArrange courseFullArrange : courseFullArranges){
                String week = (String) courseFullArrange.getWeek();
                String classIndex = (String) courseFullArrange.getClassIndex();
                courseFullArrange.setWeek(null);
                courseFullArrange.setClassIndex(null);
                String courseFullArrangeStr = JSON.toJSONString(courseFullArrange);
                CourseArrangeDetail courseArrangeDetail = JSON.parseObject(courseFullArrangeStr, CourseArrangeDetail.class);
                courseArrangeDetail.setWeek(JSON.parseObject(week, ArrayList.class));
                courseArrangeDetail.setClassIndex(JSON.parseObject(classIndex, ArrayList.class));
                courseArrangeDetail.createYearTerm();
                courseArrangeDetail.createWhenWhere();
                courseArrangeDetails.add(courseArrangeDetail);
            }
            l = courseArrangeDetails;
        }else if (params.get("student_id") != null){
            params.remove("schoolId");
            List<StudentCourseFull> studentCourseFulls = studentCourseFullMapper.selectByMap(params);
            List<StudentCourseFull2> studentCourseFull2s = new ArrayList<StudentCourseFull2>();
            for (StudentCourseFull studentCourseFull : studentCourseFulls){
                String week = (String) studentCourseFull.getWeek();
                String classIndex = (String) studentCourseFull.getClassIndex();
                studentCourseFull.setWeek(null);
                studentCourseFull.setClassIndex(null);
                String studentCourseFullStr = JSON.toJSONString(studentCourseFull);
                StudentCourseFull2 studentCourseFull2 = JSON.parseObject(studentCourseFullStr, StudentCourseFull2.class);
                studentCourseFull2.setWeek(JSON.parseObject(week, ArrayList.class));
                studentCourseFull2.setClassIndex(JSON.parseObject(classIndex, ArrayList.class));
                studentCourseFull2.createYearTerm();
                studentCourseFull2.createWhenWhere();
                studentCourseFull2s.add(studentCourseFull2);
            }
            l = studentCourseFull2s;
        }

        return l;
    }

    public List getCollegeAndCourse(Map params) {
        CollegeInfo collegeInfo = CDataSet.MapToData(params, CollegeInfo.class);
        List dt = courseManageMapper.getCollegeAndCourse(collegeInfo);
        List<String> fields = CDataSet.getDeclaredFieldsStrings(CollegeInfo.class);
        String[] fieldsS = fields.toArray(new String[0]);
        List data = CDataSet.MergeField(dt, fieldsS);
        return data;
    }

    /**
     * 去掉重复的上课时间
     * @param courseArrange
     */
    private void removeSameWeekAndClassIndex(CourseArrange courseArrange){
        ArrayList classIndex = JSON.parseObject(courseArrange.getClassIndex().toString(), ArrayList.class);
        ArrayList week = JSON.parseObject(courseArrange.getWeek().toString(), ArrayList.class);
        HashMap W = new HashMap();
        for (int i = 0; i < week.size(); i++){
            Object w = week.get(i);
            Object c = classIndex.get(i);
            if (W.get(w) == null) {
                W.put(w, new HashMap());
            }
            HashMap C = (HashMap) W.get(w);
            for (Object cc : (JSONArray) c){
                C.put(cc, 1);
            }
        }
        ArrayList ci = new ArrayList();
        ArrayList w = new ArrayList();
        for (Object o : W.entrySet()){
            Map.Entry e = (Map.Entry) o;
            Object key = e.getKey();
            HashMap value = (HashMap) e.getValue();
            w.add(key);
            ArrayList cii = new ArrayList();
            for (Object oo : value.entrySet()){
                cii.add(((Map.Entry) oo).getKey());
            }
            Collections.sort(cii);
            ci.add(cii);
        }
        courseArrange.setWeek(JSON.toJSONString(w));
        courseArrange.setClassIndex(JSON.toJSONString(ci));
    }


    /**
     * 检查教师冲突
     * @param courseArrange
     * @return
     */
    private boolean checkTeacherExist(CourseArrange courseArrange) {
        int n = courseArrangeMapper.checkTeacherExist(courseArrange);
        if (n > 0) return true;
        else return false;
    }

    /**
     * 检查时间冲突
     * @param courseArrange
     * @return
     */
    private boolean checkTimeConflict(CourseArrange courseArrange) {
        int n = courseArrangeMapper.checkTimeConflict(courseArrange);
        if (n > 0) return true;
        else return false;
    }
}

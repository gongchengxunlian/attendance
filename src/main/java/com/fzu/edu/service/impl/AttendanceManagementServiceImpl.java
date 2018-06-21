package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fzu.edu.dao.*;
import com.fzu.edu.model.*;
import com.fzu.edu.service.AttendanceManagementService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/6/13.
 */

@Service("attendanceManagementService")
@Transactional(rollbackFor = Exception.class)
public class AttendanceManagementServiceImpl implements AttendanceManagementService {

    private Logger log = Logger.getLogger(AttendanceManagementServiceImpl.class);

    @Resource
    private StudentCourseFullMapper studentCourseFullMapper;
    @Resource
    private AttendanceInfoMapper attendanceInfoMapper;
    @Resource
    private AttendanceDetailMapper attendanceDetailMapper;
    @Resource
    private AttendanceDetailFullMapper attendanceDetailFullMapper;
    @Resource
    private SchoolStartTimeMapper schoolStartTimeMapper;
    @Resource
    private AttendanceCollectMapper attendanceCollectMapper;
    @Resource
    private AttendanceCollectClassMapper attendanceCollectClassMapper;

    public List getStudents(Map params) {
        Calendar c = Calendar.getInstance();
        int year = c.get(Calendar.YEAR);
        int month = c.get(Calendar.MONTH);
        int term = month / 6;
        params.put("course_id", params.get("courseId"));
        params.put("start_year", year);
        params.put("term", term);
        params.remove("courseId");
        List l = studentCourseFullMapper.selectByMap(params);
        return l;
    }

    public List getAttendance(Map params) {
        int week = getCurrentWeek();
        params.put("course_arrange_id", params.get("id"));
        params.put("current_week", week);
        params.put("date", Calendar.getInstance().get(Calendar.DAY_OF_WEEK));
        params.remove("id");
        List attendanceDetailFull = attendanceDetailFullMapper.selectByMap(params);
        return attendanceDetailFull;
    }

    public int saveData(String params) {
        Map m = JSON.parseObject(params, Map.class);
        int week = getCurrentWeek();
        int day = Calendar.getInstance().get(Calendar.DAY_OF_WEEK);
        int courseArrangeId = Integer.parseInt(m.get("id").toString());
        int flag = (m.get("flag") == null) ? 0 : Integer.parseInt(m.get("flag").toString());
        AttendanceInfo attendanceInfo = new AttendanceInfo();
        attendanceInfo.setCourseArrangeId(courseArrangeId);
        attendanceInfo.setCurrentWeek(week);
        attendanceInfo.setDate(day);
        attendanceInfo = attendanceInfoMapper.selectOne(attendanceInfo);
        int n = 0;
        if (attendanceInfo == null) {
            attendanceInfo = new AttendanceInfo();
            attendanceInfo.setCourseArrangeId(courseArrangeId);
            attendanceInfo.setCurrentWeek(week);
            attendanceInfo.setDate(day);
            n += attendanceInfoMapper.insertSelective(attendanceInfo);
        }else {
            attendanceInfo.setCurrentWeek(week);
            attendanceInfo.setDate(day);
            n += attendanceInfoMapper.updateById(attendanceInfo);
        }
        attendanceInfo = attendanceInfoMapper.selectOne(attendanceInfo);
        Integer id = attendanceInfo.getId();
        JSONArray array = (JSONArray) m.get("studentIds");
        for (Object o : array){
            m = (Map) o;
            Integer studentId = Integer.parseInt(m.get("studentId").toString());
            String position = JSON.toJSONString(m.get("position"));
            AttendanceDetail attendanceDetail = new AttendanceDetail();
            attendanceDetail.setAttendanceInfoId(id);
            attendanceDetail.setStudentId(studentId);
            attendanceDetail = attendanceDetailMapper.selectOne(attendanceDetail);
            if (attendanceDetail == null){
                attendanceDetail = new AttendanceDetail();
                attendanceDetail.setAttendanceInfoId(id);
                attendanceDetail.setStudentId(studentId);
                attendanceDetail.setPosition(position);
                n += attendanceDetailMapper.insert(attendanceDetail);
            }else {
                attendanceDetail.setPosition(position);
                attendanceDetail.setFlag(flag);
                n += attendanceDetailMapper.updateById(attendanceDetail);
            }
        }
        return n;
    }

    public int getCurrentWeek(){
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int day = calendar.get(Calendar.DATE);
        int week = calendar.get(Calendar.WEEK_OF_YEAR);
        int term = month / 6;
        SchoolStartTime schoolStartTime = new SchoolStartTime();
        schoolStartTime.setYear(year);
        schoolStartTime.setSign(term);
        schoolStartTime = schoolStartTimeMapper.selectOne(schoolStartTime);
        long startTime = schoolStartTime.getStartTime();
        calendar.setTimeInMillis(startTime);
        int week2 = calendar.get(Calendar.WEEK_OF_YEAR);
        int currentWeek = week - week2;
        if (currentWeek < 0) return 0;
        return currentWeek;
    }

    public int cancelAttendance(Map params) {
        params.put("flag", 1);
        saveData(JSON.toJSONString(params));
        return 0;
    }

    public List getClassCollect(HashMap params) {
        setParamsForCollect(params);
        List list = attendanceCollectClassMapper.selectByMap(params);
        return list;
    }

    public List getOneCollect(Map params) {
        setParamsForCollect(params);
        List list = attendanceCollectMapper.selectByMap(params);
        return list;
    }

    private void setParamsForCollect(Map params){
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int term = month / 6;
        params.put("start_year", year);
        params.put("term", term);
    }
}

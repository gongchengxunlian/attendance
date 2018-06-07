package com.fzu.edu.model;

import com.alibaba.fastjson.JSON;
import com.fei.common.CDataSet;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by huhu on 2018/6/7.
 */
public class CourseArrangeDetail extends CourseFullArrange {

    private String courseName;

    private String teacherName;

    private HashMap whenWhere;

    private String yearTerm;

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public void createWhenWhere() {
        ArrayList<Integer> weekList = JSON.parseObject(getWeek(), ArrayList.class);
        ArrayList<ArrayList<Integer>> classIndexList = JSON.parseObject(getClassIndex(), ArrayList.class);
        ArrayList<String> weekStr = new ArrayList<String>();
        ArrayList<ArrayList> classIndexStr = new ArrayList<ArrayList>();
        for (int i  = 0; i < weekList.size(); i++){
            Integer week = weekList.get(i);
            String w = CDataSet.numberToString(week.toString());
            if (week == 0) weekStr.add("星期日");
            else weekStr.add("星期" + w);
            ArrayList<Integer> classIndex = classIndexList.get(i);
            ArrayList<String> cIS = new ArrayList<String>();
            for (Integer c : classIndex){
                String cc = CDataSet.numberToString(c.toString());
                cIS.add("第"+ cc +"节");
            }
            classIndexStr.add(cIS);
        }
        HashMap h = new HashMap();
        h.put("week", weekStr);
        h.put("classIndex", classIndexStr);
        h.put("class", getBuildName() + getClassName());
        whenWhere = h;
    }

    public void createYearTerm() {
        String year = getStartYear() + "-" + (Integer.parseInt(getStartYear()) + 1);
        String term = getTerm() == 0 ? "上学期" : "下学期";
        this.yearTerm = year + " " + term;
    }

    public String getYearTerm() {
        return yearTerm;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public HashMap getWhenWhere() {
        return whenWhere;
    }

}

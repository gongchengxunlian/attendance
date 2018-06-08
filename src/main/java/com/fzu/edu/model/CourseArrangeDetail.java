package com.fzu.edu.model;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fei.common.CDataSet;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Created by huhu on 2018/6/7.
 */
public class CourseArrangeDetail extends CourseFullArrange {

    private ArrayList classIndex;

    private ArrayList week;

    private String teacherName;

    private HashMap whenWhere;

    private String yearTerm;

    public void createWhenWhere() {
        ArrayList weekList = week;
        ArrayList<JSONArray> classIndexList = classIndex;

        ArrayList<String> weekStr = new ArrayList<String>();
        ArrayList<ArrayList> classIndexStr = new ArrayList<ArrayList>();

        for (int i  = 0; i < weekList.size(); i++){
            Object week = weekList.get(i);
            String w = CDataSet.numberToString(week.toString());
            if (Integer.parseInt(week.toString()) == 0) weekStr.add("星期日");
            else weekStr.add("星期" + w);
            JSONArray classIndex = classIndexList.get(i);
            ArrayList<String> cIS = new ArrayList<String>();
            for (Object c : classIndex){
                String cc = CDataSet.numberToString(c.toString());
                cIS.add("第"+ cc +"节");
            }
            classIndexStr.add(cIS);
        }
        HashMap h = new HashMap();
        h.put("week", weekStr);
        h.put("classIndex", classIndexStr);
        h.put("class", getBuildName() + "-" + getClassName());
        this.whenWhere = h;
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

    public ArrayList getClassIndex() {
        return classIndex;
    }

    public void setClassIndex(ArrayList classIndex) {
        this.classIndex = classIndex;
    }

    public ArrayList getWeek() {
        return week;
    }

    public void setWeek(ArrayList week) {
        this.week = week;
    }
}

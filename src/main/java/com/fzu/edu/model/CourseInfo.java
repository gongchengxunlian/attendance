package com.fzu.edu.model;

public class CourseInfo {
    private String name;

    private Integer flag;

    private Integer collegeId;

    private String info;

    private Integer id;

    private Integer startTime;

    private Integer timeType;

    private Float credit;

    private Float studyHours;

    private String week;

    private String classIndex;

    public String getClassIndex() {
        return classIndex;
    }

    public void setClassIndex(String classIndex) {
        this.classIndex = classIndex;
    }

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public Float getCredit() {
        return credit;
    }

    public void setCredit(Float credit) {
        this.credit = credit;
    }

    public Float getStudyHours() {
        return studyHours;
    }

    public void setStudyHours(Float studyHours) {
        this.studyHours = studyHours;
    }

    public Integer getStartTime() {
        return startTime;
    }

    public void setStartTime(Integer startTime) {
        this.startTime = startTime;
    }

    public Integer getTimeType() {
        return timeType;
    }

    public void setTimeType(Integer timeType) {
        this.timeType = timeType;
    }

    private String code;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Integer getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(Integer collegeId) {
        this.collegeId = collegeId == null ? null : collegeId;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info == null ? null : info.trim();
    }
}
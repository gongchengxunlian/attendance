package com.fzu.edu.model;

public class CourseArrange {
    private Integer id;

    private Integer flag;

    private Integer courseId;

    private Integer startTime;

    private Integer timeType;

    private String week;

    private String classIndex;

    private String staryYear;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
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

    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week == null ? null : week.trim();
    }

    public String getClassIndex() {
        return classIndex;
    }

    public void setClassIndex(String classIndex) {
        this.classIndex = classIndex == null ? null : classIndex.trim();
    }

    public String getStaryYear() {
        return staryYear;
    }

    public void setStaryYear(String staryYear) {
        this.staryYear = staryYear == null ? null : staryYear.trim();
    }
}
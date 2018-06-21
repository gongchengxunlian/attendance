package com.fzu.edu.model;

public class AttendanceInfo {
    private Integer id;

    private Integer courseArrangeId;

    private Integer currentWeek;

    private Integer date;

    private Integer flag;

    public Integer getCourseArrangeId() {
        return courseArrangeId;
    }

    public void setCourseArrangeId(Integer courseArrangeId) {
        this.courseArrangeId = courseArrangeId;
    }

    public Integer getDate() {
        return date;
    }

    public void setDate(Integer date) {
        this.date = date;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCurrentWeek() {
        return currentWeek;
    }

    public void setCurrentWeek(Integer currentWeek) {
        this.currentWeek = currentWeek;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }
}
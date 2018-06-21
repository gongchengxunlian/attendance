package com.fzu.edu.model;

public class AttendanceDetail {
    private Integer id;

    private Integer attendanceInfoId;

    private Integer studentId;

    private String position;

    private Integer flag;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAttendanceInfoId() {
        return attendanceInfoId;
    }

    public void setAttendanceInfoId(Integer attendanceInfoId) {
        this.attendanceInfoId = attendanceInfoId;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position == null ? null : position.trim();
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }
}
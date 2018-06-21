package com.fzu.edu.model;

public class AttendanceDetailFull {
    private Integer attendanceInfoId;

    private Integer currentWeek;

    private Integer studentId;

    private String position;

    private Integer attendanceDetailId;

    private Integer studyDay;

    private Integer date;

//    private Integer maxStudyDay;

//    public Integer getMaxStudyDay() {
//        return maxStudyDay;
//    }
//
//    public void setMaxStudyDay(Integer maxStudyDay) {
//        this.maxStudyDay = maxStudyDay;
//    }

    public Integer getDate() {
        return date;
    }

    public void setDate(Integer date) {
        this.date = date;
    }

    public Integer getStudyDay() {
        return studyDay;
    }

    public void setStudyDay(Integer studyDay) {
        this.studyDay = studyDay;
    }

    public Integer getAttendanceInfoId() {
        return attendanceInfoId;
    }

    public void setAttendanceInfoId(Integer attendanceInfoId) {
        this.attendanceInfoId = attendanceInfoId;
    }

    public Integer getCurrentWeek() {
        return currentWeek;
    }

    public void setCurrentWeek(Integer currentWeek) {
        this.currentWeek = currentWeek;
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

    public Integer getAttendanceDetailId() {
        return attendanceDetailId;
    }

    public void setAttendanceDetailId(Integer attendanceDetailId) {
        this.attendanceDetailId = attendanceDetailId;
    }
}
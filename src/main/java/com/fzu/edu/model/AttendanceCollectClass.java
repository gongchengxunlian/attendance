package com.fzu.edu.model;

import java.math.BigDecimal;

public class AttendanceCollectClass {
    private Integer courseArrageId;

    private Integer courseId;

    private String courseName;

    private String courseCode;

    private Integer teacherId;

    private String teacherName;

    private String teacherCode;

    private String startYear;

    private Integer term;

    private Double score;

    private Float maxScore;

    private Float minScore;

    private Double avgSocre;

    private BigDecimal studyDay;

    private Long maxStudyDay;

    private Long minStudyDay;

    private BigDecimal acgStudyDay;

    private Long studentNumber;

    public Integer getCourseArrageId() {
        return courseArrageId;
    }

    public void setCourseArrageId(Integer courseArrageId) {
        this.courseArrageId = courseArrageId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName == null ? null : courseName.trim();
    }

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode == null ? null : courseCode.trim();
    }

    public Integer getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Integer teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName == null ? null : teacherName.trim();
    }

    public String getTeacherCode() {
        return teacherCode;
    }

    public void setTeacherCode(String teacherCode) {
        this.teacherCode = teacherCode == null ? null : teacherCode.trim();
    }

    public String getStartYear() {
        return startYear;
    }

    public void setStartYear(String startYear) {
        this.startYear = startYear == null ? null : startYear.trim();
    }

    public Integer getTerm() {
        return term;
    }

    public void setTerm(Integer term) {
        this.term = term;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Float getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Float maxScore) {
        this.maxScore = maxScore;
    }

    public Float getMinScore() {
        return minScore;
    }

    public void setMinScore(Float minScore) {
        this.minScore = minScore;
    }

    public Double getAvgSocre() {
        return avgSocre;
    }

    public void setAvgSocre(Double avgSocre) {
        this.avgSocre = avgSocre;
    }

    public BigDecimal getStudyDay() {
        return studyDay;
    }

    public void setStudyDay(BigDecimal studyDay) {
        this.studyDay = studyDay;
    }

    public Long getMaxStudyDay() {
        return maxStudyDay;
    }

    public void setMaxStudyDay(Long maxStudyDay) {
        this.maxStudyDay = maxStudyDay;
    }

    public Long getMinStudyDay() {
        return minStudyDay;
    }

    public void setMinStudyDay(Long minStudyDay) {
        this.minStudyDay = minStudyDay;
    }

    public BigDecimal getAcgStudyDay() {
        return acgStudyDay;
    }

    public void setAcgStudyDay(BigDecimal acgStudyDay) {
        this.acgStudyDay = acgStudyDay;
    }

    public Long getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(Long studentNumber) {
        this.studentNumber = studentNumber;
    }
}
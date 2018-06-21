package com.fzu.edu.model;

/**
 * Created by huhu on 2018/6/13.
 */
public class SchoolStartTime {
    private Integer id;
    private Integer SchoolId;
    private Integer flag;
    private Long startTime;
    private Integer sign;

    public Integer getSign() {
        return sign;
    }

    public void setSign(Integer sign) {
        this.sign = sign;
    }

    private Integer year;

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getSchoolId() {
        return SchoolId;
    }

    public void setSchoolId(Integer schoolId) {
        SchoolId = schoolId;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }
}

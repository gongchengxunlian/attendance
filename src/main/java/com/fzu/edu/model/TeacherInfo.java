package com.fzu.edu.model;

public class TeacherInfo {
    private Integer id;

    private Integer userId;

    private String code;

//    private Integer schoolId;

    private Integer collegeId;

    private Integer flag;

    private String info;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

//    public Integer getSchoolId() {
//        return schoolId;
//    }

//    public void setSchoolId(Integer schoolId) {
//        this.schoolId = schoolId;
//    }

    public Integer getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(Integer collegeId) {
        this.collegeId = collegeId;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info == null ? null : info.trim();
    }

}
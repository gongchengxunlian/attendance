package com.fzu.edu.model;

/**
 * Created by huhu on 2018/6/4.
 */
public class CourseFullInfo extends CollegeInfo {

    private String collegeName;

    private Integer schoolId;

    private String schoolName;

    private Integer parentId;

    private String parentName;

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    @Override
    public Integer getSchoolId() {
        return schoolId;
    }

    @Override
    public void setSchoolId(Integer schoolId) {
        this.schoolId = schoolId;
    }

    @Override
    public String getSchoolName() {
        return schoolName;
    }

    @Override
    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    @Override
    public Integer getParentId() {
        return parentId;
    }

    @Override
    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    @Override
    public String getParentName() {
        return parentName;
    }

    @Override
    public void setParentName(String parentName) {
        this.parentName = parentName;
    }
}

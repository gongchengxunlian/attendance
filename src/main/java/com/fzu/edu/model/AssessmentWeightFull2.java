package com.fzu.edu.model;

/**
 * Created by huhu on 2018/6/9.
 */
public class AssessmentWeightFull2 extends AssessmentWeightTemplateFull {

    private Integer courseId;

    private String courseName;

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
        this.courseName = courseName;
    }

    public String getName(){
        return courseName;
    }
}

package com.fzu.edu.model;

public class AbsenceLevel {
    private Integer id;

    private String name;

    private Float minValue;

    private String color;

    private Integer flag;

    private Integer schoolId;

//    private Float maxValue;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Float getMinValue() {
        return minValue;
    }

    public void setMinValue(Float minValue) {
        this.minValue = minValue;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color == null ? null : color.trim();
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Integer getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(Integer schoolId) {
        this.schoolId = schoolId;
    }

//    public Float getMaxValue() {
//        return maxValue;
//    }

//    public void setMaxValue(Float maxValue) {
//        this.maxValue = maxValue;
//    }
}
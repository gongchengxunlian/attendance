package com.fzu.edu.model;

/**
 * Created by huhu on 2018/6/4.
 */
public class CollegeChildren extends CollegeBasicInfo {
    private Integer parentId;

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

}

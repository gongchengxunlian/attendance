package com.fzu.edu.model;

import java.util.ArrayList;
import java.util.List;

public class CollegeInfo {
    private String name;

    private Integer flag;

    private Integer schoolId;

    private String schoolName;

    private String info;

    private Integer id;

    private String code;

    private Integer parentId;

    private CollegeInfo parent;

    private List<CollegeInfo> children = new ArrayList<CollegeInfo>();

    public List<CollegeInfo> getChildren() {
        if (children.size() == 0) return null;
        return children;
    }

    public void setChildren(List<CollegeInfo> children) {
        for (CollegeInfo collegeInfo : children){
            addChild(collegeInfo);
        }
    }

    public void addChild(CollegeInfo collegeInfo){
        children.add(collegeInfo);
        if (collegeInfo.getParent() != null) {
            if (!collegeInfo.getParent().equals(this)) collegeInfo.setParent(this);
        }else {
            collegeInfo.setParent(this, false);
        }
    }

    public CollegeInfo getParent() {
        return parent;
    }

    public CollegeInfo getRootParent() {
        if (parent == null) return this;
        return parent.getRootParent();
    }

    public void setParent(CollegeInfo parent) {
        setParent(parent, true);
    }
    public void setParent(CollegeInfo parent, boolean set) {
        this.parent = parent;
        if (set) parent.addChild(this);
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
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
        this.schoolId = schoolId == null ? null : schoolId;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info == null ? null : info.trim();
    }
}
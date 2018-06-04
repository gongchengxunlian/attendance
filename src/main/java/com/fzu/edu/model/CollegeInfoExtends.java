package com.fzu.edu.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by huhu on 2018/6/4.
 */
public class CollegeInfoExtends extends CollegeInfo {

    private CollegeInfoExtends parent;

    private List<CollegeInfoExtends> children = new ArrayList<CollegeInfoExtends>();


    public List<CollegeInfoExtends> getChildren() {
        if (children.size() == 0) return null;
        return children;
    }

    public void setChildren(List<CollegeInfoExtends> children) {
        if (children == null) {
            this.children = null;
            return;
        }
        for (CollegeInfoExtends collegeInfo : children){
            addChild(collegeInfo);
        }
    }

    public void addChild(CollegeInfoExtends collegeInfo){
        children.add(collegeInfo);
        if (collegeInfo.getParent() != null) {
            if (!collegeInfo.getParent().equals(this)) collegeInfo.setParent(this);
        }else {
            collegeInfo.setParent(this, false);
        }
    }

    public CollegeInfoExtends getParent() {
        return parent;
    }

    public CollegeInfoExtends getRootParent(boolean includeSelf) {
        if (parent == null) {
            if (includeSelf) return this;
            return null;
        }
        return parent.getRootParent(includeSelf);
    }
    public CollegeInfo getRootParent(){
        return getRootParent(false);
    }

    public void setParent(CollegeInfoExtends parent) {
        setParent(parent, true);
    }
    public void setParent(CollegeInfoExtends parent, boolean set) {
        if (parent == null) return;
        this.parent = parent;
        if (set) parent.addChild(this);
    }
    public void clearParents(boolean isChild){
        if (parent != null && !isChild){
            parent.clearParents();
        }
        parent = null;
        if (children != null){
            for (CollegeInfoExtends c : children){
                c.clearParents(true);
            }
        }
    }
    public void clearParents(){
        clearParents(false);
    }
}

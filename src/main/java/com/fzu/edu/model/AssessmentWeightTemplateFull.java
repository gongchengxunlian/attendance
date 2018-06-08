package com.fzu.edu.model;

import java.util.List;

/**
 * Created by huhu on 2018/6/8.
 */
public class AssessmentWeightTemplateFull extends AssessmentWeightTemplate {

    private List value;

    public void setValue(List value) {
        this.value = value;
    }

    public List getValue(){
        return value;
    }

}

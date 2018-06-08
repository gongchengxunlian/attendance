package com.fzu.edu.dao;

import com.baomidou.mybatisplus.mapper.BaseMapper;
import com.fzu.edu.model.AssessmentWeightTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface AssessmentWeightTemplateMapper extends BaseMapper<AssessmentWeightTemplate> {

    List<AssessmentWeightTemplate> getAssessmentWeightTemplates(Map params);
}
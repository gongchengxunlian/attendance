package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.fzu.edu.dao.AssessmentWeightTemplateMapper;
import com.fzu.edu.model.AssessmentWeightTemplate;
import com.fzu.edu.model.AssessmentWeightTemplateFull;
import com.fzu.edu.service.StudySettingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/6/8.
 */
@Service("studySettingService")
@Transactional(rollbackFor = Exception.class)
public class StudySettingServiceImpl implements StudySettingService {

    @Resource
    private AssessmentWeightTemplateMapper assessmentWeightTemplateMapper;

    public int saveTemplateData(String params) throws Exception {
        List<Map> assessmentWeightTemplates = JSON.parseObject(params, List.class);
        int n = 0;
        for (Map m : assessmentWeightTemplates){
            if (m.get("delete") == null || m.get("delete").toString().trim().equals("")){
                AssessmentWeightTemplate assessmentWeightTemplate = JSON.parseObject(JSON.toJSONString(m), AssessmentWeightTemplate.class);
                if (assessmentWeightTemplate.getId() == null) n += insertTemplateData(assessmentWeightTemplate);
                else n += updateTemplateData(assessmentWeightTemplate);
            }else {
                AssessmentWeightTemplate assessmentWeightTemplate = JSON.parseObject(JSON.toJSONString(m), AssessmentWeightTemplate.class);
                if (assessmentWeightTemplate.getId() != null) n += updateTemplateData(assessmentWeightTemplate);
            }
        }
        return n;
    }

    private int insertTemplateData(AssessmentWeightTemplate assessmentWeightTemplate){
        return assessmentWeightTemplateMapper.insert(assessmentWeightTemplate);
    }

    private int updateTemplateData(AssessmentWeightTemplate assessmentWeightTemplate){
        return assessmentWeightTemplateMapper.updateById(assessmentWeightTemplate);
    }

    public List getTemplateData(Map params) {
        List<AssessmentWeightTemplate> assessmentWeightTemplates = assessmentWeightTemplateMapper.getAssessmentWeightTemplates(params);
        List<AssessmentWeightTemplateFull> assessmentWeightTemplateFulls = new ArrayList<AssessmentWeightTemplateFull>();
        for (AssessmentWeightTemplate assessmentWeightTemplate : assessmentWeightTemplates){
            AssessmentWeightTemplateFull assessmentWeightTemplateFull = new AssessmentWeightTemplateFull();
            assessmentWeightTemplateFull.setName(assessmentWeightTemplate.getName());
            assessmentWeightTemplateFull.setId(assessmentWeightTemplate.getId());
            List value = JSON.parseObject((String) assessmentWeightTemplate.getValue(), List.class);
            assessmentWeightTemplateFull.setValue(value);
            assessmentWeightTemplateFulls.add(assessmentWeightTemplateFull);
        }
        return assessmentWeightTemplateFulls;
    }
}

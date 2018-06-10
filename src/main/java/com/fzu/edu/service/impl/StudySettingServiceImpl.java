package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.fzu.edu.dao.AbsenceLevelMapper;
import com.fzu.edu.dao.AssessmentWeightMapper;
import com.fzu.edu.dao.AssessmentWeightTemplateMapper;
import com.fzu.edu.model.*;
import com.fzu.edu.service.StudySettingService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
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
    @Resource
    private AssessmentWeightMapper assessmentWeightMapper;
    @Resource
    private AbsenceLevelMapper absenceLevelMapper;
    private Logger log = Logger.getLogger(StudySettingServiceImpl.class);

    public int saveTemplateData(String params, boolean b) throws Exception {
        List<Map> assessmentWeightTemplates = JSON.parseObject(params, List.class);
        int n = 0;
        for (Map m : assessmentWeightTemplates){
            if (m.get("delete") == null || m.get("delete").toString().trim().equals("") || m.get("delete").equals(false)){
                AssessmentWeightTemplate assessmentWeightTemplate;
                if (b) assessmentWeightTemplate = JSON.parseObject(JSON.toJSONString(m), AssessmentWeightTemplate.class);
                else assessmentWeightTemplate = JSON.parseObject(JSON.toJSONString(m), AssessmentWeight.class);
                if (assessmentWeightTemplate.getId() == null) n += insertTemplateData(assessmentWeightTemplate, b);
                else n += updateTemplateData(assessmentWeightTemplate, b);
            }else {
                AssessmentWeightTemplate assessmentWeightTemplate;
                if (b) assessmentWeightTemplate = new AssessmentWeightTemplate();
                else assessmentWeightTemplate = new AssessmentWeight();
                assessmentWeightTemplate.setFlag(1);
                assessmentWeightTemplate.setId(Integer.parseInt(m.get("id").toString()));
                if (assessmentWeightTemplate.getId() != null) n += updateTemplateData(assessmentWeightTemplate, b);
            }
        }
        return n;
    }

    private int insertTemplateData(AssessmentWeightTemplate assessmentWeightTemplate, boolean b){
        if (b) return assessmentWeightTemplateMapper.insert(assessmentWeightTemplate);
        else return assessmentWeightMapper.insert((AssessmentWeight) assessmentWeightTemplate);
    }

    private int updateTemplateData(AssessmentWeightTemplate assessmentWeightTemplate, boolean b){
        if (b) return assessmentWeightTemplateMapper.updateById(assessmentWeightTemplate);
        else return assessmentWeightMapper.updateById((AssessmentWeight) assessmentWeightTemplate);
    }

    public List getTemplateData(Map params, boolean b) {
        params.put("flag", 0);
        List<AssessmentWeightTemplate> assessmentWeightTemplates;
        if (b) {
            assessmentWeightTemplates = assessmentWeightTemplateMapper.getAssessmentWeightTemplates(params);
        } else {
            assessmentWeightTemplates = assessmentWeightMapper.getAssessmentWeight(params);
        }
        List assessmentWeightTemplateFulls = new ArrayList();
        for (AssessmentWeightTemplate assessmentWeightTemplate : assessmentWeightTemplates){
            AssessmentWeightTemplateFull assessmentWeightTemplateFull;
            if (b){
                assessmentWeightTemplateFull = new AssessmentWeightTemplateFull();
            }else {
                assessmentWeightTemplateFull = new AssessmentWeightFull2();
            }
            assessmentWeightTemplateFull.setName(assessmentWeightTemplate.getName());
            assessmentWeightTemplateFull.setId(assessmentWeightTemplate.getId());
            if (!b) {
                ((AssessmentWeightFull2) assessmentWeightTemplateFull).setCourseId(((AssessmentWeight)assessmentWeightTemplate).getCourseId());
                ((AssessmentWeightFull2) assessmentWeightTemplateFull).setCourseName(((AssessmentWeightFull)assessmentWeightTemplate).getCourseName());
            }
            List value = JSON.parseObject((String) assessmentWeightTemplate.getValue(), List.class);
            assessmentWeightTemplateFull.setValue(value);
            assessmentWeightTemplateFulls.add(assessmentWeightTemplateFull);
        }
        return assessmentWeightTemplateFulls;
    }

    public List getAbsenceLevel(Map params) {
        List l = absenceLevelMapper.selectByMap(params);
        return l;
    }

    public int saveAbsenceLevel(String params, Integer schoolId) {
        List<Map> l = JSON.parseArray(params, Map.class);
        int n = 0;
        for (Map m : l){
            Integer id;
            AbsenceLevel absenceLevel = null;
            try {
                id = Integer.parseInt(m.get("id").toString());
                if (m.get("delete") == null || m.get("delete").toString().trim().equals("") || m.get("delete").equals(false)){
                    absenceLevel = JSON.parseObject(JSON.toJSONString(m), AbsenceLevel.class);
                    absenceLevel.setSchoolId(schoolId);
                }else {
                    absenceLevel = new AbsenceLevel();
                    absenceLevel.setFlag(1);
                    absenceLevel.setId(id);
                }
                n += absenceLevelMapper.updateById(absenceLevel);
            } catch (Exception e){
                log.info(e);
                if (m.get("delete") == null || m.get("delete").toString().trim().equals("") || m.get("delete").equals(false)){
                    absenceLevel = JSON.parseObject(JSON.toJSONString(m), AbsenceLevel.class);
                    absenceLevel.setSchoolId(schoolId);
                    n += absenceLevelMapper.insert(absenceLevel);
                }else n++;
            }
        }
        return n;
    }


}

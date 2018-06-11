package com.fzu.edu.service;

import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/6/8.
 */
public interface StudySettingService {
    int saveTemplateData(String params, boolean b) throws Exception;

    List getTemplateData(Map params, boolean b);

    List getAbsenceLevel(Map params);

    int saveAbsenceLevel(String params, Integer schoolId);

    int saveStudentAndCourse(String params);

    Object getSaveStudentAndCourse(Integer id);
}

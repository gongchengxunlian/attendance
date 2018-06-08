package com.fzu.edu.service;

import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/6/8.
 */
public interface StudySettingService {
    int saveTemplateData(String params) throws Exception;

    List getTemplateData(Map params);
}

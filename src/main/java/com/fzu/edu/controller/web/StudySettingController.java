package com.fzu.edu.controller.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fzu.edu.model.SchoolInfo;
import com.fzu.edu.service.ClassManageService;
import com.fzu.edu.service.StudySettingService;
import com.fzu.edu.utils.Page;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/4.
 */

@Controller
@RequestMapping(value = "/studySetting",produces = {"application/json;charset=UTF-8"})
public class StudySettingController {

    private Logger log = Logger.getLogger(StudySettingController.class);
    @Resource
    private StudySettingService studySettingService;

    @RequestMapping(value = "/saveTemplateData", method = RequestMethod.POST)
    @ResponseBody
    public String saveTemplateData(@RequestParam String params) {
        log.info("新增/修改考核权重模板");
        try {
            return JSON.toJSONString(studySettingService.saveTemplateData(params, true));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getTemplateData", method = RequestMethod.GET)
    @ResponseBody
    public String getTemplateData(@RequestParam Map params) {
        log.info("查询考核权重模板");
        try {
            return JSON.toJSONString(studySettingService.getTemplateData(params, true));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/saveWeightData", method = RequestMethod.POST)
    @ResponseBody
    public String saveWeightData(@RequestParam String params) {
        log.info("新增/修改考核权重");
        try {
            return JSON.toJSONString(studySettingService.saveTemplateData(params, false));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getweightData", method = RequestMethod.GET)
    @ResponseBody
    public String getweightData(@RequestParam Map params, HttpSession session) {
        log.info("查询考核权重");
        try {
            params.put("schoolId", ((SchoolInfo) session.getAttribute("schoolInfo")).getId());
            return JSON.toJSONString(studySettingService.getTemplateData(params, false));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

}

package com.fzu.edu.controller.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fzu.edu.model.SchoolInfo;
import com.fzu.edu.service.SchoolManageService;
import com.fzu.edu.utils.Page;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/4.
 */

@Controller
@RequestMapping(value = "/schoolMenage",produces = {"application/json;charset=UTF-8"})
public class SchoolManageController {

    private Logger log = Logger.getLogger(SchoolManageController.class);
    @Resource
    private SchoolManageService schoolManageService;

    @RequestMapping(value = "/addSchool", method = RequestMethod.POST)
    @ResponseBody
    public String addSchool(@RequestParam Map params) {
        log.info("新增/修改学校");
        try {
            return JSON.toJSONString(schoolManageService.addOrUpdateSchool(params));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    @ResponseBody
    public String getAll(@RequestParam Map params) {
        log.info("查询所有学校");
        try {
            List<SchoolInfo> schoolInfos = schoolManageService.getAll(params);
            Page page = new Page(params.get("pageNo"), params.get("pageSize"), schoolInfos);
            return JSON.toJSONString(page);
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/delRow", method = RequestMethod.POST)
    @ResponseBody
    public String delRow(@RequestParam Map params) {
        log.info("删除学校");
        try {
            Object o = JSON.parse(params.get("ids").toString());
            JSONArray ids = (JSONArray) o;
            int n = 0;
            for (Object id : ids){
                params = new HashMap();
                params.put("id", id);
                params.put("flag", 1);
                n += schoolManageService.addOrUpdateSchool(params);
            }
            return JSON.toJSONString(n);
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

}

package com.fzu.edu.controller.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fzu.edu.model.CourseInfo;
import com.fzu.edu.service.CourseManageService;
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
@RequestMapping(value = "/courseMenage",produces = {"application/json;charset=UTF-8"})
public class CourseManageController {

    private Logger log = Logger.getLogger(CourseManageController.class);
    @Resource
    private CourseManageService courseManageService;

    @RequestMapping(value = "/addCourse", method = RequestMethod.POST)
    @ResponseBody
    public String addCourse(@RequestParam String params) {
        log.info("新增/修改课程");
        try {
            return JSON.toJSONString(courseManageService.addOrUpdateCourse(params));
        }catch (Exception e){
            System.out.println(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    @ResponseBody
    public String getAll(@RequestParam Map params) {
        log.info("查询所有课程");
        try {
            List<HashMap> courseInfos = courseManageService.getAll(params);
            Page page = new Page(params.get("pageNo"), params.get("pageSize"), courseInfos);
            return JSON.toJSONString(page);
        }catch (Exception e){
            System.out.println(e);
            return "0";
        }
    }

    @RequestMapping(value = "/delRow", method = RequestMethod.POST)
    @ResponseBody
    public String delRow(@RequestParam Map params) {
        log.info("删除课程");
        try {
            Object o = JSON.parse(params.get("ids").toString());
            JSONArray ids = (JSONArray) o;
            int n = 0;
            for (Object id : ids){
                params = new HashMap();
                params.put("id", id);
                params.put("flag", 1);
                n += courseManageService.addOrUpdateCourse(JSON.toJSONString(params));
            }
            return JSON.toJSONString(n);
        }catch (Exception e){
            System.out.println(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getCollegeAndCourse", method = RequestMethod.GET)
    @ResponseBody
    public String getCollegeAndCourse(@RequestParam Map params) {
        log.info("获得学院和课程");
        try {
            return JSON.toJSONString(courseManageService.getCollegeAndCourse(params));
        }catch (Exception e){
            System.out.println(e);
            return "0";
        }
    }

}
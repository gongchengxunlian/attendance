package com.fzu.edu.controller.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fzu.edu.model.CollegeInfo;
import com.fzu.edu.service.CollegeManageService;
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
@RequestMapping(value = "/collegeMenage",produces = {"application/json;charset=UTF-8"})
public class CollegeManageController {

    private Logger log = Logger.getLogger(CollegeManageController.class);
    @Resource
    private CollegeManageService collegeManageService;

    @RequestMapping(value = "/addCollege", method = RequestMethod.POST)
    @ResponseBody
    public String addCollege(@RequestParam Map params) {
        log.info("新增/修改学院");
        try {
            return JSON.toJSONString(collegeManageService.addOrUpdateCollege(params));
        }catch (Exception e){
            System.out.println(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    @ResponseBody
    public String getAll(@RequestParam Map params) {
        log.info("查询所有学院");
        try {
            List<CollegeInfo> collegeInfos = collegeManageService.getAll(params);
            Page page = new Page(params.get("pageNo"), params.get("pageSize"), collegeInfos);
            return JSON.toJSONString(page);
        }catch (Exception e){
            System.out.println(e);
            return "0";
        }
    }

    @RequestMapping(value = "/delRow", method = RequestMethod.POST)
    @ResponseBody
    public String delRow(@RequestParam Map params) {
        log.info("删除学院");
        try {
            Object o = JSON.parse(params.get("ids").toString());
            JSONArray ids = (JSONArray) o;
            int n = 0;
            for (Object id : ids){
                params = new HashMap();
                params.put("id", id);
                params.put("flag", 1);
                n += collegeManageService.addOrUpdateCollege(params);
            }
            return JSON.toJSONString(n);
        }catch (Exception e){
            System.out.println(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getSchoolAndCollege", method = RequestMethod.GET)
    @ResponseBody
    public String getSchoolAndCollege(@RequestParam Map params) {
        log.info("获得学校和学院");
        try {
            return JSON.toJSONString(collegeManageService.getSchoolAndCollege(params));
        }catch (Exception e){
            System.out.println(e);
            return "0";
        }
    }

}

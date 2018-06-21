package com.fzu.edu.controller.web;

import com.alibaba.fastjson.JSON;
import com.fzu.edu.model.SchoolInfo;
import com.fzu.edu.model.UserInfo;
import com.fzu.edu.service.AttendanceManagementService;
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
 * Created by huhu on 2018/6/13.
 */

@Controller
@RequestMapping(value = "/attendanceManagement",produces = {"application/json;charset=UTF-8"})
public class AttendanceManagementController {

    private Logger log = Logger.getLogger(ClassManageController.class);
    @Resource
    private AttendanceManagementService attendanceManagementService;

    @RequestMapping(value = "/getStudents", method = RequestMethod.GET)
    @ResponseBody
    public String getStudents(@RequestParam Map params, HttpSession session) {
        log.info("查询所有该课程的学生");
        try {
            return JSON.toJSONString(attendanceManagementService.getStudents(params));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/saveData", method = RequestMethod.POST)
    @ResponseBody
    public String saveData(@RequestParam String params, HttpSession session) {
        log.info("保存");
        try {
            return JSON.toJSONString(attendanceManagementService.saveData(params));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getAttendance", method = RequestMethod.GET)
    @ResponseBody
    public String getAttendance(@RequestParam Map params, HttpSession session) {
        log.info("查询座位信息");
        try {
            return JSON.toJSONString(attendanceManagementService.getAttendance(params));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/cancelAttendance", method = RequestMethod.POST)
    @ResponseBody
    public String cancelAttendance(@RequestParam String params, HttpSession session) {
        log.info("取消");
        try {
            return JSON.toJSONString(attendanceManagementService.cancelAttendance(JSON.parseObject(params)));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getClassCollect", method = RequestMethod.GET)
    @ResponseBody
    public String getClassCollect(HttpSession session) {
        log.info("班级统计");
        try {
            HashMap params = new HashMap();
            UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
            Integer id = userInfo.getId();
            params.put("teacher_id", id);
            return JSON.toJSONString(attendanceManagementService.getClassCollect(params));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getOneCollect", method = RequestMethod.GET)
    @ResponseBody
    public String getOneCollect(@RequestParam Map params, HttpSession session) {
        log.info("学生统计");
        try {
            UserInfo userInfo = (UserInfo) session.getAttribute("userInfo");
            Integer id = userInfo.getId();
            Integer power = userInfo.getPower();
            if (power == 3) params.put("student_id", id);
            else if (power == 2) params.put("teacher_id", id);
            return JSON.toJSONString(attendanceManagementService.getOneCollect(params));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }
}

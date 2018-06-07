package com.fzu.edu.controller.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.fzu.edu.model.UserInfo;
import com.fzu.edu.service.UserManageService;
import com.fzu.edu.service.UserEduManageService;
import com.fzu.edu.service.UserLogService;
import com.fzu.edu.utils.Page;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/4.
 */

@Controller
@RequestMapping(value = "/userManage",produces = {"application/json;charset=UTF-8"})
public class UserManageController {

    private Logger log = Logger.getLogger(UserManageController.class);
    @Resource
    private UserManageService userManageService;
    @Resource
    private UserEduManageService userEduManageService;
    @Resource
    private UserLogService userLogService;

    @RequestMapping(value = "/addUserBasic", method = RequestMethod.POST)
    @ResponseBody
    public String addUser(@RequestParam Map params) {
        log.info("新增/修改用户基本信息");
        try {
            return JSON.toJSONString(userManageService.addOrUpdateUserBasic(params));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/addUserEdu", method = RequestMethod.POST)
    @ResponseBody
    public String addUserEdu(@RequestParam Map params) {
        log.info("新增/修改用户教育信息");
        try {
            return JSON.toJSONString(userEduManageService.addUserEdu(params));
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    @ResponseBody
    public String getAll(@RequestParam Map params, HttpSession session) {
        log.info("查询所有用户");
        try {
            params.put("power", ((UserInfo) session.getAttribute("userInfo")).getPower());
            List<Map> userInfos = userManageService.getAll(params);
            Page page = new Page(params.get("pageNo"), params.get("pageSize"), userInfos);
            return JSON.toJSONString(page);
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/delRow", method = RequestMethod.POST)
    @ResponseBody
    public String delRow(@RequestParam Map params) {
        log.info("删除用户");
        try {
            Object o = JSON.parse(params.get("ids").toString());
            JSONArray ids = (JSONArray) o;
            int n = 0;
            for (Object id : ids){
                params = new HashMap();
                params.put("id", id);
                params.put("flag", 1);
                userManageService.addOrUpdateUserBasic(params);
                n++;
            }
            return JSON.toJSONString(n);
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public String login(@RequestParam Map params, HttpServletRequest request) {
        log.info("登录");
        try {
            Object u_detail = userLogService.loginCheck(params);
            if (u_detail.equals(0)) return "0";

            HttpSession session = request.getSession();
            session.setAttribute("userInfo", ((HashMap)u_detail).get("userInfo"));
            session.setAttribute("schoolInfo", ((HashMap)u_detail).get("schoolInfo"));
            session.setAttribute("collegeInfo", ((HashMap)u_detail).get("collegeInfo"));

            return JSON.toJSONString(u_detail);
        }catch (Exception e){
            log.warn(e);
            return "0";
        }
    }

}

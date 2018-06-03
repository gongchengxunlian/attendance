package com.fzu.edu.service.impl;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.fzu.edu.app.Config;
import com.fzu.edu.dao.*;
import com.fzu.edu.model.*;
import com.fzu.edu.service.UserLogService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/12.
 */

@Service("userLogService")
public class UserLogServiceImpl implements UserLogService {

    @Resource
    private UserInfoMapper userInfoMapper;
    @Resource
    private CollegeManageMapper collegeManageMapper;
    @Resource
    private SchoolManageMapper schoolManageMapper;

    private Logger log = Logger.getLogger(UserLogServiceImpl.class);



    public Object loginCheck(Map params) {

        String username = params.get("username").toString();
        String password = params.get("password").toString();

        String sqlWhere = "(";

        List<UserLoginType> type = Config.getLoginTypes();
        for (UserLoginType u : type){
            if (!sqlWhere.equals("(")) sqlWhere += " OR ";
            sqlWhere += u.getType() + "='" + username + "'";
        }

        sqlWhere += ") AND (password='" + password + "' OR (password IS NULL AND '"+ password +"' = '123456')) AND flag = 0";

        Wrapper<UserInfo> userInfoWrapper = new EntityWrapper<UserInfo>();
        userInfoWrapper.addFilter(sqlWhere);
        List<UserInfo> userInfos = userInfoMapper.selectList(userInfoWrapper);
        if (userInfos.size() == 0) return 0;

        UserInfo userInfo = userInfos.get(0);
        CollegeInfo collegeInfo = null;
        SchoolInfo schoolInfo = null;

        try {
            Integer collegeId = userInfo.getCollegeId();
            CollegeInfo collegeInfos = collegeManageMapper.getCollegeParents(collegeId);
            if (collegeInfos != null) collegeInfo = collegeInfos.getRootParent();
            if (collegeInfo != null) schoolInfo = schoolManageMapper.selectById(collegeInfo.getSchoolId());
            else schoolInfo = schoolManageMapper.selectById(userInfo.getSchoolId());
        }catch (Exception e){
            log.warn(e);
        }
        if (schoolInfo != null && schoolInfo.getFlag() == 1) {
            schoolInfo = null;
            collegeInfo = null;
        }else if (schoolInfo == null){
            collegeInfo = null;
        }

        HashMap u_detail = new HashMap();
        u_detail.put("userInfo", userInfo);
        u_detail.put("schoolInfo", schoolInfo);
        u_detail.put("collegeInfo", collegeInfo);

        return u_detail;
    }
}

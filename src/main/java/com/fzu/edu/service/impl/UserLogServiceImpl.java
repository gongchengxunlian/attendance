package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.mapper.Wrapper;
import com.fzu.edu.dao.*;
import com.fzu.edu.model.*;
import com.fzu.edu.service.UserLogService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/12.
 */

@Service("userLogService")
public class UserLogServiceImpl implements UserLogService {

    @Resource
    private UserLogMapper userLogMapper;
    @Resource
    private UserBasicInfoMapper userBasicInfoMapper;
    @Resource
    private SchoolAdministratorMapper schoolAdministratorMapper;
    @Resource
    private TeacherInfoMapper teacherInfoMapper;
    @Resource
    private StudentInfoMapper studentInfoMapper;
    @Resource
    private CollegeManageMapper collegeManageMapper;
    @Resource
    private SchoolManageMapper schoolManageMapper;
    @Resource
    private SystemAdministratorMapper systemAdministratorMapper;



    public Object loginCheck(Map params) {

        String username = params.get("username").toString();
        String password = params.get("password").toString();

        Integer id, rid, role = null;
        HashMap<String, Integer> uIds = null;

        String sqlWhere = "(";

        List<UserLoginType> type = userLogMapper.selectByMap(new HashMap<String, Object>());
        for (UserLoginType u : type){
            if (!sqlWhere.equals("(")) sqlWhere += " OR ";
            sqlWhere += u.getType() + "='" + username + "'";
        }
        sqlWhere += ") AND (password='" + password + "' OR (password IS NULL AND '"+ password +"' = '123456'))";
        HashMap h = new HashMap();
        h.put("sqlWhere", sqlWhere);

        int checked =
                (uIds = systemAdministratorMapper.loginCheck(h)) == null ?
                        (uIds = schoolAdministratorMapper.loginCheck(h)) == null ?
                                (uIds = teacherInfoMapper.loginCheck(h)) == null ?
                                        (uIds = studentInfoMapper.loginCheck(h)) == null ?
                                                -1 : (role = 3) : (role = 2) : (role = 1) : (role = 0);

        if (checked == -1) return checked;
        id = uIds.get("id");
        rid = uIds.get("rid");

        UserBasicInfo userBasicInfo = userBasicInfoMapper.selectById(id);
        Object roleInfo = null;
        roleInfo =
                role == 0 ? systemAdministratorMapper.selectById(rid) :
                        role == 1 ? schoolAdministratorMapper.selectById(rid) :
                                role == 2 ? teacherInfoMapper.selectById(rid) :
                                        role == 3 ? studentInfoMapper.selectById(rid) :
                                                null;
        if (roleInfo==null) return 0;

        SchoolInfo schoolInfo = null;
        CollegeInfo collegeInfo = null;
        try {
            Integer collegeId = null, schoolId = null;
            checked =
                    (collegeId = RoleInfo.getCollegeId(roleInfo)) == null ?
                            (schoolId = RoleInfo.getSchoolId(roleInfo)) == null ?
                                    -1 : 0 : 1;

            checked =
                    (collegeInfo = collegeManageMapper.selectById(collegeId)) == null ?
                            -1 : (schoolId = RoleInfo.getSchoolId(collegeInfo));

            schoolInfo = schoolManageMapper.selectById(schoolId);
        }catch (Exception e){
            System.out.println(e);
            return 0;
        }


        HashMap u_detail = new HashMap();
        u_detail.put("userBasicInfo", userBasicInfo);
        u_detail.put("schoolInfo", schoolInfo);
        u_detail.put("collegeInfo", collegeInfo);
        u_detail.put("roleInfo", roleInfo);

        return u_detail;
    }
}

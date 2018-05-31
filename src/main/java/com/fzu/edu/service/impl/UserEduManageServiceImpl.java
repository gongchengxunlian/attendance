package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.*;
import com.fzu.edu.model.*;
import com.fzu.edu.service.UserEduManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Map;

/**
 * Created by CLY on 2018/3/22.
 */
@Service("userEduManageService")
@Transactional(rollbackFor = Exception.class)
public class UserEduManageServiceImpl extends ServiceImpl<UserBasicInfoMapper, UserBasicInfo> implements UserEduManageService {
    @Resource
    private UserBasicInfoMapper userBasicInfoMapper;
    @Resource
    private TeacherInfoMapper teacherInfoMapper;
    @Resource
    private SchoolAdministratorMapper schoolAdministratorMapper;
    @Resource
    private StudentInfoMapper studentInfoMapper;
    @Resource
    private SystemAdministratorMapper systemAdministratorMapper;

    public int addUserEdu(Map params) {

        UserBasicInfo userBasicInfo = CDataSet.MapToData(params, UserBasicInfo.class);
        int n = 0;
        boolean update = true;

        if (userBasicInfo.getId() == null) {
            n += userBasicInfoMapper.insert(userBasicInfo);
            update = false;
        } else n += userBasicInfoMapper.updateById(userBasicInfo);
        if (n > 0 && !update){
            userBasicInfo.setFlag(0);
            userBasicInfo = userBasicInfoMapper.selectOne(userBasicInfo);
        }else if (n == 0) return 0;

        if (params.get("power") == null) return 0;

        if (!update) {

//        UserBasicInfo userBasicInfo = new UserBasicInfo();
            userBasicInfo.setPower(Integer.parseInt(params.get("power").toString()));
//        userBasicInfo.setId(Integer.parseInt(params.get("userId").toString()));
        }
        params.put("userId", userBasicInfo.getId());
        params.put("info", params.get("tinfo"));
        params.put("id", params.get("tid"));

        try {
            switch (Integer.parseInt(params.get("power").toString())){
                case 0:{
                    SystemAdministrator systemAdministrator = CDataSet.MapToData(params, SystemAdministrator.class);
                    if (!update){
                        systemAdministratorMapper.insert(systemAdministrator);
                        userBasicInfoMapper.updateById(userBasicInfo);
                    }else {
                        systemAdministratorMapper.updateById(systemAdministrator);
                    }
                    break;
                }
                case 1:{
                    SchoolAdministrator schoolAdministrator = CDataSet.MapToData(params, SchoolAdministrator.class);
                    if (!update){
                        schoolAdministratorMapper.insert(schoolAdministrator);
                        userBasicInfoMapper.updateById(userBasicInfo);
                    }else {
                        schoolAdministratorMapper.updateById(schoolAdministrator);
                    }
                    break;
                }
                case 2:{
                    TeacherInfo teacherInfo = CDataSet.MapToData(params, TeacherInfo.class);
                    if (!update){
                        teacherInfoMapper.insert(teacherInfo);
                        userBasicInfoMapper.updateById(userBasicInfo);
                    }else {
                        teacherInfoMapper.updateById(teacherInfo);
                    }
                    break;
                }
                case 3:{
                    StudentInfo studentInfo = CDataSet.MapToData(params, StudentInfo.class);
                    if (!update){
                        studentInfoMapper.insert(studentInfo);
                    }else {
                        studentInfoMapper.updateById(studentInfo);
                    }
                    break;
                }
                default:{
                    return 0;
                }
            }
        }catch (Exception e){
            userBasicInfoMapper.deleteById(userBasicInfo.getId());
            return 0;
        }

        return 1;
    }
}

package com.fzu.edu.service.impl;

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
public class UserEduManageServiceImpl extends ServiceImpl<UserInfoMapper, UserInfo> implements UserEduManageService {
    @Resource
    private UserInfoMapper userInfoMapper;

    public int addUserEdu(Map params) {

        UserInfo userInfo = CDataSet.MapToData(params, UserInfo.class);
        int n = 0;
        boolean update = true;

        if (userInfo.getId() == null) {
            n += userInfoMapper.insert(userInfo);
            update = false;
        } else n += userInfoMapper.updateById(userInfo);
        if (n > 0 && !update){
            userInfo.setFlag(0);
            userInfo = userInfoMapper.selectOne(userInfo);
        }else if (n == 0) return 0;

        if (params.get("power") == null) return 0;

        if (!update) {

//        UserInfo userInfo = new UserInfo();
            userInfo.setPower(Integer.parseInt(params.get("power").toString()));
//        userInfo.setId(Integer.parseInt(params.get("userId").toString()));
        }
        params.put("userId", userInfo.getId());
        params.put("info", params.get("tinfo"));
        params.put("id", params.get("tid"));

//        try {
//            switch (Integer.parseInt(params.get("power").toString())){
//                case 0:{
//                    SystemAdministrator systemAdministrator = CDataSet.MapToData(params, SystemAdministrator.class);
//                    if (!update){
//                        systemAdministratorMapper.insert(systemAdministrator);
//                        userInfoMapper.updateById(userInfo);
//                    }else {
//                        systemAdministratorMapper.updateById(systemAdministrator);
//                    }
//                    break;
//                }
//                case 1:{
//                    SchoolAdministrator schoolAdministrator = CDataSet.MapToData(params, SchoolAdministrator.class);
//                    if (!update){
//                        schoolAdministratorMapper.insert(schoolAdministrator);
//                        userInfoMapper.updateById(userInfo);
//                    }else {
//                        schoolAdministratorMapper.updateById(schoolAdministrator);
//                    }
//                    break;
//                }
//                case 2:{
//                    TeacherInfo teacherInfo = CDataSet.MapToData(params, TeacherInfo.class);
//                    if (!update){
//                        teacherInfoMapper.insert(teacherInfo);
//                        userInfoMapper.updateById(userInfo);
//                    }else {
//                        teacherInfoMapper.updateById(teacherInfo);
//                    }
//                    break;
//                }
//                case 3:{
//                    StudentInfo studentInfo = CDataSet.MapToData(params, StudentInfo.class);
//                    if (!update){
//                        studentInfoMapper.insert(studentInfo);
//                    }else {
//                        studentInfoMapper.updateById(studentInfo);
//                    }
//                    break;
//                }
//                default:{
//                    return 0;
//                }
//            }
//        }catch (Exception e){
//            userInfoMapper.deleteById(userInfo.getId());
//            return 0;
//        }

        return 1;
    }
}

package com.fzu.edu.service.impl;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.SchoolAdministratorMapper;
import com.fzu.edu.dao.StudentInfoMapper;
import com.fzu.edu.dao.TeacherInfoMapper;
import com.fzu.edu.dao.UserBasicInfoMapper;
import com.fzu.edu.model.SchoolAdministrator;
import com.fzu.edu.model.UserBasicInfo;
import com.fzu.edu.service.UserBasicManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by CLY on 2018/3/22.
 */
@Service("userBasicManageService")
@Transactional(rollbackFor = Exception.class)
public class UserBasicManageServiceImpl extends ServiceImpl<UserBasicInfoMapper, UserBasicInfo> implements UserBasicManageService {
    @Resource
    private UserBasicInfoMapper userBasicInfoMapper;
    @Resource
    private StudentInfoMapper studentInfoMapper;
    @Resource
    private TeacherInfoMapper teacherInfoMapper;
    @Resource
    private SchoolAdministratorMapper schoolAdministratorMapper;

    public Object addOrUpdateUserBasic(Map params) {
        UserBasicInfo userBasicInfo = CDataSet.MapToData(params, UserBasicInfo.class);
        int n = 0;
        if (userBasicInfo.getId() == null) n += userBasicInfoMapper.insert(userBasicInfo);
        else n += userBasicInfoMapper.updateById(userBasicInfo);
        if (n > 0){
            if (params.get("flag") == null) {
                userBasicInfo.setFlag(0);
                userBasicInfo = userBasicInfoMapper.selectOne(userBasicInfo);
                return userBasicInfo;
            }else {
                return 1;
            }
        }else return 0;
    }

    public List getAll(Map params) {
        if (params.get("sign") == null) return null;

        Integer type = null;
        try {
            type = Integer.parseInt(params.get("type").toString());
        }catch (Exception e){}

        List<HashMap> userInfo = new ArrayList();
        switch (Integer.parseInt(params.get("sign").toString())){
            case 0:{
                List s = schoolAdministratorMapper.getAllSchoolAdministrator(params);
                if (type != null && type == 0){
                    userInfo = s;
                    break;
                }else {
                    userInfo.addAll(s);
                }
            }
            case 1:{
                List<HashMap> t = teacherInfoMapper.getAllTeacher(params);
                if (type != null && type == 1){
                    userInfo = t;
                    break;
                }else {
                    userInfo.addAll(t);
                }
            }
            case 2:{
                List<HashMap> s = studentInfoMapper.getAllStudent(params);
                if (type != null && type == 2){
                    userInfo = s;
                    break;
                }else {
                    userInfo.addAll(s);
                }
            }
            case 3:{
                if (type != null && type == 3){
//                    userInfo = t;
                    break;
                }else {
//                    userInfo.addAll(t);
                }
            }
            default:{

            }
        }
//        List userBasic = userBasicInfoMapper.getAllUserBasic(params);
        return userInfo;
    }

}

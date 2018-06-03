package com.fzu.edu.service.impl;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.UserInfoMapper;
import com.fzu.edu.model.UserInfo;
import com.fzu.edu.service.UserManageService;
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
public class UserManageServiceImpl extends ServiceImpl<UserInfoMapper, UserInfo> implements UserManageService {
    @Resource
    private UserInfoMapper userInfoMapper;

    public Object addOrUpdateUserBasic(Map params) {
        UserInfo userInfo = CDataSet.MapToData(params, UserInfo.class);
        int n = 0;
        if (userInfo.getId() == null) n += userInfoMapper.insert(userInfo);
        else n += userInfoMapper.updateById(userInfo);
        if (n > 0){
            if (params.get("flag") == null) {
                userInfo.setFlag(0);
                userInfo = userInfoMapper.selectOne(userInfo);
                return userInfo;
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
//        switch (Integer.parseInt(params.get("sign").toString())){
//            case 0:{
//                List s = schoolAdministratorMapper.getAllSchoolAdministrator(params);
//                if (type != null && type == 0){
//                    userInfo = s;
//                    break;
//                }else {
//                    userInfo.addAll(s);
//                }
//            }
//            case 1:{
//                List<HashMap> t = teacherInfoMapper.getAllTeacher(params);
//                if (type != null && type == 1){
//                    userInfo = t;
//                    break;
//                }else {
//                    userInfo.addAll(t);
//                }
//            }
//            case 2:{
//                List<HashMap> s = studentInfoMapper.getAllStudent(params);
//                if (type != null && type == 2){
//                    userInfo = s;
//                    break;
//                }else {
//                    userInfo.addAll(s);
//                }
//            }
//            case 3:{
//                if (type != null && type == 3){
////                    userInfo = t;
//                    break;
//                }else {
////                    userInfo.addAll(t);
//                }
//            }
//            default:{
//
//            }
//        }
//        List userBasic = userBasicInfoMapper.getAllUserBasic(params);
        return userInfo;
    }

}

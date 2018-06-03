package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.ClassManageMapper;
import com.fzu.edu.model.CollegeInfo;
import com.fzu.edu.model.ClassInfo;
import com.fzu.edu.service.ClassManageService;
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
@Service("classManageService")
@Transactional(rollbackFor = Exception.class)
public class ClassManageServiceImpl extends ServiceImpl<ClassManageMapper, ClassInfo> implements ClassManageService {

    @Resource
    private ClassManageMapper classManageMapper;

    public int addOrUpdateClass(String params) {
        ClassInfo classInfo = JSONObject.parseObject(params, ClassInfo.class);
        if (classInfo.getId() == null) return classManageMapper.insert(classInfo);
        else return classManageMapper.updateById(classInfo);
    }

    public List getAll(Map params) {
        List<ClassInfo> myClass = classManageMapper.getAllClass(params);
        return myClass;
    }

    public List<HashMap> getAllToTree(Map params) {
        List<ClassInfo> myClass = classManageMapper.getAllClass(params);
        List<HashMap> myClassInfo = CDataSet.MergeField(myClass, "buildName");
        return myClassInfo;
    }
}

package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.CollegeBasicManageMapper;
import com.fzu.edu.dao.CollegeChildrenManageMapper;
import com.fzu.edu.dao.CollegeManageMapper;
import com.fzu.edu.model.*;
import com.fzu.edu.service.CollegeManageService;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by CLY on 2018/3/22.
 */
@Service("collegeManageService")
@Transactional(rollbackFor = Exception.class)
public class CollegeManageServiceImpl extends ServiceImpl<CollegeManageMapper, CollegeInfo> implements CollegeManageService {

    @Resource
    private CollegeManageMapper collegeManageMapper;
    @Resource
    private CollegeBasicManageMapper collegeBasicManageMapper;
    @Resource
    private CollegeChildrenManageMapper collegeChildrenManageMapper;
    private Logger log = Logger.getLogger(CollegeManageServiceImpl.class);

    public int addOrUpdateCollege(String params) {
        CollegeInfoExtends collegeInfo = JSON.parseObject(params, CollegeInfoExtends.class);
        collegeInfo.setSchoolName(null);
        CollegeInfo m;
        if ((m = collegeInfo.getParent()) != null){
            collegeInfo.setParentId(m.getId());
        }
        CollegeBasicInfo collegeBasicInfo = collegeInfo;
        if (collegeInfo.getId() == null) {
            collegeBasicManageMapper.insert(collegeBasicInfo);
        }else{
            collegeBasicManageMapper.updateById(collegeBasicInfo);
            return 1;
        }
        if (collegeInfo.getParentId() != null){
            CollegeInfo c = new CollegeInfo();
            c.setName(collegeBasicInfo.getName());
            c.setSchoolId(collegeBasicInfo.getSchoolId());
            c.setCode(collegeBasicInfo.getCode());
            c.setInfo(collegeBasicInfo.getInfo());
            c.setFlag(0);
            CollegeChildren collegeChildren = collegeManageMapper.selectOne(c);
            CollegeChildren cc = new CollegeChildren();
            cc.setId(collegeChildren.getId());
            cc.setParentId(collegeInfo.getParentId());
            collegeManageMapper.insertCollegeChildren(cc);
        }
        return 1;
    }

    public List getAll(Map params) {
        List<CollegeInfoExtends> c = collegeManageMapper.getAllCollege(params);
        for (CollegeInfoExtends ci : c){
            ci.clearParents();
        }
        return c;
    }

    public List getSchoolAndCollege(Map params) {
        List<CollegeInfoExtends> c = getAll(params);
        List<HashMap> data = CDataSet.MergeField(c, "schoolId", "schoolName", "schoolCode");
        return data;
    }
}

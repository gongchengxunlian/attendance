package com.fzu.edu.service.impl;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.CollegeManageMapper;
import com.fzu.edu.model.CollegeInfo;
import com.fzu.edu.model.SchoolInfo;
import com.fzu.edu.service.CollegeManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
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

    public int addOrUpdateCollege(Map params) {
        CollegeInfo collegeInfo = CDataSet.MapToData(params, CollegeInfo.class);
        if (collegeInfo.getId() == null) return collegeManageMapper.insert(collegeInfo);
        else return collegeManageMapper.updateById(collegeInfo);
    }

    public List getAll(Map params) {
        return collegeManageMapper.getAllCollege(params);
    }

    public List getSchoolAndCollege(Map params) {
        SchoolInfo schoolInfo = CDataSet.MapToData(params, SchoolInfo.class);
        List dt = collegeManageMapper.getSchoolAndCollege(schoolInfo);
        List<String> fields = CDataSet.getDeclaredFieldsStrings(SchoolInfo.class);
        String[] fieldsS = fields.toArray(new String[0]);
        List data = CDataSet.MergeField(dt, fieldsS);
        return data;
    }
}

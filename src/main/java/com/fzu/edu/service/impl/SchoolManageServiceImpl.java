package com.fzu.edu.service.impl;

import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.SchoolManageMapper;
import com.fzu.edu.model.SchoolInfo;
import com.fzu.edu.service.SchoolManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * Created by CLY on 2018/3/22.
 */
@Service("schoolManageService")
@Transactional(rollbackFor = Exception.class)
public class SchoolManageServiceImpl extends ServiceImpl<SchoolManageMapper, SchoolInfo> implements SchoolManageService {
    @Resource
    private SchoolManageMapper schoolManageMapper;

    public int addOrUpdateSchool(Map params) {
        SchoolInfo schoolInfo = new SchoolInfo();
        CDataSet.MapToData(params, schoolInfo);
        if (schoolInfo.getId() == null) return schoolManageMapper.insert(schoolInfo);
        else return schoolManageMapper.updateById(schoolInfo);
    }

    public List getAll(Map params) {
        return schoolManageMapper.getAllSchool(params);
    }

}

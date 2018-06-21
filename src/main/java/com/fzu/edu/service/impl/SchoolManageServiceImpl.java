package com.fzu.edu.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.service.impl.ServiceImpl;
import com.fei.common.CDataSet;
import com.fzu.edu.dao.SchoolManageMapper;
import com.fzu.edu.dao.SchoolStartTimeMapper;
import com.fzu.edu.model.SchoolInfo;
import com.fzu.edu.model.SchoolStartTime;
import com.fzu.edu.service.SchoolManageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Calendar;
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
    @Resource
    private SchoolStartTimeMapper schoolStartTimeMapper;

    public int addOrUpdateSchool(Map params) {
        SchoolInfo schoolInfo = new SchoolInfo();
        CDataSet.MapToData(params, schoolInfo);
        if (schoolInfo.getId() == null) return schoolManageMapper.insert(schoolInfo);
        else return schoolManageMapper.updateById(schoolInfo);
    }

    public List getAll(Map params) {
        return schoolManageMapper.getAllSchool(params);
    }

    public int setSchoolStartTime(Map params) {
        Long time = Long.parseLong(params.get("startTime").toString());
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(time);
        int month = c.get(Calendar.MONTH) + 1;
        if (month > 7) params.put("sign", 1);
        else params.put("sign", 0);
        params.put("year", c.get(Calendar.YEAR));
        if (schoolStartTimeMapper.updateBySchoolId(params) == 0){
            schoolStartTimeMapper.insert(JSON.parseObject(JSON.toJSONString(params), SchoolStartTime.class));
        }
        return 1;
    }


}

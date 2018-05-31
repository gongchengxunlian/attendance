package com.fzu.edu.service.impl;

import com.fzu.edu.dao.CommonMapper;
import com.fzu.edu.model.DropBox;
import com.fzu.edu.service.CommonService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * @author huang.wei  on 2018/3/29
 */
@Service("commonService")
public class CommonServiceImpl implements CommonService {
    @Resource
    private CommonMapper commonMapper;

    public List<DropBox> selectDropBox(Map<String, Object> param) {
        return commonMapper.selectDropBox(param);
    }
}

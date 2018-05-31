package com.fzu.edu.service;

import com.fzu.edu.model.DropBox;

import java.util.List;
import java.util.Map;

/**
 * @author huang.wei  on 2018/3/29
 */
public interface CommonService {

    List<DropBox> selectDropBox(Map<String, Object> param);
}

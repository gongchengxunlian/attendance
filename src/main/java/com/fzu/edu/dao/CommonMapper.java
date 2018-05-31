package com.fzu.edu.dao;

import com.fzu.edu.model.DropBox;

import java.util.List;
import java.util.Map;

/**
 * @author huang.wei  on 2018/3/29
 */
public interface CommonMapper {

    List<DropBox> selectDropBox(Map<String, Object> param);
}

package com.fzu.edu.utils;

import java.util.Map;

/**
 * @author amy.guo on 2018/3/25
 */
public class MapUtil {

    public static int ObjectToInteger(String key, Map<String, Object> param) {
        return Integer.parseInt(param.get(key).toString());
    }
}

package com.fzu.edu.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Mr yu on 2017/4/27.
 */
public class MemoryData {
    private static Map<String, String> sessionIDMap = new HashMap<String, String>();

    public static Map<String, String> getSessionIDMap() {
        return sessionIDMap;
    }

    public static void setSessionIDMap(Map<String, String> sessionIDMap) {
        MemoryData.sessionIDMap = sessionIDMap;
    }
}

package com.fzu.edu.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/6/13.
 */
public interface AttendanceManagementService {

    List getStudents(Map params);

    int saveData(String params);

    List getAttendance(Map params);

    int cancelAttendance(Map params);

    List getClassCollect(Map params);

    Map getOneCollect(Map params);
}

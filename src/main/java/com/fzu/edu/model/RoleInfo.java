package com.fzu.edu.model;

/**
 * Created by huhu on 2018/5/18.
 */
public class RoleInfo {
    public static Integer getSchoolId(Object role) {
        return
                role.getClass().equals(SchoolAdministrator.class) ? ((SchoolAdministrator)role).getSchoolId() :
                        role.getClass().equals(CollegeInfo.class) ? ((CollegeInfo)role).getSchoolId() :
                                null;
    }

    public static Integer getCollegeId(Object role) {
        return
                role.getClass().equals(StudentInfo.class) ? ((StudentInfo)role).getCollegeId() :
                        role.getClass().equals(TeacherInfo.class) ? ((TeacherInfo)role).getCollegeId() :
                                null;
    }
}

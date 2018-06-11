package com.fzu.edu.app;

import com.fzu.edu.dao.UserLogMapper;
import com.fzu.edu.model.UserLoginType;
import org.apache.log4j.Logger;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.HashMap;
import java.util.List;

/**
 * Created by huhu on 2018/6/3.
 */
public class Config {
    /**
     * 登录类型
     */
    private static List<UserLoginType> loginTypes;
    private static HashMap<String, UserLoginType> loginTypeHashMap = new HashMap<String, UserLoginType>();
    private static UserLogMapper logMapper;
    private static Logger log = Logger.getLogger(Config.class);

    private static String classPath;
    private static HashMap attribute;

    static {
       init();
    }

    private Config(){  }

    private static void init(){

        try {
            attribute = new HashMap();
            classPath = Config.class.getClassLoader().getResource("/").getPath();
            File file = new File(classPath + "/basic.config");
            if (!file.exists()) file.createNewFile();
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String str;
            int row = 0;
            while ((str = reader.readLine()) != null){
                row++;
                try {
                    str = str.trim();
                    if (str.equals("")) continue;
                    int index = str.indexOf("#");
                    if (index == 0) continue;
                    index = str.indexOf("=");
                    String name = str.substring(0, index).trim();
                    String value = str.substring(index + 1).trim();
                    attribute.put(name, value);
                }catch (Exception e){
                    log.error("Expression error in row: " + row);
                }
            }
            reader.close();

        }catch (Exception e){
            log.error(e);
        }

        WebApplicationContext context = ContextLoader.getCurrentWebApplicationContext();
        logMapper = (UserLogMapper) context.getBean("userLogMapper");
        try {
            loginTypes = logMapper.selectByMap(new HashMap<String, Object>());
            for (UserLoginType loginType : loginTypes){
                loginTypeHashMap.put(loginType.getType(), loginType);
            }
        }catch (Exception e){
            log.error(e);
        }
    }

    public static List<UserLoginType> getLoginTypes() {
        if (loginTypes == null) init();
        return loginTypes;
    }

    public static boolean loginTypeExist(String name){
        if (loginTypeHashMap.get(name) != null) return true;
        else return false;
    }

    public static String getClassPath() {
        return classPath;
    }

    public static HashMap getAttribute() {
        return attribute;
    }
}

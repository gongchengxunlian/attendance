package com.fzu.edu.app;

import com.fzu.edu.dao.UserLogMapper;
import com.fzu.edu.model.UserLoginType;
import org.apache.log4j.Logger;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;
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

    static {
       init();
    }

    private Config(){  }

    private static void init(){
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
}

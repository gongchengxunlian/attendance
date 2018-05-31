package com.fei.structure;

import com.fei.data.DataSet;
import com.fei.structure.structuredata.StructureData;

import java.lang.reflect.Field;
import java.util.*;

/**
 * Created by huhu on 2018/5/4.
 */
public class StructureSet {

    /**
     * 将map中的数据，赋值到对象中
     * @param m
     * @param cls
     * @return  返回反射生成的对象
     */
    public static <T> T MapToData(Map m, Class<T> cls){
        T t = null;
        try {
            t = cls.newInstance();
            MapToData(m, t);
        }catch (InstantiationException ie){
            System.out.println(ie);
        }catch (IllegalAccessException iae){
            System.out.println(iae);
        }
        return t;
    }

    /**
     * 将map中的数据，赋值到对象中
     * @param m
     * @param o
     */
    public static void MapToData(Map m, Object o){
        //  循环map
        for (Object _o : m.entrySet()){

            Map.Entry entry = (Map.Entry) _o;
            String key = entry.getKey().toString();
            Object value = entry.getValue();

            try {
                //  获得字段
                Field f = getField(o.getClass(), key);
                if (f == null) continue;
                //  设置可以操作私有变量
                f.setAccessible(true);

                value = DataSet.getRealValue(value, f.getType());
                //  设置值
                f.set(o, value);
                //  关闭操作私有变量
                f.setAccessible(false);
            }catch (Exception e){
                System.out.println(e);
            }
        }
    }

    //  获得字段
    private static Field getField(Class c, String key) {
        try {
            if (c.equals(Object.class)) return null;
            return c.getDeclaredField(key);
        }catch (NoSuchFieldException ne){
            return getField(c.getSuperclass(), key);
        }
    }

    public static List getDeclaredFieldsStrings(Class cls){
        Field[] fields = cls.getDeclaredFields();
        List l = new ArrayList();
        for (Field f : fields){
            l.add(f.getName());
        }
        return l;
    }

    public static void main(String[] args){
        Map m = new HashMap();
        m.put("isused", "false");
        m.put("ismanager", "1");
        m.put("birthday", Calendar.getInstance().getTimeInMillis());
        m.put("id", 8.0);
        m.put("modify", new Date());
        m.put("height", 9.1);
        m.put("not", "?");
        m.put("register", Calendar.getInstance());
        m.put("name", "Mike");
        m.put("sign", "55");

        StructureData data2 = StructureSet.MapToData(m, StructureData.class);
        System.out.println(data2);

        m.put("data", data2);
        StructureData data1 = new StructureData();
        StructureSet.MapToData(m, data1);
        System.out.println(data1);

        List fields = getDeclaredFieldsStrings(StructureData.class);
        System.out.println(fields);

    }

}

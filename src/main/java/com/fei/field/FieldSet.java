package com.fei.field;

import com.fei.structure.StructureSet;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/3.
 */
public class FieldSet {

    public static <T> List MergeField(List<T> data, String... fieldNames){
        if (data == null || data.size() == 0) return data;
        T test = data.get(0);
        if (test instanceof Map){
            return MergeField2((List<? extends Map>) data, fieldNames);
        }else {
            return MergeField3(data, test.getClass(), fieldNames);
        }
    }

    //    字段合并
    private static List MergeField2(List<? extends Map> data, String... fieldNames){
        Map mergeList = new HashMap();
        for (Object o : data){
            Map m = (Map) o;
            Map merge = new HashMap();
            for (String fieldName : fieldNames){
                if (m.get(fieldName) != null){
                    merge.put(fieldName, m.get(fieldName));
                    m.remove(fieldName);
                }
            }
            if (mergeList.get(merge) == null){
                mergeList.put(merge, new ArrayList());
            }
            if (m.size() > 0) {
                ((ArrayList) mergeList.get(merge)).add(m);
            };
        }

        return getMargeData(mergeList);
    }

    private static <T> List MergeField3(List<T> data, Class c, String... fieldNames){

        Field[] fields = StructureSet.getDeclaredFields(c).toArray(new Field[0]);
        HashMap<String, Field> fieldHashMap = new HashMap<String, Field>();
        for (Field field : fields){
            fieldHashMap.put(field.getName(), field);
        }

        Map mergeList = new HashMap();
        for (T o : data){
            Map merge = new HashMap();
            for (String fieldName : fieldNames){
                Field field = fieldHashMap.get(fieldName);
                if (field != null){
                    field.setAccessible(true);
                    try {
                        Object oo = field.get(o);
                        if (oo != null) merge.put(fieldName, oo);
                    }catch (IllegalAccessException iae){
                        iae.printStackTrace();
                    }
                    field.setAccessible(false);
                }
            }
            if (mergeList.get(merge) == null){
                mergeList.put(merge, new ArrayList());
            }
            ((ArrayList) mergeList.get(merge)).add(o);
        }

        return getMargeData(mergeList);

    }

    private static List getMargeData(Map mergeList){
        List dataList = new ArrayList();
        for (Object o : mergeList.entrySet()){
            Map.Entry entry = (Map.Entry) o;
            HashMap h = (HashMap) entry.getKey();
            List l = (List) entry.getValue();
            if (l.size() > 0) h.put("data", l);
            dataList.add(h);
        }
        return dataList;
    }
}

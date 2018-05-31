package com.fei.field;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/3.
 */
public class FieldSet {

    //    字段合并
    public static List MergeField(List data, String... fieldNames){
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

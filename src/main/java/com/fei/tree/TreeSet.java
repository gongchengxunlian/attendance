package com.fei.tree;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/3.
 */
public class TreeSet {

    //
    /*public static List CreateTree(List data, Object fatherName, Object childrenName){
        return CreateTree(data, fatherName, childrenName, null);
    }*/

    /**
     * 生成树
     * @param data  数据源
     * @param fatherName    父节点名
     * @param childrenName  子节点名
     * @param rootObject    根节点值
     * @return  树形数据
     */
    public static List CreateTree(List data, Object fatherName, Object childrenName, Object rootObject){
        List father = new ArrayList();
        List children = new ArrayList();
        for (Object o : data){
            try {
                Map m = (Map) o;
                if ((m.get(fatherName) == null && rootObject == null) || (m.get(fatherName).equals(rootObject))){
                    father.add(m);
                }else {
                    children.add(m);
                }
            }catch (Exception e){
                System.out.println(e);
            }
        }
        createChildren(father, children, fatherName, childrenName);
        return father;
    }
    private static void createChildren(List __f, List __c, Object fatherName, Object childrenName){
        if (__f.size() == 0 || __c.size() == 0) return;
        List father = new ArrayList();
        List children = new ArrayList();
        for (Object o : __f){
            Map f = (Map) o;
            List c_list = new ArrayList();
            for (Object o_c: __c){
                Map c = (Map) o_c;
                if (father.contains(c)) continue;
                try {
                    if (f.get(childrenName).equals(c.get(fatherName))){
                        c_list.add(c);
                        father.add(c);
                    }
                }catch (Exception e){
                    System.out.println(e);
                }
            }
            if (c_list.size() > 0) f.put("children", c_list);
        }
        for (Object c : __c){
            if (father.contains(c)) continue;
            else children.add(c);
        }
        createChildren(father, children, fatherName, childrenName);
    }

}

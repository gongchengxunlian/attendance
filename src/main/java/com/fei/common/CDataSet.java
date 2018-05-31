package com.fei.common;

import com.fei.field.FieldSet;
import com.fei.structure.StructureSet;
import com.fei.tree.TreeSet;

import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/8.
 */
public class CDataSet {

    /**
     * 生成树
     * @param data  数据源
     * @param fatherName    父节点名
     * @param childrenName  子节点名
     * @return  树形数据
     */
    public static List CreateTree(List data, Object fatherName, Object childrenName){
        return CreateTree(data, fatherName, childrenName, null);
    }
    /**
     * 生成树
     * @param data  数据源
     * @param fatherName    父节点名
     * @param childrenName  子节点名
     * @param rootObject    根节点值
     * @return  树形数据
     */
    public static List CreateTree(List data, Object fatherName, Object childrenName, Object rootObject){
        return TreeSet.CreateTree(data, fatherName, childrenName, rootObject);
    }

    /**
     * 将map中的数据，赋值到对象中
     * @param m
     * @param cls
     * @return  返回反射生成的对象
     */
    public static <T> T MapToData(Map m, Class<T> cls){
        return StructureSet.MapToData(m, cls);
    }
    /**
     * 将map中的数据，赋值到对象中
     * @param m
     * @param o
     */
    public static void MapToData(Map m, Object o){
        StructureSet.MapToData(m, o);
    }

    /**
     * 合并字段，不同的字段整理在一个数据集里面
     * @param data  数据源
     * @param fieldNames    需要整理的字段名
     * @return  最后结果
     */
    public static List MergeField(List data, String... fieldNames){
        return FieldSet.MergeField(data, fieldNames);
    }

    /**
     * 获得声明名称
     * @param cls
     * @return
     */
    public static List getDeclaredFieldsStrings(Class cls){
        return StructureSet.getDeclaredFieldsStrings(cls);
    }


//    /**
//     * 转中文字符串
//     * @param num
//     * @return
//     */
//    public static String numberToString(Double num){
//        return numberToString(num, false);
//    }
//    public static String numberToString(Double num, boolean upper){
//        return com.fei.data.CDataSet.numberToString(num, upper);
//    }
    public static String numberToString(String numStr){
        return numberToString(numStr, false);
    }
    public static String numberToString(String numStr, boolean upper){
        return com.fei.data.DataSet.numberToString(numStr, upper);
    }
}

package com.fei.common;

import com.fei.excel.ExcelSet;
import com.fei.file.FileSet;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by huhu on 2018/5/8.
 */
public class CFileSet {

    /**
     * 检测文件是否存在，并根据情况判断是否创建
     * @param file
     * @return
     */
    public static boolean fileIsExit(String file){
        return FileSet.fileIsExit(file);
    }
    public static boolean fileIsExit(File file){
        return FileSet.fileIsExit(file);
    }

    /**
     *
     * @param file
     * @param createIfNotFound  不存在时是否创建
     * @return
     */
    public static boolean fileIsExit(String file, boolean createIfNotFound){
        return FileSet.fileIsExit(file, createIfNotFound);
    }
    public static boolean fileIsExit(File file, boolean createIfNotFound){
        return FileSet.fileIsExit(file, createIfNotFound);
    }

    /**
     * 从请求中获得文件并保存
     * @param request
     * @param options   path -> String(保存的路径),
     *                  coverSameName -> boolean(是否可以存在同样的文件名),
     *                  fileNames -> Map<oldName, newName>(coverSameName为true时有效, 将旧文件名命名为新文件名)
     *                  fileType -> String(重命名文件类型, fileNames中newName存在时无效),
     * @return  List<Map> 新文件名，旧文件名
     */
    public static List<HashMap<String, String>> saveFilesFromHttpServletRequest(HttpServletRequest request, Map options){
        return FileSet.saveFilesFromHttpServletRequest(request, options);
    }

    /**
     * @param data  要输出的数据
     * @param options  配置参数beginRow,beginCol, title, filepath(文件保存路径，必选), XSSFCellStyleHeader, XSSFCellStyleBody
     * @param field 输出的字段<'sign', data中的类型><'title', 字段名><'type', Class>
     * @return  输出文件名
     *
     */
    public static int writeExcelData(List data, Map<String, Object> options, List<Map<String, Object>> field){
        return ExcelSet.writeData(data, options, field);
    }

    /**
     * 读excel中的文档
     * @param file  文件
     * @param fields    字段配置参数<'sign', 返回值中的key><'title', 标题字段名><'type', 对应转换的Class>
     * @return  读出来的数据
     */
    public static List<Map> readExcelData(String file, List fields){
        return readExcelData(new File(file), fields);
    }
    public static List<Map> readExcelData(File file, List fields){
        return ExcelSet.readData(file, fields);
    }
    public static List<Map> readExcelData(InputStream inputStream, List fields){
        return ExcelSet.readData(inputStream, fields);
    }
    /**
     * 设置字段
     * @param fields
     * @param sign
     * @param title
     */
    public static void setExcelField(List fields, String sign, String title){
        ExcelSet.setField(fields, sign, title);
    }
    public static void setExcelField(List fields, String sign, String title, Class type){
        ExcelSet.setField(fields, sign, title, type);
    }
}

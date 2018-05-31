package com.fei.file;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * Created by huhu on 2018/5/3.
 */
public class FileSet {

    /**
     * 检测文件是否存在，并根据情况判断是否创建
     * @param file
     * @return
     */
    public static boolean fileIsExit(String file){
        return fileIsExit(new File(file), false);
    }
    public static boolean fileIsExit(File file){
        return fileIsExit(file, false);
    }
    /**
     *
     * @param file
     * @param createIfNotFound  不存在时是否创建
     * @return
     */
    public static boolean fileIsExit(String file, boolean createIfNotFound) {
        return fileIsExit(new File(file), createIfNotFound);
    }
    public static boolean fileIsExit(File file, boolean createIfNotFound){
        //  文件不存在
        if (!file.exists()){
            //  创建文件
            if (createIfNotFound){
                try {
                    //  获得路径
                    String filename = file.getAbsolutePath();
                    int index = filename.lastIndexOf(".");
                    //  是文件
                    if (index > -1){
                        //  判断所在文件夹是否存在，不存在则建立
                        index = filename.lastIndexOf("/");
                        if (index == -1) index = filename.lastIndexOf("\\");
                        if (index > -1){
                            String p = filename.substring(0, index);
                            if (!fileIsExit(p, true)) return false;
                        }
                        //  创建文件
                        file.createNewFile();
                        return true;
                    }
                    //  是文件夹
                    else {
                        file.mkdirs();
                    }
                    return true;
                }catch (IOException ioe){
                    System.out.println(ioe);
                    return false;
                }
            }else {
                return false;
            }
        }else {
            return true;
        }
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
        //  获得路径
        Object __path = options.get("path");
        if (__path == null) return null;
        String path = __path.toString();

        MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest)request;
        //  获得文件
        Map<String, MultipartFile> files = multiRequest.getFileMap();
        //  保存的文件名称
        ArrayList<HashMap<String, String>> filenames = new ArrayList<HashMap<String, String>>();
        //  开始保存文件
        if (files != null && files.size() > 0){
            System.out.println("开始转存请求中的文件");
            for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
                //  保存文件名
                HashMap filename = new HashMap();
                //  获得文件
                MultipartFile file = entry.getValue();
                //  获得原始文件名
                String fileName_old = file.getOriginalFilename();

                //  新的文件名
                Object __fileNames = options.get("fileNames");
                Map fileNames = new HashMap();
                if (__fileNames != null){
                    fileNames = (Map) __fileNames;
                }
                Object __fileName = fileNames.get(fileName_old);
                String fileName;
                String fileType;

                if (__fileName == null){
                    __fileName = fileNames.get("all");
                    if (__fileName == null){
                        //  获得文件类型
                        Object __fileType = options.get("fileType");
                        if (__fileType != null) {
                            fileType = __fileType.toString();
                        }else {
                            fileType = getFileType(fileName_old);
                        }
                        if (fileType != null) fileName = new Date().getTime() + "." + fileType;
                        else fileName = new Date().getTime() + "";
                    }else {
                        fileName = __fileName.toString();
                    }
                }else {
                    fileName = __fileName.toString();
                }


                //  等待存储的文件路径
                //  获得是否允许重名
                Object __coverSameName = options.get("coverSameName");
                boolean coverSameName = false;
                if (__coverSameName != null) coverSameName = Boolean.parseBoolean(__coverSameName.toString());
                //  获得文件是否存在
                boolean fileIsExit;
                int index = 0;
                File new_file;
                do {
                    new_file = new File(path + "/" + fileName);
                    fileIsExit = FileSet.fileIsExit(new_file);
                    if (fileIsExit){
                        //  允许重名则重命名
                        if (coverSameName && __fileName != null){
                            String name = getFileName(fileName);
                            String type = getFileType(fileName);
                            fileName = name + "("+ ++index +")" + "." + type;
                        }
                    }else {
                        FileSet.fileIsExit(new_file, true);
                    }
                }while (fileIsExit && coverSameName && __fileName != null);

                //  转存文件
                try {
                    file.transferTo(new_file);
                }catch (IOException ioe){
                    System.out.println(ioe);
                    continue;
                }

                //  返回文件名
                filename.put("old", fileName_old);
                filename.put("new", fileName);
                filenames.add(filename);

            }
            System.out.println("结束转存请求中的文件");
            return filenames;
        }else {
            return null;
        }
    }

    /**
     * 获得文件类型
     * @param fileName
     * @return  返回类型字符串
     */
    private static String getFileType(String fileName){
        int index = fileName.lastIndexOf(".");
        if (index > -1) return fileName.substring(index + 1);
        else return null;
    }

    /**
     * 获得文件名
     * @param fileName
     * @return  文件名字符串
     */
    private static String getFileName(String fileName){
        int index = fileName.lastIndexOf(".");
        if (index > -1) return fileName.substring(0, index);
        else return fileName;
    }


}

package com.fei.excel;

import com.fei.data.DataSet;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.*;

import java.awt.Color;
import java.io.*;
import java.util.*;
import java.util.List;

/**
 * Created by huhu on 2018/5/7.
 */
public class ExcelSet {


    /**
     * @param data  要输出的数据
     * @param options  配置参数beginRow,beginCol, title, filepath(文件保存路径，必选), XSSFCellStyleHeader, XSSFCellStyleBody
     * @param field 输出的字段<'sign', data中的类型><'title', 字段名><'type', Class>
     * @return  输出文件名
     *
     */
    public static int writeData(List data, Map<String, Object> options, List<Map<String, Object>> field){
        if (data == null || data.size() == 0 || options == null || options.get("filepath") == null || field == null || field.size() == 0) return 0;

        //  获得开始行，开始列
        int beginRow = 0;
        try {
            beginRow = Integer.parseInt(options.get("beginRow").toString());
        }catch (Exception e){}
        int beginCol = 0;
        try {
            beginCol = Integer.parseInt(options.get("beginCol").toString());
        }catch (Exception e){}

        //  创建工作簿
        XSSFWorkbook workbook = new XSSFWorkbook();
        //  创建表格
        String title = "导出的表格 " + getDateString() + " " + getTimeString();
        try {
            title = options.get("title").toString() + " " + getDateString() + " " + getTimeString();
        }catch (Exception e){
            System.out.println(e);
        }
        Sheet sheet = workbook.createSheet(title);

        //  表头样式
        XSSFCellStyle headerStyle;
        if (options.get("XSSFCellStyleHeader") != null){
            headerStyle = (XSSFCellStyle) options.get("XSSFCellStyleHeader");
        }else {
            headerStyle = getXSSFCellStyle_Header(workbook);
        }

        //  创建表头
        Row rowHeader = sheet.createRow(beginRow);

        int cellIndexHeader = beginCol;
        for (Map<String, Object> f : field){
            try {
                Cell cell = rowHeader.createCell(cellIndexHeader);
                cell.setCellStyle(headerStyle);
                cell.setCellValue(f.get("title").toString());
                sheet.autoSizeColumn((short) cellIndexHeader);
                cellIndexHeader++;
            }catch (Exception e){
                System.out.println(e);
            }
        }

        //  表体样式
        XSSFCellStyle bodyStyle;
        if (options.get("XSSFCellStyleBody") != null){
            bodyStyle = (XSSFCellStyle) options.get("XSSFCellStyleBody");
        }else {
            bodyStyle = getXSSFCellStyle_Body(workbook);
        }

        //  创建表体数据
        int n = 0;
        for (int rowIndex = 0; rowIndex < data.size(); rowIndex++){

            Map rowData = (Map) data.get(rowIndex);
            Row row = sheet.createRow(rowIndex + beginRow + 1);

            int cellIndex = beginCol;
            for (Map<String, Object> f : field){

                Cell cell = row.createCell(cellIndex);
                cell.setCellStyle(bodyStyle);

                //  设置值
                setCellValue(cell, f, rowData, workbook);

                cellIndex++;
            }

            n++;

        }

        //  自动列宽
        autoSizeColumn(sheet, beginCol, field.size());

        //  写文件
        String filepath = options.get("filepath").toString();
        if (writeFile(filepath, workbook)) return n;
        else return 0;
    }

    /**
     * 自动列宽
     * @param sheet
     * @param beginCol  开始列
     * @param length    一共多少列
     */
    private static void autoSizeColumn(Sheet sheet, int beginCol, int length){
        for (int i = beginCol; i < length + beginCol + 1; i++){
            sheet.autoSizeColumn((short) i);
            int cellWidth = sheet.getColumnWidth(i);
            if (cellWidth > 50 * 256){
                sheet.setColumnWidth((short) i, 50 * 256);
            }
        }
    }


    /**
     * 设置值
     * @param cell  单元
     * @param f 字段
     * @param rowData   数据
     * @param workbook
     */
    private static int setCellValue(Cell cell, Map<String, Object> f, Map rowData, XSSFWorkbook workbook){

        String key = f.get("sign").toString();
        Class cls = (Class) f.get("type");
        int n = 0;

        CellStyle cellStyle = cell.getCellStyle();
        DataFormat dataFormat = workbook.createDataFormat();

        //  根据不同类型填值
        try {
            if (cls == null){
                cell.setCellValue(rowData.get(key).toString());
            }else if (cls.equals(Double.class)){
                cell.setCellValue(Double.parseDouble(rowData.get(key).toString()));
            }else if (cls.equals(Date.class) || cls.equals(Calendar.class)){
                cellStyle.setDataFormat(dataFormat.getFormat("yyyy-MM-dd hh:mm:ss"));

                try {
                    String value = rowData.get(key).toString();
                    Long v = Long.parseLong(value);
                    Calendar c = Calendar.getInstance();
                    c.setTimeInMillis(v);
                    cell.setCellValue(c);
                }catch(Exception e){
                    if (cls.equals(Date.class)) cell.setCellValue((Date) rowData.get(key));
                    else cell.setCellValue((Calendar) rowData.get(key));
                }
            }else if (cls.equals(Boolean.class)){
                cell.setCellValue(Boolean.parseBoolean(rowData.get(key).toString()));
            }else if (cls.equals(Integer.class)){
                cell.setCellValue(Integer.parseInt(rowData.get(key).toString()));
            }else if (cls.equals(Float.class)){
                cell.setCellValue(Float.parseFloat(rowData.get(key).toString()));
            }else {
                cell.setCellValue(rowData.get(key).toString());
            }
            n++;
        }catch (Exception e){
            System.out.println(e);
        }
        return n;
    }

    //  写文件
    private static boolean writeFile(String filepath, XSSFWorkbook workbook){
        File file = new File(filepath);
        try {
            FileOutputStream os = new FileOutputStream(file);
            workbook.write(os);
            os.flush();
            os.close();
            return true;
        }catch (FileNotFoundException fne){
            System.out.println(fne);
        }catch (IOException ioe){
            System.out.println(ioe);
        }
        return false;
    }

    private static XSSFCellStyle getXSSFCellStyle_Body(XSSFWorkbook workbook){
        XSSFCellStyle style = getXSSFCellStyle(workbook);
        //  设置前景色
        style.setFillForegroundColor(new XSSFColor(new Color(210,210,210)));
        // 设置单元格字体样式
        XSSFFont font = style.getFont();
        font.setFontHeight((short) 250);
        font.setBoldweight(XSSFFont.BOLDWEIGHT_NORMAL);

        return style;
    }

    /**
     *
     * @param workbook
     * @return  表头样式
     */
    private static XSSFCellStyle getXSSFCellStyle_Header(XSSFWorkbook workbook){
        XSSFCellStyle style = getXSSFCellStyle(workbook);
        //  设置前景色
        style.setFillForegroundColor(new XSSFColor(new Color(180,180,180)));
        //  设置边框
        style.setBorderBottom(BorderStyle.DOUBLE);
        // 设置单元格字体样式
        XSSFFont font = style.getFont();
        font.setFontHeight((short) 300);
        font.setBoldweight(XSSFFont.BOLDWEIGHT_BOLD);
        return style;
    }

    /**
     *
     * @param workbook
     * @return  设置表格样式
     */
    private static XSSFCellStyle getXSSFCellStyle(XSSFWorkbook workbook){
        XSSFCellStyle style = workbook.createCellStyle();
        //  设施单元填充底纹
        style.setFillPattern(FillPatternType.NO_FILL);
        // 设置单元格居中对齐
        style.setAlignment(XSSFCellStyle.ALIGN_CENTER);
        // 设置单元格垂直居中对齐
        style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);
        // 创建单元格内容显示不下时自动换行
        style.setWrapText(true);
        // 设置单元格字体样式
        XSSFFont font = workbook.createFont();
        font.setFontName("宋体");
        style.setFont(font);
        //  设置边框
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);

        return style;
    }



    public static List<Map> readData(InputStream inputStream, List fields){
        XSSFWorkbook workBook;
        try {
            workBook = new XSSFWorkbook(inputStream);
        }catch (FileNotFoundException fnfe){
            System.out.println(fnfe);
            return null;
        }catch (IOException ioe){
            System.out.println(ioe);
            return null;
        }
        return readData(workBook, fields);
    }
    /**
     * 读excel中的文档
     * @param file  文件
     * @param fields    字段配置参数<'sign', 返回值中的key><'title', 标题字段名><'type', 对应转换的Class>
     * @return  读出来的数据
     */
    /*public static List<Map> readData(String file, List fields){
        return readData(new File(file), fields);
    }*/
    public static List<Map> readData(File file, List fields){
        XSSFWorkbook workBook;
        try {
            workBook = new XSSFWorkbook(new FileInputStream(file));
        }catch (FileNotFoundException fnfe){
            System.out.println(fnfe);
            return null;
        }catch (IOException ioe){
            System.out.println(ioe);
            return null;
        }
        return readData(workBook, fields);
    }
    private static List<Map> readData(XSSFWorkbook workBook, List fields){
        //  取得的数据
        List<Map> data = new ArrayList<Map>();

        int sheetNum = workBook.getNumberOfSheets();
        //  遍历每个文档
        for (int i = 0; i < sheetNum; i++){
            XSSFSheet sheet = workBook.getSheetAt(i);

            //  行开始
            int rowBegin  = sheet.getFirstRowNum();
            int rowEnd = sheet.getLastRowNum();
            int colBegin = 0, colEnd = 0;
            boolean isColBegin = false;

            for (int j = rowBegin; j <= rowEnd; j++){
                //  获得行
                Row row = sheet.getRow(j);
                if (row == null) continue;

                //  如果是第一行
                if (j == rowBegin){
                    colBegin = row.getFirstCellNum();
                    colEnd = row.getLastCellNum();

                    List fieldTemps = new ArrayList();
                    //  拿表头
                    for (int k = colBegin; k <= colEnd; k++) {
                        //  获得列
                        Cell cell = row.getCell(k);
                        if (cell == null) continue;

                        //  获得值
                        String value = cell.getStringCellValue();

                        for (Object o : fields){
                            Map field = (Map) o;
                            if (field.get("title").equals(value)){
                                if (!isColBegin) {
                                    isColBegin = true;
                                    colBegin = k;
                                }
                                fieldTemps.add(field);
                                break;
                            }
                        }
                    }

                    if (fieldTemps.size() == 0){
                        rowBegin++;
                    }else {
                        fields = fieldTemps;
                    }
                    continue;
                }

                HashMap h = new HashMap();

                //  拿数据
                for (int k = colBegin; k <= colEnd; k++) {
                    //  获得列
                    Cell cell = row.getCell(k);
                    if (cell == null) continue;

                    int realIndex = k - colBegin;
                    Map field = (Map) fields.get(realIndex);

                    //  获得真实值
                    Object value;
                    if (field.get("type") != null) {
                        value = getCellValue(cell, (Class) field.get("type"));
                    } else {
                        value = getCellValue(cell, null);
                    }

                    h.put(field.get("sign"), value);

                }

                data.add(h);
            }

        }

        return data;
    }

    //  获得值
    private static Object getCellValue(Cell cell, Class cls){
        Object value;
        switch (cell.getCellType()){
            case Cell.CELL_TYPE_NUMERIC:{
                value = cell.getNumericCellValue();
                break;
            }
            case Cell.CELL_TYPE_STRING:{
                value = cell.getStringCellValue();
                break;
            }
            case Cell.CELL_TYPE_BLANK:{
                value = null;
                break;
            }
            case Cell.CELL_TYPE_BOOLEAN:{
                value = cell.getBooleanCellValue();
                break;
            }
            default:{
                value = null;
                break;
            }
        }

        try {
            value = DataSet.getRealValue(value, cls);
        }catch (Exception e){
            System.out.println(e);
        }
        return value;
    }


    /**
     * 设置字段
     * @param fields
     * @param sign
     * @param title
     */
    public static void setField(List fields, String sign, String title){
        setField(fields, sign, title, null);
    }
    public static void setField(List fields, String sign, String title, Class type){
        Map<String, Object> field = new HashMap<String, Object>();
        field.put("sign", sign);
        field.put("title", title);
        field.put("type", type);
        fields.add(field);
    }




    //  时间字符串
    private static String getDateString(Calendar c){
        int
                Y = c.get(Calendar.YEAR),
                M = c.get(Calendar.MONTH),
                D = c.get(Calendar.DAY_OF_MONTH) + 1
                ;
        return
                "" + Y + "-" +
                ( M < 10 ? "0" + M : M) + "-" +
                ( D < 10 ? "0" + D : D)
                ;
    }
    private static String getDateString(){
        return getDateString(Calendar.getInstance());
    }
    private static String getTimeString(Calendar c){
        int
                h = c.get(Calendar.HOUR_OF_DAY),
                m = c.get(Calendar.MINUTE),
                s = c.get(Calendar.SECOND)
                        ;
        return
                "" +
                ( h < 10 ? "0" + h : h) +
                ( m < 10 ? "0" + m : m) +
                ( s < 10 ? "0" + s : s)
                ;
    }
    private static String getTimeString(){
        return getTimeString(Calendar.getInstance());
    }

}

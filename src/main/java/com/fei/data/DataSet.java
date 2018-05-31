package com.fei.data;

import java.util.*;

/**
 * Created by huhu on 2018/5/7.
 */
public class DataSet {

    //  定义类型转换的基本类型
    private final static Map<Object, Integer> typeMap = new HashMap<Object, Integer>(){
        {
            put(Integer.class, 1);
            put(Long.class, 2);
            put(Float.class, 3);
            put(Double.class, 4);
            put(Byte.class, 5);
            put(Short.class, 6);
            put(Boolean.class, 7);
            put(String.class, 8);
            put(int.class, 1);
            put(long.class, 2);
            put(float.class, 3);
            put(double.class, 4);
            put(byte.class, 5);
            put(short.class, 6);
            put(boolean.class, 7);
            put(Date.class, 9);
            put(Calendar.class, 10);
            put(GregorianCalendar.class, 10);
        }
    };
    private static int getType(Class type){
        try {
            return typeMap.get(type);
        }catch (Exception e){
            return -1;
        }
    }

    //  获得类型转换后的实际值
    public static Object getRealValue(Object value) throws ClassCastException, NumberFormatException{
        return getRealValue(value, null);
    }
    public static Object getRealValue(Object value, Class type) throws ClassCastException, NumberFormatException{
        if (value == null) return null;
        if (type == null) return value.toString();

        double d;

        switch (getType(type)){
            case 1:case 2:case 3:case 4:case 5:case 6:{
                d = Double.parseDouble(value.toString());
                break;
            }
            case 7:{
                try {
                    d = Double.parseDouble(value.toString());
                    if (d != 0) return true;
                    else return false;
                }catch (Exception e){
                    return Boolean.parseBoolean(value.toString());
                }
            }case 8:{
                return value.toString();
            }case 9:{

                if (getType(value.getClass()) == 9){
                    return value;
                }else if (getType(value.getClass()) == 10){
                    value = ((Calendar) value).getTimeInMillis();
                }
                try {
                    Long l = Long.parseLong(value.toString());
                    Date date = new Date();
                    date.setTime(l);
                    return date;
                }catch (Exception e){
                    System.out.println(e);
                }

            }
            case 10:{
                if (getType(value.getClass()) == 9){
                    value = ((Date) value).getTime();
                }else if (getType(value.getClass()) == 10){
                    return value;
                }
                try {
                    Long l = Long.parseLong(value.toString());
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTimeInMillis(l);
                    return calendar;
                }catch (Exception e){
                    System.out.println(e);
                }
            }
            default: {
                //  不在基本类型内，强制转换
                return type.cast(value);
            }
        }

        switch (getType(type)){
            case 1: {
                return (int) d;
            }
            case 2:{
                return (long) d;
            }
            case 3:{
                return (float) d;
            }
            case 4:{
                return d;
            }
            case 5:{
                return (byte) d;
            }
            case 6:{
                return (short) d;
            }
            default: {
                return null;
            }
        }
    }

    public static void main(String[] args){
        Double d = 112556563256.525;
        String s = "132552.542";
        Double f = 125.5;
        System.out.println(getRealValue(d, Integer.class));
        System.out.println(getRealValue(d, Long.class));
        System.out.println(getRealValue(s, Short.class));
        System.out.println(getRealValue(s, Byte.class));
        System.out.println(getRealValue(f, String.class));
        System.out.println(getRealValue(d, Float.class));
        System.out.println(getRealValue(s, Double.class));
        System.out.println(getRealValue(f, Boolean.class));
        System.out.println(numberToString("52800000005473.841130", false));
    }

    public static String numberToString(String numStr, boolean upper){
        if (numStr.trim().equals("")) return null;

        String str = "";

        if (numStr.indexOf("-") != -1) {
            numStr = numStr.substring(1);
            str = "负";
        }

        long integer = 0;
        if (numStr.indexOf(".") != -1) integer = Long.parseLong(numStr.substring(0, numStr.indexOf(".")));
        else integer = Long.parseLong(numStr);

        long decimal = -1;
        if (numStr.indexOf(".") != -1) decimal = Long.parseLong(numStr.substring(numStr.indexOf(".") + 1));

        if (integer == 0 && decimal == -1) return "零";

        str += numberToStringGetDigit(integer, upper);

        //  小数不存在
        if (decimal == -1){
            if (str.trim().equals("")) return null;
            return str;
        }

        str += "点" + numberToStringGetDecimal(decimal, upper);

        if (str.trim().equals("")) return null;

        return str;
    }
    /*public static <T extends Number> String numberToString(T num, boolean upper){
        if (num == null) return null;

        String numStr;

        DecimalFormat nf = new DecimalFormat("00000000000000");
//        BigDecimal nf = new BigDecimal(num);
        nf.setGroupingUsed(false);
        numStr = nf.format(num);

        return numberToString(numStr, upper);


    }*/

    private static String numberToStringGetDecimal(long num, boolean upper){
        String numStr = "" + num;
        String str = "";
        for (int i =  0; i < numStr.length(); i++){
            Character c = numStr.charAt(i);
            str += unitToString(Integer.parseInt(c.toString()), upper);
        }
        return str;
    }

    private static String numberToStringGetDigit(long num, boolean upper){
        String numStr = "" + num;

        int numLength = numStr.length();

        if (numLength == 1) return unitToString((int) num, upper);

        int numLength4 = numLength / 4;
        ArrayList<String> strList = new ArrayList<String>();
        if (numLength % 4 != 0) {
            String strItem = numStr.substring(0, numLength - numLength4 * 4);
            numStr = numStr.substring(numLength - numLength4 * 4);
            strList.add(strItem);
        }
        int i;
        for (i = 0;i < numLength4; i++){
            strList.add(numStr.substring(i * 4, i * 4 + 4));
        }

        String str = "";

        int unitNumDesc = 0;
        for (int unitNum = strList.size() - 1; unitNum >= 0; unitNum--, unitNumDesc++){
            String st = "";

            numLength = strList.get(unitNum).length();
            String[] strListTemp;

            strListTemp = new String[numLength];
            for (i = 0;i < numLength; i++){
                strListTemp[i] = strList.get(unitNum).substring(i, i + 1);
            }

            int u2Desc = 0;
            for (int u2 = strListTemp.length - 1; u2 >= 0; u2--, u2Desc++){

                if (Integer.parseInt(strListTemp[u2]) == 0) {
                    if (st.equals("")) continue;

                    if (st.indexOf("零") == 0){
                        continue;
                    }else {
                        st = unitToString(Integer.parseInt(strListTemp[u2]), upper) + st;
                    }
                }else {
                    st = unitToString(Integer.parseInt(strListTemp[u2]), upper) + unitToString_S(u2Desc, upper) + st;
                }
            }

            if (st.equals("") && unitNum > 0 && str.indexOf("零") != 0) {
                str = "零" + str;
            }else {
                str = st + unitToString_B(unitNumDesc) + str;
            }
        }

        return str;

    }


    /**
     * 单个数字
     * @param num   数字
     * @param upper 是否大写
     * @return
     */
    private static String unitToString(int num, boolean upper){

        String[] num_lower = { "零", "一", "二", "三", "四", "五", "六", "七", "八", "九" };
        String[] num_upper = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };

        try {
            if (upper){
                return num_upper[num];
            }else {
                return num_lower[num];
            }
        }catch (Exception e){
            return null;
        }

    }

    /**
     * 单位类型
     * @param type
     * @return
     */
    private static String unitToString_B(int type){
        String[] unit = {"","万", "亿","兆","京","垓","秭","穰","沟","涧","正","载"};
        return unit[type];
    }
    private static String unitToString_S(int type, boolean upper){
        String[] unit_l = {"", "十", "百", "千"};
        String[] unit_u = {"", "拾", "佰", "仟"};
        if (upper){
            return unit_u[type];
        }else {
            return unit_l[type];
        }
    }

}

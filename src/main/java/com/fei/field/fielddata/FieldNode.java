package com.fei.field.fielddata;

import java.util.HashMap;

/**
 * Created by huhu on 2018/5/3.
 */
public class FieldNode extends HashMap {

    private String name = "";
    private String type = "";
    private String color;
    private String sign;

    public FieldNode() {
        String seed = "qwertyuiopasdfghjklzxcvbnm QWERTYUIOPASDFGHJKLZXCVBNM";
        int i, n = (int) Math.abs(6 * Math.random()) + 6;
        for (i = 0; i < n; i++){
            int k = (int) Math.abs(seed.length() * Math.random());
            this.name += seed.substring(k, k + 1);
            this.put("name", this.name);
            k = (int) Math.abs(seed.length() * Math.random());
            if (i < 6) {
                this.type += seed.substring(k, k + 1);
                this.put("type", this.type);
            }
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
        this.put("name", name);
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
        this.put("type", type);
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
        this.put("color", color);
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
        this.put("sign", sign);
    }
}

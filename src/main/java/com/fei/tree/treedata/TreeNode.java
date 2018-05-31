package com.fei.tree.treedata;

import java.util.HashMap;

/**
 * Created by huhu on 2018/5/3.
 */
public class TreeNode extends HashMap {

    private Integer id;
    private String name = "";
    private String type = "";
    private Integer fatherId;

    public TreeNode() {
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
        this.put("id", id);
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

    public Integer getFatherId() {
        return fatherId;
    }

    public void setFatherId(Integer fatherId) {
        this.fatherId = fatherId;
        this.put("fatherId", fatherId);
    }
}

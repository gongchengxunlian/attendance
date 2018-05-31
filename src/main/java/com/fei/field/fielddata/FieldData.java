package com.fei.field.fielddata;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by huhu on 2018/5/3.
 */
public class FieldData {
    List<FieldNode> fieldNodes = new ArrayList<FieldNode>();

    public FieldData() {
        int i, n = (int) Math.abs(50 * Math.random()) + 50;
        int j = (int) Math.abs(n / 7 * Math.random()), jj = (int) Math.abs(n / 11 * Math.random());
        String seed = "qwertyuiopasdfghjklzxcvbnm QWERTYUIOPASDFGHJKLZXCVBNM";

        List aj = getStringList(j);
        List ajj = getStringList(jj);

        for (i = 0; i < n; i++){
            FieldNode fieldNode = new FieldNode();
            int k = (int) Math.abs((j - 1) * Math.random());
            int kk = (int) Math.abs((jj - 1) * Math.random());
            fieldNode.setColor(aj.get(k).toString());
            fieldNode.setSign(ajj.get(kk).toString());
            fieldNodes.add(fieldNode);
        }


    }

    private List getStringList(int j){
        int i;
        String seed = "qwertyuiopasdfghjklzxcvbnm QWERTYUIOPASDFGHJKLZXCVBNM";
        ArrayList aj = new ArrayList();

        for (i = 0; i < j; i++){
            String ajStr = "";
            int ii, ajStrLength = (int) Math.abs(8 * Math.random()) + 6;
            for (ii = 0; ii < ajStrLength; ii++){
                int k = (int) Math.abs(seed.length() * Math.random());
                ajStr += seed.substring(k, k + 1);
            }
            aj.add(ajStr);
        }
        return aj;
    }

    public List<FieldNode> getFieldNodes() {
        return fieldNodes;
    }
}

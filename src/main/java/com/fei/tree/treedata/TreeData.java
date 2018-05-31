package com.fei.tree.treedata;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by huhu on 2018/5/3.
 */
public class TreeData {
    List<TreeNode> treeNodes = new ArrayList<TreeNode>();

    public TreeData() {
        int i, n = (int) Math.abs(50 * Math.random()) + 50;
        int j, jj, jjj;
        j = (int) Math.abs(n / 4 * Math.random());
        jj = (int) Math.abs((n - j) / 2 * Math.random()) + j;
        jjj = (int) Math.abs((n - jj) / 1 * Math.random()) + jj;
        for (i = 0; i < n; i++){
            TreeNode treeNode = new TreeNode();
            treeNode.setId(i);
            if (i < j) {
                treeNode.setFatherId(null);
            }else if (i < jj) {
                int k = (int) Math.abs(j * Math.random());
                treeNode.setFatherId(k);
            }else if (i < jjj){
                int k = (int) Math.abs(jj * Math.random());
                treeNode.setFatherId(k);
            }else {
                int k = (int) Math.abs(jjj * Math.random());
                treeNode.setFatherId(k);
            }
            this.treeNodes.add(treeNode);
        }
    }

    public List<TreeNode> getTreeNodes() {
        return treeNodes;
    }
}

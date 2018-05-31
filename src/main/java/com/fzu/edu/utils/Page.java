package com.fzu.edu.utils;

import lombok.Data;

import java.util.List;

/**
 * Created by panzx on 2017/12/22.
 */
@Data
public class Page {
    private int pageNo;
    private int pageSize;
    private int totalPage;
    private int totalCount;
    private List data;

    public Page() {
    }

    public Page(int pageNo, int pageSize) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
    }

    public Page(Object pageNo, Object pageSize, List data) {
        try {
            this.pageNo = Integer.parseInt(pageNo.toString());
            this.pageSize = Integer.parseInt(pageSize.toString());
        }catch (Exception e){  }

        this.data = data;
        this.totalCount = data.size();
        if (this.pageSize == 0) {
            return;
        }
        int temp = this.totalCount % this.pageSize;
        if (temp == 0) {
            this.totalPage = this.totalCount / this.pageSize;
        } else {
            this.totalPage = this.totalCount / this.pageSize + 1;
        }
        if (this.totalCount > this.pageSize) {
            int start = (this.pageNo - 1) * this.pageSize;
            int end = start + this.pageSize;
            if (end > this.totalCount) {
                end = this.totalCount;
            }
            this.data = data.subList(start, end);
        }
    }


}

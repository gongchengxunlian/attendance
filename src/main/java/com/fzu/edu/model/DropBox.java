package com.fzu.edu.model;

import lombok.Data;

import java.io.Serializable;

/**
 * @author huang.wei  on 2018/3/29
 */
@Data
public class DropBox implements Serializable {

    String name;
    String value;

    private static final long serialVersionUID = -466356836352151185L;
}

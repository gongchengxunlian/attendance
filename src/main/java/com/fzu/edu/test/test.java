package com.fzu.edu.test;

import org.mybatis.generator.api.ShellRunner;

/**
 * Created by bianbian on 2018/2/9.
 */
public class test {

    public static void main(String[] args) {
        args = new String[] { "-configfile", "src\\main\\resources\\generatorConfig.xml", "-overwrite" };
        ShellRunner.main(args);
    }


}

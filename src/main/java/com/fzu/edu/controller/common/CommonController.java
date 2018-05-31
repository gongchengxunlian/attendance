package com.fzu.edu.controller.common;

import com.fzu.edu.model.DropBox;
import com.fzu.edu.service.CommonService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * @author huang.wei  on 2018/3/29
 * 公共服务接口
 */
@Controller
@RequestMapping(value = "/common", produces = {"application/json;charset=UTF-8"})
public class CommonController {


    @Resource
    private CommonService commonService;


    /**
     * fieldName   下拉框作为name的字段名
     * fieldValue 下拉框作为value的字段名
     * tableName  表名
     * filedSearch 模糊查询字段
     * value   匹配内容
     *
     * @param param
     * @return
     */
    @RequestMapping(value = "/dropBox", method = RequestMethod.GET)
    @ResponseBody
    public List<DropBox> selectDropBox(@RequestParam Map<String, Object> param) {
        
        return commonService.selectDropBox(param);
    }
}

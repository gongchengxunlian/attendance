package com.fzu.edu.app;

import java.util.HashMap;

/**
 * Created by huhu on 2018/6/10.
 */
public class SMTPSendMail extends com.fei.mail.SMTPSendMail {

    public SMTPSendMail() {

        HashMap attr = Config.getAttribute();

        super.username = attr.get("mail:username").toString();
        super.password = attr.get("mail:password").toString();
        super.host = attr.get("mail:host").toString();
        super.port = attr.get("mail:port").toString();

        super.run();

    }


}

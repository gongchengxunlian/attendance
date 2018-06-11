package com.fei.mail;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

/**
 * Created by huhu on 2018/6/10.
 */
public class SMTPSendMail {

    protected String username;

    protected String password;

    protected String host;

    protected String port;

    private Properties props;

    Session mailSession;

    protected SMTPSendMail(){  }

    public SMTPSendMail(String username, String password, String host){
        this(username, password, host, "25");
    }

    public SMTPSendMail(String username, String password, String host, String port) {
        this.username = username;
        this.password = password;
        this.host = host;
        this.port = port;
        run();
    }

    protected void run(){

        // 创建Properties 类用于记录邮箱的一些属性
        props = new Properties();
        // 表示SMTP发送邮件，必须进行身份验证
        props.put("mail.smtp.auth", "true");
        //此处填写SMTP服务器
        props.put("mail.smtp.host", host);
        //端口号
        props.put("mail.smtp.port", port);
        // 此处填写你的账号
        props.put("mail.user", username);
        // STMP口令
        props.put("mail.password", password);

        // 构建授权信息，用于进行SMTP进行身份验证
        Authenticator authenticator = new Authenticator() {

            protected PasswordAuthentication getPasswordAuthentication() {
                // 用户名、密码
                String userName = props.getProperty("mail.user");
                String password = props.getProperty("mail.password");
                return new PasswordAuthentication(userName, password);
            }
        };
        // 使用环境属性和授权信息，创建邮件会话
        mailSession = Session.getInstance(props, authenticator);

    }

    public Massage createMassage(){
        return new Massage(mailSession, props);
    }

    public static class Massage extends MimeMessage{

        private Properties props;

        public Massage(Session session, Properties props){
            super(session);
            this.props = props;
        }

        //  设置发件人
        public void setSender(String user) throws MessagingException{
            InternetAddress form = new InternetAddress(props.getProperty("mail.user"));
            this.setFrom(form);
        }

        //  设置接收者
        public void setRecipient(String user) throws MessagingException{
            InternetAddress to = new InternetAddress(user);
            this.setRecipient(MimeMessage.RecipientType.TO, to);
        }

        public void setContent(String content) throws MessagingException {
            this.setContent(content, "text/html;charset=UTF-8");
        }

        public void send() throws MessagingException{
            Transport.send(this);
        }

    }

}

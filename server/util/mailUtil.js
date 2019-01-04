const nodemailer = require("nodemailer");
const log = require("../log/boleLog").boleLog;
const config = require("../config");
// const os = require('os');
// const env = process.env;
// const nodeEnv = env.NODE_ENV || "development";
// const network = os.networkInterfaces();
//
// let domain;
// if (nodeEnv === "development") {                                      //开发模式用本地地址
//     for (let networkItem of network["Loopback Pseudo-Interface 1"]) {
//         if (networkItem.family === 'IPv4') {
//             domain = networkItem.address;
//         }
//     }
// } else {
//     if (env.domain) {                                                   //生产模式如有环境变量就用环境变量
//         domain = env.domain;
//     } else {
//         for (let networkItem of network["eth0"]) {                      //没有环境变量用IP
//             if (networkItem.family === 'IPv4') {
//                 domain = networkItem.address;
//             }
//         }
//     }
// }
let email = config.email;

class Mail {
    mailUtil(options) {
        // 开启一个 SMTP 连接池
        return new Promise((resolve, reject) => {
            let smtpTransport = nodemailer.createTransport({
                host: email.host, // 主机
                secureConnection: email.secureConnection,
                port: email.port, // SMTP 端口
                auth: {
                    user: email.user, // 账号
                    pass: email.pass // 密码或授权码
                }
            });
            // 设置邮件内容
            let html;
            let subject;
            switch (options.method) {
                case 'forgetPasswordBySelf':
                    subject = "用户找回密码";
                    html = `<h3>亲爱的${email.userBrand}用户：</h3>` +
                        `<strong>为了您的账户安全，请您在24小时内点击以下链接：</strong><a href="${options.link }">修改密码</a>` + `<strong>，并完成登录</strong>` +
                        `<p>若您未申请找回密码，请忽略此邮件<p/>` +
                        `<br/><br/><br/>此致` +
                        `<p>${config.brand}团队</p>`;

                    break;
                case 'updatePasswordByAdmin':
                    subject = "管理员重置密码";
                    html = `<h3>亲爱的${email.userBrand}用户：</h3>` +
                        `<p>您好，您的密码已经被管理员重置，为了您的账号安全，请及时登录系统查看。</p>` +
                        `<p><a href="${options.link }">登录系统</a></p>` +
                        `<br/><br/><br/>此致` +
                        `<p>${config.brand}团队</p>`;
                    break;
            }
            let mailOptions = {
                from: email.from, // 发件地址
                to: options.recipients, // 收件列表
                subject: config.brand + "————" + subject, // 标题
                html: html // html 内容
            };
            // 发送邮件
            smtpTransport.sendMail(mailOptions, (error, response) => {
                if (error) {
                    log.info(error);
                    reject(error);
                } else {
                    log.info("Message sent: " + response);
                    resolve({
                        status: 1,
                        body: response
                    })
                }
                smtpTransport.close(); // 如果没用，关闭连接池
            });
        });
    }
}

module.exports = new Mail();

/**
 * Created by yong.liu on 2015/9/18.
 */
"use strict";
const path = require("path");
const router = require("koa-router")();
const jwtUtil = require(path.join(process.cwd(), "server/util/jwtUtil"));
const pwdUtil = require(path.join(process.cwd(), "server/util/pwdUtil"));
const config = require(path.join(process.cwd(), "server/config"));
const serverOptions = config.options;
const handler = require(path.join(process.cwd(), "server/service/serverAdmin/handler"));

//配置项获取
router.get("/api/config", function (ctx, next) {
    let _this = ctx;
    _this.body = {
        brand: config.brand,
        copyright:config.copyright,
        options: config.options,  //dashboard web模块配置
    };
});

/**
 * 登录
 */
router.post("/api/signin", async function (ctx, next) {
    let _this = ctx;
    let reqData = _this.request.body;
    let conditions = {
        username: reqData.userName,
        password: pwdUtil(reqData.password)
    };
    let _body;
    let admins = await handler.findAdminByParams(conditions);
    if (0 < admins.length) {
        if (admins[0].status === 1) {
            if(serverOptions["IS_DEALER_SYSTEM"] && !admins[0].org){
                _body = {
                    status: 0,
                    errorMessage:"该账号无所属组织机构，无法登录，请与管理员联系"
                }
            }else{
                _body = {
                    status: 1
                }
            }
        } else {
            _body = {
                status: 0,
                errorMessage: "该账户已被禁用，请联系管理员启用"
            }
        }
    } else {
        _body = {
            status: 0,
            errorMessage: "用户名或密码错误"
        }
    }
    if (_body.status) {
        let token = jwtUtil.jwtSign({
            id: admins[0]._id || ""
        });
        _body.token = token;
        _this.session.token = token || "";
        _this.session.id = admins[0]._id.toString();
    }
    console.log(_body);
    _this.body = _body;
});

/**
 * 登出
 */
router.post("/api/logout", function (ctx, next) {
    ctx.session = null;
    ctx.body = {
        status: 1
    };
});

//邮件发送
router.post("/api/forgetPassword", async function (ctx, next) {
    let username = ctx.request.body.username;
    let domain = ctx.request.headers.origin;
    let conditions = {
        username: username
    };
    let admins = await handler.findAdminByParams(conditions);
    let _body;
    if (0 < admins.length) {
        if (admins[0].email) {
            let jwtObj = {
                id: admins[0]._id || "",
                time: new Date().getTime()
            };
            console.log(jwtObj);
            let hasTimeToken = jwtUtil.jwtSign(jwtObj);
            let options = {
                recipients: admins[0].email,
                link: domain+'?token=' + hasTimeToken + '#/retrieveByMail',
                method: 'forgetPasswordBySelf'
            };
            let result = await handler.emailSend(options);
            if (result.status) {
                _body = {
                    status: 1,
                }
            } else {
                _body = {
                    status: 0,
                    errorMessage: "邮箱出错，请稍后重试"
                }
            }
        } else {
            _body = {
                status: 0,
                errorMessage: "该账户无邮箱，请联系管理员重置密码"
            }
        }
    } else {
        _body = {
            status: 0,
            errorMessage: "账户名不存在，请重新输入"
        }
    }
    ctx.body = _body;
});

//找回密码页面验证信息
router.post("/api/retrievePasswordCheckToken", async function (ctx, next) {
    let token = ctx.request.body.token;
    let tokenObj = jwtUtil.jwtDecode(token);
    let time = tokenObj.time;
    let timeDiff = new Date().getTime() - time;
    let _body;
    if (timeDiff > 24 * 60 * 60 * 1000) {
        _body = {
            status: 0,
            errorMessage: "该链接已失效，请重新申请找回，3秒后返回登录页面"
        }
    } else {
        let id = tokenObj.id;
        let conditions = {
            _id: id
        };
        let admins = await handler.findAdminByParams(conditions);
        if (admins.length) {
            _body = {
                status: 1,
                userId: id
            }
        } else {
            _body = {
                status: 0,
                errorMessage: "无该用户，请核实后申请找回，3秒后返回登录页面"
            }
        }
    }
    ctx.body = _body;
});

//找回密码，修改密码
router.post("/api/retrievePassword", async function (ctx, next) {
    await handler.updateAdminById(ctx.request.body._id, {password: ctx.request.body.password});
    ctx.body = {
        status: 1
    };
});

//告警调用系统通知接口
router.post("/api/addSystemLogByCallPolice", async function (ctx, next) {
    let param = ctx.request.body;
    let adminIds = await handler.findAdminByParams({adminRoles:"58fd9ed7143f3d2cc4989c39"});
    param.readState = "0";
    param.receiptTime = new Date().getTime();
    for(let adminId of adminIds){
        param.adminId = adminId;
        handler.addSystemLog(param);
    }
    ctx.body = {
        status: 1
    };
});

module.exports = router;
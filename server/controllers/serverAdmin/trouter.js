/**
 * Created by yong.liu on 2016/9/21.
 */
"use strict";
const path = require("path");
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const jwtUtil = require(path.join(process.cwd(), "server/util/jwtUtil"));
const handler = require(path.join(process.cwd(), "server/service/serverAdmin/handler"));
const serverOptions = require(path.join(process.cwd(), "server/config")).options;

/*--------------本系统调用------------------------*/
//个人中心修改admin
trouter.put("/admin", async function(ctx, next) {
    await handler.updateAdminById(ctx.query.id, ctx.request.body);
    ctx.body = {
        status: 1
    };
});

//通过session查admin
trouter.get("/adminBySessionId", async function(ctx, next) {
    let result = await handler.findAdminDetailById(ctx.session.id);
    ctx.body = {
        status: 1,
        data: result
    };
});

//根据权限查菜单
trouter.get("/findMenusByResource", async function(ctx, next) {
    let userId = ctx.session.id;
    let menus = await handler.findMenusByResource(userId);
    ctx.body = {
        status: 1,
        menus: menus,
        token: ctx.session.token || "",
    };
});

/*--------------子系统调用------------------------*/
//子系统通过token来查admin
trouter.get("/findAdminByToken", async function(ctx, next) {
    let token = ctx.query.token;
    let tokenObj = jwtUtil.jwtDecode(token);
    let id = tokenObj.id ? tokenObj.id : tokenObj.userName;
    let admin = await handler.findAdminById(id);
    delete admin.password;
    console.log(admin);
    ctx.body = {
        status: 1,
        admin: admin
    };
});

//子系统通过token来查admin（详细）
trouter.get("/findAdminDetailByToken", async function(ctx, next) {
    let token = ctx.query.token;
    let tokenObj = jwtUtil.jwtDecode(token);
    let id = tokenObj.id ? tokenObj.id : tokenObj.userName;
    let admin = await handler.findAdminDetailById(id);
    delete admin.password;
    console.log(admin);
    ctx.body = {
        status: 1,
        admin: admin
    };
});

//子系统通过token和顶级资源名
trouter.get("/findFunctionsByResource", async function(ctx, next) {
    let reqData = ctx.query;
    let topResourceName = reqData.topResourceName;
    let token = reqData.token;
    let tokenObj = jwtUtil.jwtDecode(token);
    let id = tokenObj.id ? tokenObj.id : tokenObj.userName;
    let permission = await handler.findFunctionsByResource(id, topResourceName);
    ctx.body = {
        status: 1,
        permission: permission
    };
});

//子系统调用
trouter.post("/addOrgByDealer", async function(ctx, next) {
    await handler.addOrgByDealer(ctx.request.body);
    ctx.body = {
        status: 1
    };
});

//子系统调用
trouter.get("/findOrgById", async function(ctx, next) {
    let orgs = await handler.findOrgById(ctx.query.id);
    ctx.body = {
        status: 1,
        orgs: orgs
    };
});

//子系统调用
trouter.get("/findOrgAncestor", async function(ctx, next) {
    let orgs = await handler.findOrgByParams({
        parent: null
    });
    ctx.body = {
        status: 1,
        orgs: orgs
    };
});

/*---------------foundation 调用 -------------------*/
/*---------------注意：子系统调用无法使用session上的id 需转换query上的token--------*/
//查询所有角色
trouter.get("/findAdminRole", async function(ctx, next) {
    let adminRoles = await handler.findRoleByParams({});
    ctx.body = {
        status: 1,
        adminRoles: adminRoles
    };
});

//分页查询用户
trouter.get("/findAdminByUserNameAndRoleId", async function(ctx, next) {
    let reqData = ctx.query;
    let pageIndex = parseInt(reqData.pageIndex);
    let pageSize = parseInt(reqData.pageSize);
    let query = {
        username: reqData.username,
        adminRoles: reqData.adminRoles,
        status: reqData.status
    };
    let result = await handler.findAdminByParamsAndPageHasFuzzy(query, {
        pageIndex: pageIndex,
        pageSize: pageSize
    });
    let total = result[0];
    let admins = result[1];
    let body = {
        status: 1,
        admins: admins,
        pageCount: Math.ceil(total / pageSize),
        pageSize: pageSize,
        pageIndex: pageIndex,
        totalCount: total
    };
    ctx.body = body;
});

//通过用户名查询用户
trouter.get("/findAdminByUsername", async function(ctx, next) {
    let query = {
        username: ctx.query.username
    }
    let admins = await handler.findAdminByParams(query);
    ctx.body = {
        status: 1,
        admins: admins
    };
});

//新增用户
trouter.post("/saveAdmin", async function(ctx, next) {
    let reqData = ctx.request.body;
    reqData.status = 1;
    reqData.passStatus = 0;
    await handler.saveAdmin(reqData);
    ctx.body = {
        status: 1
    };
});

//修改用户
trouter.put("/admin", async function(ctx, next) {
    await handler.updateAdminById(ctx.query.id, ctx.request.body);
    ctx.body = {
        status: 1
    };
});

//删除用户
trouter.delete("/admin", async function(ctx, next) {
    let total, body;
    let token = ctx.query.token;
    let tokenObj = jwtUtil.jwtDecode(token);
    let id = tokenObj.id ? tokenObj.id : tokenObj.userName;
    if (id !== ctx.query.id) {
        total = await handler.findAdminCountByParams({});
        if (1 < total) {
            await handler.deleteAdminById(ctx.query.id);
            body = {
                status: 1
            }
        } else {
            body = {
                status: 0,
                errorMessage: "不能删除最后一个用户"
            }
        }
    } else {
        body = {
            status: 0,
            errorMessage: "不能删除自己"
        }
    }
    ctx.body = body;
});

//重置用户密码
trouter.put("/adminReset", async function(ctx, next) {
    let reqBody = ctx.request.body;
    let domain = ctx.request.headers.origin;
    await handler.updateAdminById(reqBody.id, {
        password: reqBody.password
    });
    if (serverOptions["MAIL_FUNCTION"]) {
        let conditions = {
            _id: reqBody.id
        };
        let admins = await handler.findAdminByParams(conditions);
        if (admins[0].email) {
            let options = {
                recipients: admins[0].email,
                link: domain + '#/login',
                method: 'updatePasswordByAdmin'
            };
            await handler.emailSend(options);
        }
    }
    ctx.body = {
        status: 1
    };
});

//添加组织机构
trouter.post("/addOrgByOrg", async function(ctx, next) {
    await handler.addOrgByOrg(ctx.request.body);
    ctx.body = {
        status: 1
    };
});

//通过id查找组织机构
trouter.get("/findOrgById", async function(ctx, next) {
    let orgs = await handler.findOrgById(ctx.query.id);
    ctx.body = {
        status: 1,
        orgs: orgs
    };
});

//查找组织机构的祖先
trouter.get("/findOrgAncestor", async function(ctx, next) {
    let orgs = await handler.findOrgByParams({
        parent: null
    });
    ctx.body = {
        status: 1,
        orgs: orgs
    };
});

//通过父ID查找组织机构
trouter.post("/findOrgByParentId", async function(ctx, next) {
    let orgs = await handler.findOrgByParams({
        parent: ctx.query.id
    });
    ctx.body = {
        status: 1,
        orgs: orgs
    };
});

//查找组织机构分页
trouter.get("/findOrgByConditionAndPage", async function(ctx, next) {
    let reqData = ctx.query;
    let query = {
        name: reqData.keyword
    };
    let pageIndex = parseInt(reqData.pageIndex);
    let pageSize = parseInt(reqData.pageSize);
    let result = await handler.findOrgByParamsAndPageHasFuzzy(query, {
        pageIndex: parseInt(pageIndex),
        pageSize: parseInt(pageSize)
    });
    let total = result[0];
    let orgs = result[1];
    let body = {
        status: 1,
        orgs: orgs,
        pageCount: Math.ceil(total / pageSize),
        pageSize: pageSize,
        pageIndex: pageIndex,
        totalCount: total
    };
    ctx.body = body;
});

//通过ID更新组织机构
trouter.put("/updateOrgById", async function(ctx, next) {
    await handler.updateOrgByParams({
        _id: ctx.query.id
    }, ctx.request.body);
    ctx.body = {
        status: 1
    };
});

//通过ID删除组织机构
trouter.delete("/deleteOrgById", async function(ctx, next) {
    let orgId = ctx.query.id;
    let adminCount = await handler.findAdminCountByParams({
        org: orgId
    });
    let body = {};
    if (adminCount) {
        body = {
            status: 0,
            errorMessage: "删除失败，该组织机构上已有账户"
        }
    } else {
        let result = await handler.findOrgByParams({
            parent: orgId
        });
        if (result.length) {
            body = {
                status: 0,
                errorMessage: "删除失败，该组织机构有下属组织机构"
            }
        } else {
            await handler.deleteOrgById(orgId);
            body = {
                status: 1
            };
        }

    }
    ctx.body = body;
});

//查找角色分页
trouter.get("/adminRole", async function(ctx, next) {
    let reqData = ctx.query;
    let pageIndex = parseInt(reqData.pageIndex);
    let pageSize = parseInt(reqData.pageSize);
    let query = {
        name: reqData.name,
        status: reqData.status
    }
    let result = await handler.findRoleByParamsAndPageHasFuzzy(query, {
        pageIndex: pageIndex,
        pageSize: pageSize
    });
    let total = result[0];
    let roles = result[1];
    let body = {
        status: 1,
        roles: roles,
        pageCount: Math.ceil(total / pageSize),
        pageSize: pageSize,
        pageIndex: pageIndex,
        totalCount: total
    };
    ctx.body = body;
});

//查找角色名称是否重复
trouter.get("/findRoleIsRepeatByName", async function(ctx, next) {
    let reqData = ctx.query;
    let query = {
        name: reqData.name
    };
    let num = await handler.findRoleCountByParams(query);
    let _body;
    if (num === 0) {
        _body = {
            status: 1
        }
    } else {
        _body = {
            status: 0
        }
    }
    ctx.body = _body;
});

//查找角色名称是否重复（相同ID允许）
trouter.get("/findRoleIsRepeatByNameAndId", async function(ctx, next) {
    let reqData = ctx.query;
    let num = await handler.findRoleCountByParams({
        name: reqData.name,
        id: reqData.id
    });
    let _body;
    if (num === 1) { //id和name一样，允许修改
        _body = {
            status: 1
        }
    } else {
        let num = await handler.findRoleCountByParams({
            name: reqData.name
        });
        if (num === 1) { //修改name，但又重复，不允许修改
            _body = {
                status: 0
            }
        } else {
            _body = {
                status: 1
            }
        }
    }
    ctx.body = _body;
});

//新增角色
trouter.post("/saveRole", async function(ctx, next) {
    let role = ctx.request.body;
    undefined === role.status ? role.status = 1 : undefined;
    await handler.saveRole(role);
    ctx.body = {
        status: 1
    };
});

//更新角色
trouter.put("/updateRole", async function(ctx, next) {
    await handler.updateRoleById(ctx.query.id, ctx.request.body);
    ctx.body = {
        status: 1
    };
});

//删除角色
trouter.delete("/deleteRole", async function(ctx, next) {
    let roleId = ctx.query.id;
    let adminCount = await handler.findAdminCountByParams({
        adminRoles: roleId
    });
    let body = {};
    if (adminCount) {
        body = {
            status: 0,
            errorMessage: "删除失败，该角色上已有用户"
        }
    } else {
        await handler.deleteRoleById(roleId);
        body = {
            status: 1
        };
    }
    ctx.body = body;
});

//查找所有的组织机构
trouter.get("/findOrganizations", async function(ctx, next) {
    let result = await handler.findOrgByParams({});
    ctx.body = {
        status: 1,
        organizations: result
    }
});

//查询系统通知列表
trouter.get("/findSystemLogsList", async function(ctx, next) {
    let reqData = ctx.query;
    let token = reqData.token;
    let tokenObj = jwtUtil.jwtDecode(token);
    let id = tokenObj.id ? tokenObj.id : tokenObj.userName;
    let query = {
        adminId: id,
        type: reqData.type,
        keyword: reqData.keyword
    };
    let pageIndex = parseInt(reqData.pageIndex);
    let pageSize = parseInt(reqData.pageSize);
    let result = await handler.findSystemLogsByParamsAndPageHasFuzzy(query, {
        pageIndex: pageIndex,
        pageSize: pageSize
    });
    let total = result[0];
    let datas = result[1];
    let _body = {
        status: 1,
        datas: datas,
        pageCount: Math.ceil(total / pageSize),
        pageSize: pageSize,
        pageIndex: pageIndex,
        totalCount: total
    };
    ctx.body = _body;
});

trouter.post("/addSystemLog", async function(ctx, next) {
    await handler.addSystemLog(ctx.request.body);
    ctx.body = {
        status: 1
    };
});

//通过ID删除系统通知
trouter.delete("/deleteSystemLog", async function(ctx, next) {
    await handler.deleteSystemLog(ctx.query.id);
    ctx.body = {
        status: 1
    };
});

//更新系统通知读取状态
trouter.put("/updateSystemLogReadState", async function(ctx, next) {
    await handler.updateSystemLogReadState(ctx.query.id);
    ctx.body = {
        status: 1
    };
});

//查找所有的资源
trouter.get("/findResources", async function(ctx, next) {
    let resources = await handler.findResources();
    ctx.body = {
        status: 1,
        resources: resources
    };
});

trouter.get("/findResourceByConditionAndPage", async function(ctx, next) {
    let _this = ctx;
    let reqData = _this.request.query;
    let keyword = reqData.keyword;
    let promises = await handler.findResourceByConditionAndPage(keyword, {
        pageIndex: parseInt(reqData.pageIndex),
        pageSize: parseInt(reqData.pageSize)
    });
    let total = promises[0];
    let resource = promises[1];
    let _body = {
        status: 1,
        resource: resource,
        pageCount: Math.ceil(total / parseInt(reqData.pageSize)),
        pageSize: parseInt(reqData.pageSize),
        pageIndex: parseInt(reqData.pageIndex),
        totalCount: total
    };
    _this.body = _body;
});

trouter.post("/addResource", async function(ctx, next) {
    let _this = ctx;
    let param = _this.request.body;
    await handler.addResource(param);
    let _body = {
        status: 1
    }
    _this.body = _body;
});

trouter.put("/updateResource", async function(ctx, next) {
    let result = await handler.updateResource(ctx.query.id, ctx.request.body);
    ctx.body = {
        status: 1
    };
});

trouter.delete("/deleteResource", async function(ctx, next) {
    let result = await handler.deleteResource(ctx.query.id, ctx.query.parent);
    //TODO此处返回对象需要进行成功判断
    let body = {
        status: result.result ? (1 === result.result.ok ? 1 : 0) : 0
    };
    if (0 === body.status) {
        body.errorMessage = "删除失败"
    }
    ctx.body = body;
});

trouter.get("/findMenus", async function(ctx, next) {
    let _this = ctx;
    let menus = await handler.findMenus();
    let _body = {
        status: 1,
        menus: menus,
    };
    _this.body = _body;
});

trouter.post("/addLevel0Menu", async function(ctx, next) {
    let _this = ctx;
    let result = await handler.addLevel0Menu(_this.request.body);
    let _body = {};
    if (result) {
        _body = {
            status: 1
        }
    }
    _this.body = _body;
});

trouter.put("/updateLevel0Menu", async function(ctx, next) {
    let _this = ctx;
    let result = await handler.editLevel0Menu(_this.query.id, _this.request.body);
    ctx.body = {
        status: 1
    };
});

trouter.delete("/delLevel0Menu", async function(ctx, next) {
    let _this = ctx;
    let result = await handler.delLevel0Menu(_this.query.id);
    ctx.body = {
        status: 1
    };
});

//二级菜单增
trouter.put("/addLevel1Menu", async function(ctx, next) {
    let _this = ctx;
    let result = await handler.addLevel1Menu(_this.request.body, _this.query.id);
    let _body = {};
    if (result.ok) {
        _body = {
            status: 1
        }
    }
    _this.body = _body;
});

//二级菜单改
trouter.put("/editLevel1Menu", async function(ctx, next) {
    let _this = ctx;
    let result = await handler.editLevel1Menu(_this.request.body, _this.query.parentId, _this.query.subIndex);
    let _body = {};
    if (result.ok) {
        _body = {
            status: 1
        }
    }
    _this.body = _body;
});

//二级菜单删
trouter.put("/delLevel1Menu", async function(ctx, next) {
    let _this = ctx;
    let result = await handler.delLevel1Menu(_this.query.parentId, _this.query.subIndex);
    let _body = {};
    if (result.ok) {
        _body = {
            status: 1
        }
    }
    _this.body = _body;
});

trouter.get("/findSubMenus", async function(ctx, next) {
    let _this = ctx;
    let parent = await handler.findSubMenus(_this.query.id);
    let _body = {
        status: 1,
        subMenus: parent.subMenus
    }
    _this.body = _body;
});

trouter.get("/fuzzyFindAdminByUserName", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.query;
    let username = reqData.username;
    let admins = await handler.fuzzyFindAdminByUserName(username);
    let _body = {
        status: 1,
        admins: admins
    }
    _this.body = _body;
});

trouter.get("/getCurrentAdminRole" , async function(ctx, next){
    let roleIds = ctx.session.roleIds;
    let result = await handler.getCurrentAdminRole(roleIds);
    ctx.body = {
        status: 1,
        data: result
    }
});

module.exports = trouter;
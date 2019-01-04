/**
 * Created by yong.liu on 2016/9/10.
 */
"use strict";
const path = require("path");
const config = require(path.join(process.cwd(), "server/config"));
const pwdUtil = require(path.join(process.cwd(), "server/util/pwdUtil"));
const adminModel = require(path.join(process.cwd(), "server/models/serverAdmin/admin")).adminModel;
const adminRoleModel = require(path.join(process.cwd(), "server/models/serverAdmin/adminRole")).adminRoleModel;
const menuModel = require(path.join(process.cwd(), "server/models/serverAdmin/menu")).menuModel;
const orgModel = require(path.join(process.cwd(), "server/models/serverAdmin/organization")).orgModel;
const resourceModel = require(path.join(process.cwd(), "server/models/serverAdmin/resource")).resourceModel;
const systemLogModel = require(path.join(process.cwd(), "server/models/serverAdmin/systemLog")).systemLogModel;
const mongooseUtil = require(path.join(process.cwd(), "server/util/mongooseUtil"))();
const mailUtil = require(path.join(process.cwd(), "server/util/mailUtil")).mailUtil;
const mongoose = require('mongoose');

class AdminHandler {
    constructor() {

    }

    static searchParamsClearEmptyValue(params) {
        for (let key in params) {
            if (!params[key]) {
                delete params[key]
            }
        }
    }

    //----------------------------------------admin-------------------------
    //通过id更新用户
    updateAdminById(id, changeObj) {
        if (changeObj.password) {
            changeObj.password = pwdUtil(changeObj.password);
        }
        return adminModel.update({
            _id: id
        }, {
            $set: changeObj
        }).exec();
    }

    //通过id查找用户（唯一）
    findAdminById(id) {
        return adminModel.findOne({
            _id: id
        }).exec();
    }

    //通过ID查找用户详细信息（唯一）
    findAdminDetailById(id) {
        return adminModel.findOne({
            _id: id
        }).populate("adminRoles").populate("org").exec();
    }

    //通过条件查找用户
    findAdminByParams(params) {
        if (params.adminRoles) {
            params.adminRoles = mongoose.Types.ObjectId(params.adminRoles);
        }
        if (params.org) {
            params.org = mongoose.Types.ObjectId(params.org);
        }
        return adminModel.find(params).exec();
    }

    //保存用户
    saveAdmin(param) {
        let admin = new adminModel({
            password: pwdUtil(param.password),
            username: param.username,
            name: param.name,
            gender: param.gender,
            mobile: param.mobile,
            email: param.email,
            address: param.address,
            description: param.description,
            ifAdmin: param.ifAdmin,
            status: param.status,
            passStatus: param.passStatus,
            adminRoles: param.adminRoles,
            org: param.org
        });
        return admin.save();
    }

    //通过id删除用户
    deleteAdminById(id) {
        return adminModel.remove({
            _id: id
        }).exec();
    }

    //通过条件查找用户总数
    findAdminCountByParams(params) {
        return adminModel.find(params).count().exec();
    }

    //通过条件查找用户,支持用户名模糊搜索并分页
    findAdminByParamsAndPageHasFuzzy(params, pager) {
        if (params.username) {
            let pattern = new RegExp(params.username);
            params.username = {
                $regex: pattern,
                $options: 'imxs'
            };
        }
        if (params.adminRoles) {
            params.adminRoles = mongoose.Types.ObjectId(params.adminRoles);
        }
        AdminHandler.searchParamsClearEmptyValue(params);
        return Promise.all([
            adminModel.find(params).count().exec(),
            adminModel.find(params).sort({
                _id: -1
            }).populate("adminRoles").skip((pager.pageIndex - 1) * pager.pageSize).limit(pager.pageSize).exec()
        ])
    }

    //----------------------------------------adminRole-------------------------

    //新增角色
    saveRole(role) {
        return new adminRoleModel(role).save();
    }

    //通过ID更新角色
    updateRoleById(id, changeObj) {
        return adminRoleModel.update({
            _id: id
        }, {
            $set: changeObj
        }).exec();
    }

    //通过ID删除角色
    deleteRoleById(id) {
        return adminRoleModel.remove({
            _id: id
        }).exec();
    }

    //通过条件查询角色
    findRoleByParams(params) {
        return adminRoleModel.find(params).exec();
    }

    //通过条件查询角色总数
    findRoleCountByParams(params) {
        return adminRoleModel.find(params).count().exec();
    }

    //通过条件查询角色总数，支持模糊和分页
    findRoleByParamsAndPageHasFuzzy(params, pager) {
        if (params.name) {
            let pattern = new RegExp(params.name);
            params.name = {
                $regex: pattern,
                $options: 'imxs'
            };
        }
        AdminHandler.searchParamsClearEmptyValue(params);
        return Promise.all([
            adminRoleModel.find(params).count().exec(),
            adminRoleModel.find(params).sort({
                _id: -1
            }).skip((pager.pageIndex - 1) * pager.pageSize).limit(pager.pageSize).exec()
        ])
    }

    //----------------------------------------resource--------------------------

     //分页查询权限资源
    findResourceByConditionAndPage(params, pager){
        if (params) {
            params = {name : params};
        }
        return Promise.all([
            resourceModel.find(params).count().exec(),
            resourceModel.find(params).sort({_id: -1}).skip((pager.pageIndex - 1) * pager.pageSize).limit(pager.pageSize).exec()
        ]);
    }

    //新增权限资源
    addResource(resource){
        var ancestors = new Array();
        var parent = resource.parent;
        if(parent == null || parent == ""){
            ancestors.push(null);
            return new resourceModel(resource).save();
        }else{
            resourceModel.findOne({_id: parent}).then(function(obj){
                ancestors = obj.ancestors;
                if(!Array.isArray(ancestors)){
                    ancestors = new Array();
                }
                ancestors.push(parent);
                resource.ancestors = ancestors;
                return new resourceModel(resource).save();
            });
        }
    }

    //更新权限资源
    updateResource(id, changeObj){
        resourceModel.findOne({_id: id}).then(function(resource){
            //处理更新父级资源
            var parent = resource.parent;
            var ancestors = new Array();
            if(parent != changeObj.parent){
                resourceModel.findOne({_id: parent}).then(function(parentRes){
                    ancestors = obj.ancestors;
                    if(!Array.isArray(ancestors)){
                        ancestors = new Array();
                    }
                    ancestors.push(parent);
                    changeObj.ancestors = ancestors;
                });
                return resourceModel.update({_id: id}, {$set: changeObj}).exec();
            }else{
                return resourceModel.update({_id: id}, {$set: changeObj}).exec();
            }
        });

    }

    //通过ID删除权限资源
    deleteResource(id) {
        return resourceModel.remove({_id: id}).exec();
    }

    //查询所有权限
    findResources() {
        return resourceModel.find({}).exec();
    }

    //查询所有权限
    findResourcesByParams(params) {
        return resourceModel.find(params).exec();
    }

    //通过用户角色id和顶级资源名称查询uri
    findResourcesByRoleId(roleIds, topResourceName) {
        return this.findResourcesByParams({
            keyword: topResourceName
        }).then(function(res) {
            let topResourceId = null;
            if(res!=null && res!=""){
                topResourceId = res[0]._id;
            }
            return adminRoleModel.find({
                _id: {
                    $in: roleIds
                },
                status: 1
            }).populate({
                path: "resources",
                select: "uri",
                match: {
                    ancestors: topResourceId
                },
                model: resourceModel
            }).exec();
        });
    }

    //权限整合，删除重复uri
    findPermission(id, topResourceName) {
        let _this = this;
        return _this.findAdminByParams({
            _id: id
        }).then(function(adminRes) {
            return _this.findResourcesByRoleId(adminRes[0].adminRoles, topResourceName)
        }).then(function(res) {
            let adminRoles = res;
            let resourceArr = [];
            for (let adminRole of adminRoles) {
                for (let resource of adminRole.resources) {
                    if (resourceArr.indexOf(resource.uri) < 0) {
                        resourceArr.push(resource.uri);
                    }
                }
            }
            return resourceArr;
        });
    }

    //按钮级权限控制
    findFunctionsByResource(id, topResourceName) {
        return this.findPermission(id, topResourceName).then(function(resourceArr) {
            let obj = {};
            for (let resource of resourceArr) {
                obj[resource] = true;
            }
            return obj;
        })
    }

    //-----------------------------------------menu---------------------------

    //根据排序查菜单
    findMenus() {
        return menuModel.find({}).sort({
            order: 1
        }).exec();
    }

    //资源对比过滤菜单
    findMenusByResource(id) {
        return Promise.all([
            this.findPermission(id, 'dashboard'),
            this.findMenus()
        ]).then(([uris, menus]) => {
            for (let menu of menus) {
                if (menu.isIndex === 1) {
                    for (let uri of uris) {
                        if (menu.uri === uri) {
                            menu.isShow = 1
                        }
                    }
                }
                for (let subMenu of menu.subMenus) {
                    for (let uri of uris) {
                        if (menu.uri === uri) {
                            menu.isShow = 1
                        }
                        if (subMenu.uri === uri) {
                            subMenu.isShow = 1
                        }
                    }
                }
            }
            return menus;
        })
    }

    addLevel0Menu(menu) {
        return menuModel(menu).save();
    }

    editLevel0Menu(id, changeObj) {
        return menuModel.update({
            _id: id
        }, {
            $set: changeObj
        }).exec();
    }

    delLevel0Menu(id) {
        return menuModel.remove({
            _id: id
        }).exec();
    }

    //新增二级菜单
    addLevel1Menu(subMenu, id) {
        return menuModel.findOne({
            _id: id
        }).then(function(menu) {
            var subMenus = menu.subMenus;
            if (subMenus == undefined) {
                subMenus = new Array();
            }
            subMenus.push(subMenu);
            return menuModel.update({
                _id: id
            }, {
                $set: {
                    subMenus: subMenus
                }
            }).exec();
        });
    }

    //更新二级菜单
    editLevel1Menu(subMenu, id, subMenuIndex) {
        return menuModel.findOne({
            _id: id
        }).then(function(menu) {
            var subMenus = menu.subMenus;
            if (Array.isArray(subMenus)) {
                subMenus.splice(subMenuIndex, 1, subMenu);
            } else {
                subMenus = subMenu;
            }
            return menuModel.update({
                _id: id
            }, {
                $set: {
                    subMenus: subMenus
                }
            }).exec();
        });
    }

    //删除二级菜单
    delLevel1Menu(id, subMenuIndex) {
        console.log('array index::::' + subMenuIndex);

        return menuModel.findOne({
            _id: id
        }).then(function(menu) {
            var subMenus = menu.subMenus;
            if (Array.isArray(subMenus)) {
                subMenus.splice(subMenuIndex, 1);
            } else {
                subMenus = [];
            }
            return menuModel.update({
                _id: id
            }, {
                $set: {
                    subMenus: subMenus
                }
            }).exec();
        });

    }

    //获取子级菜单
    findSubMenus(id) {
        return menuModel.findOne({
            _id: id
        }).exec();
    }

    //------------------------------------------org-----------------------------------

    //通过经销商同步过来添加组织机构
    addOrgByDealer(param) {
        let orgModelParam = {
            name: param.name,
            code: param.code,
            ancestors: [],
            isParent: false,
            parent: null,
            isDealer: true
        };
        if (param.parentCode) {
            let parentCode = param.parentCode;
            this.findOrgByCode(parentCode).then((org) => {
                this.updateOrgByParams({
                    code: parentCode
                }, {
                    isParent: true
                }); //成为父亲
                orgModelParam.ancestors = org.ancestors;
                orgModelParam.ancestors.push(org._id);
                orgModelParam.parent = org._id;
                return new orgModel(orgModelParam).save(); //异步，剔出去会没有生效
            })
        } else {
            return new orgModel(orgModelParam).save();
        }
    }

    //通过orgCode查找组织机构（唯一）
    findOrgByCode(code) {
        return orgModel.findOne({
            code: code
        }).exec()
    }

    //添加组织机构
    addOrgByOrg(param) {
        let orgModelParam = {
            name: param.name,
            code: "",
            ancestors: [],
            isParent: false,
            parent: null
        };
        if (param.orgId) {
            let orgId = mongoose.Types.ObjectId(param.orgId);
            this.findOrgById(orgId).then((org) => {
                orgModel.update({
                    _id: orgId
                }, {
                    $set: {
                        isParent: true
                    }
                }).exec(); //成为父亲
                orgModelParam.ancestors = org.ancestors;
                orgModelParam.ancestors.push(orgId);
                orgModelParam.parent = orgId;
                orgModelParam.code = org.code;
                return new orgModel(orgModelParam).save(); //异步，剔出去会没有生效
            });
        } else {
            return new orgModel(orgModelParam).save();
        }
    }

    //通过orgId删除组织机构，并判断设置父组织机构的isParent属性
    deleteOrgById(id) {
        let _this = this;
        let parentId;
        return _this.findOrgById(id).then((org) => {
            parentId = mongoose.Types.ObjectId(org.parent);
            return orgModel.find({
                parent: parentId
            }).count().exec()
        }).then((num) => {
            if (num === 1) {
                this.updateOrgByParams({
                    _id: parentId
                }, {
                    isParent: false
                });
            }
            return orgModel.remove({
                _id: id
            }).exec();
        });
    }

    //通过参数更新组织机构
    updateOrgByParams(params, changeObj) {
        return orgModel.update(params, {
            $set: changeObj
        }).exec();
    }

    //通过参数查找组织机构
    findOrgByParams(params) {
        return orgModel.find(params).exec();
    }

    //通过orgId查找组织机构（唯一）
    findOrgById(orgId) {
        return orgModel.findOne({
            _id: orgId
        }).exec()
    }

    //通过参数查找组织机构，并支持模糊搜索和分页
    findOrgByParamsAndPageHasFuzzy(params, pager) {
        if (params.name) {
            let pattern = new RegExp(params.name);
            params.name = {
                $regex: pattern,
                $options: 'imxs'
            };
        }
        AdminHandler.searchParamsClearEmptyValue(params);
        return Promise.all([
            orgModel.find(params).count().exec(),
            orgModel.find(params).sort({
                _id: -1
            }).skip((pager.pageIndex - 1) * pager.pageSize).limit(pager.pageSize).exec()
        ]);
    }

    //------------------------------systemLog-----------------------------

    //新增系统通知
    addSystemLog(param) {
        new systemLogModel(param).save()
    }

    //删除系统通知，支持批量
    deleteSystemLog(logId) {
        let idArr = logId.split(",");
        return systemLogModel.remove({
            _id: {
                $in: idArr
            }
        }).exec();

    }

    //更新系统通知读取状态，支持批量
    updateSystemLogReadState(logId) {
        let idArr = logId.split(",");
        for (let i = 0; i < idArr.length; i++) {
            if (i === idArr.length - 1) {
                return systemLogModel.update({
                    _id: idArr[i]
                }, {
                    $set: {
                        readState: "1"
                    }
                }).exec();
            } else {
                systemLogModel.update({
                    _id: idArr[i]
                }, {
                    $set: {
                        readState: "1"
                    }
                }).exec();
            }
        }
    }

    //通过参数查询系统通知，并支持模糊查询和分页
    findSystemLogsByParamsAndPageHasFuzzy(params, pager) {
        let newParams = {};
        if (params.keyword) {
            newParams[params.type] = {
                $regex: new RegExp(params.keyword),
                $options: 'imxs'
            };
        }
        newParams.adminId = mongoose.Types.ObjectId(params.adminId);
        AdminHandler.searchParamsClearEmptyValue(newParams);
        return Promise.all([
            systemLogModel.find(newParams).count().exec(),
            systemLogModel.find(newParams).sort({
                receiptTime: -1
            }).skip((pager.pageIndex - 1) * pager.pageSize).limit(pager.pageSize).exec()
        ]);
    }

    //---------------------------------------mail-------------------------------

    //发送邮件
    emailSend(options) {
        return mailUtil(options);
    }
}

module.exports = new AdminHandler;
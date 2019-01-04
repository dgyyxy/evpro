/**
 * Created by yong.liu on 2016/9/8.
 */
"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

class Admin{
    constructor(){

    }

    get adminModel(){
        let adminSchema = Schema({
            password: String, //密码
            username: String, //用户名，不能重复
            name: String,   //姓名
            gender: Number, //0-男，1-女
            mobile: String, //手机号
            email: String,  //邮箱
            address: String,    //地址
            description: String,    //描述
            status: Number, //0-不可用，1-可用
            passStatus: Number, //密码状态：0-初始密码，1-客户密码，
            adminRoles: [{
                type: Schema.Types.ObjectId,
                ref: "adminRole"        //用户角色
            }],
            org: {
                type: Schema.Types.ObjectId,
                ref: "organization"     //用户组织机构
            },
            isDefault:Number //0-不为默认，1-默认
        });
        return mongoose.model("admin", adminSchema);
    }
}

module.exports = new Admin;
/**
 * Created by yong.liu on 2016/9/8.
 */
"use strict";
let mongoose = require("mongoose");
let Schema   = mongoose.Schema;

class AdminRole{
    constructor(){

    }

    get adminRoleModel(){
        let adminRoleSchema = Schema({
            name: String, //角色名
            description: String,   //描述
            status: Number, //状态 0-不可用，1-可用
            resources: [{
                type: Schema.Types.ObjectId,
                ref: "resource"     //拥有资源
            }],
            isDefault:Number //0-不为默认，1-默认
        });
        return mongoose.model("adminRole", adminRoleSchema);
    }
}

module.exports = new AdminRole;
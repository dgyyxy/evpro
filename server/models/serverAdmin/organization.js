/**
 * Created by yong.liu on 2016/12/23.
 */
"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

class Organization{
    constructor(){
        
    }

    get orgModel(){
        let orgSchema = Schema({
            name: String, //名称
            code: String, //经销商编码
            description: String, //描述
            admins: Array,
            ancestors: Array,  //组织机构祖先id集合
            parent: Schema.Types.ObjectId, //父组织机构id
            isParent: Boolean,  //是否为父组织机构 true-是 false-不是
            isDealer: Boolean  //是否为经销商同步生成  true-是 false-不是
        });
        return mongoose.model("organization", orgSchema);
    }
}

module.exports = new Organization;
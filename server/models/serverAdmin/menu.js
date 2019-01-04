/**
 * Created by yong.liu on 2016/9/8.
 */
"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

class Menu{
    constructor(){

    }

    get menuModel(){
        let menuSchema = Schema({
            name: String,  //菜单名
            link: String,   //菜单链接
            type: Number, //类型 0-本页面,1-iframe
            subMenus: Array,   //下级目录
            icon:String,    //图标 class
            uri:String,     //对应资源名
            isShow:Number, //1-可见，0-屏蔽,
            isIndex:Number, //1-首页 0-不是
            order:Number//排序
        });
        return mongoose.model("menu", menuSchema);
    }
}

module.exports = new Menu;
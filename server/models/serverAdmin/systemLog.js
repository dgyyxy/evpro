/**
 * Created by yong.liu on 2017/2/8.
 */
"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

class SystemLog{
    constructor(){

    }

    get systemLogModel(){
        let systemLogSchema = Schema({
            adminId: {
                type: Schema.Types.ObjectId,
                ref: "admin"  //收件人id
            },
            title: String,  //通知标题
            addresser: String,  //发件人名
            content: String,  //通知内容
            receiptTime: Number, //通知时间时间戳
            readState: String //读取状态  "0"--未读  "1"--已读
        });
        return mongoose.model("systemlog", systemLogSchema);
    }
}

module.exports = new SystemLog;
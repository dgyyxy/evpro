/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const config = require(path.join(process.cwd(), "server/config"));
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const handler = require(path.join(process.cwd(), "server/service/remote/handler"));
trouter.get("/findLatestDeviceUploadConfigs", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.findLatestDeviceUploadConfigs(reqData);
    let _body = {};
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            datas: result.data
        };
    }else{
        _body = {
            status: 0,
            datas: result.errorMessage
        };
    }
    _this.body = _body;
});

trouter.get("/searchSendBatchConfigsHistory", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.searchSendBatchConfigsHistory(reqData);
    let _body = {};
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            datas: result.datas,
            totalCount: result.totalCount,
            pageIndex: result.pageIndex,
            pageCount: result.pageCount,
            pageSize: result.pageSize
        }
    }else{
        _body = {
            status: 0,
            errorMessage: result.errorMessage
        }
    }
    _this.body = _body;
});

trouter.get("/findSendBatchConfigs", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.findSendBatchConfigs(reqData);
    let _body = {};
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            datas: result.data
        };
    }else{
        _body = {
            status: 0,
            datas: result.errorMessage
        };
    }
    _this.body = _body;
});

trouter.get("/searchDeviceConfigsHistory", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.searchDeviceConfigsHistory(reqData);
    let _body = {};
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            datas: result.datas,
            totalCount: result.totalCount,
            pageIndex: result.pageIndex,
            pageCount: result.pageCount,
            pageSize: result.pageSize
        }
    }else{
        _body = {
            status: 0,
            errorMessage: result.errorMessage
        }
    }
    _this.body = _body;
});

trouter.post("/sendBatchConfigs", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.sendBatchConfigs(reqData);
    // console.log('result:========>', result)
    let _body = {};
    if(result.status == "SUCCEED"){
        _body = {
            status: 1
        };
    }else{
        _body = {
            status: 0,
            datas: result.errorMessage
        };
    }
    _this.body = _body;
});

trouter.get("/findConfigs", async function(ctx) {
    let _this = ctx;
    let reqData = {
        version: "v1.0",
        versionName: "cherry"
    };
    let result = await handler.findConfigs(reqData);
    let _body = {};
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            datas: result.data
        };
    }else{
        _body = {
            status: 0,
            datas: result.errorMessage
        };
    }
    _this.body = _body;
});

trouter.post("/sendCommand", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.sendCommand(reqData);
    let _body = {};
    if(result.status == "SUCCEED"){
        _body = {
            status: 1
        };
    }else{
        _body = {
            status: 0,
            datas: result.errorMessage
        };
    }
    _this.body = _body;
});
/*远程升级*/
trouter.post("/remoteUpdating", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;

    let reqDataQ = {
        "vin":reqData.vin
    };

    delete reqData.vin;

    let reqDataB= reqData;
    
    let result = await handler.remoteUpdating(reqDataQ,reqDataB);
    let _body = {};

    if(result.status == "SUCCEED"){
        _body = {
            status: 1 ,
            data : result.data
        };
    }else{
        _body = {
            status: 0,
            datas: result.errorMessage
        };
    }
    _this.body = _body;
});

module.exports = trouter;
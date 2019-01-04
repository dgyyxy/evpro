/**
 * Created by yong.liu on 2016/9/21.
 */
"use strict";
const path    = require("path");
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const position = require(path.join(process.cwd(), "server/service/location/position/handler"));

trouter.get("/findAllLatestLocationList",async function(ctx, next) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await position.findAllLatestLocationList(reqData);
    let _body = {
        status: 0,
        data: {}
    };
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            data: result.datas
        }
    }
    _this.body = _body;
});

trouter.post("/getUnreadMessageCount",async function(ctx, next) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await position.getUnreadMessageCount(reqData);
    let _body = {
        status: 0,
        data: {}
    };
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            data: result.data
        }
    }
    _this.body = _body;
});

trouter.post("/getVehicleListByKeyword",async function(ctx, next){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await position.getVehicleListByKeyword(reqData);
    let _body = {
        status: 0,
        data: {}
    };
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            pageCount: result.pageCount,
            pageSize: result.pageSize,
            pageIndex: result.pageIndex,
            totalCount: result.totalCount,
            data: result.datas
        }
    }
    _this.body = _body;
});

trouter.get("/getVehInfoList",async function (ctx, next){
    let params = ctx.request.query,
        result;
    result = await position.getVehInfoList(params);
    ctx.body = result;
});

trouter.get("/findLatest",async function(ctx, next) {
    let result;
    result = await position.findLatest(ctx.request.query);
    ctx.body = result;
});

trouter.get("/findAllLocationList",async function(ctx, next) {
    let result;
    result = await position.findAllLocationList(ctx.request.query);
    ctx.body = result;
});

module.exports = trouter;
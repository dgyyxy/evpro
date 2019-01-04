"use strict";

const path = require("path");
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const service = require(path.join(process.cwd(), "server/service/mapMonitor/handler"));


//获取车辆位置信息
trouter.get("/getLocationVehicleList",async function(ctx,next){
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await service.getLocationVehicleList(reqData);
    let _body = {
        status: 0,
        data: {},
        pageCount: 0,
        pageSize: 10,
        pageIndex: 1,
        totalCount: 0,
    };
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            data: result.datas,
            pageCount: result.pageCount,
            pageSize: result.pageSize,
            pageIndex: result.pageIndex,
            totalCount: result.totalCount
        }
    }
    _this.body = _body;
});

/*
trouter.get("/getAlertDeviceTotal",async function(ctx,next){
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await service.getAlertDeviceTotal(reqData);
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
});*/

//获取在线车辆信息
trouter.get("/getLocationVehicleOnline",async function(ctx,next){
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await service.getLocationVehicleOnline(reqData);
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

trouter.get("/findStatusHistoryByTimeRange",async function(ctx,next){
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await service.findStatusHistoryByTimeRange(reqData);
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

module.exports = trouter;
/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const handler = require(path.join(process.cwd(), "server/service/vehicleStatus/handler"));

trouter.get("/getVehInfoList", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getVehInfoList(reqData);
    _this.body = result;
});

trouter.get("/findAlertAlarmHistoryByTimeRange", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.findAlertAlarmHistoryByTimeRange(reqData);
    _this.body = result;
});

trouter.get("/getAlertDeviceTotal", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getAlertDeviceTotal(reqData);
    _this.body = result;
});


trouter.get("/findStatusHistoryByTimeRange", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.findStatusHistoryByTimeRange(reqData);
    _this.body = result;
});

trouter.get("/getAlertStat", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getAlertStat(reqData);
    _this.body = result;
});

trouter.get("/getAllCategories", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getAllCategories(reqData);
    _this.body = result;
});

trouter.get("/getAllAlertLevel", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getAllAlertLevel(reqData);
    _this.body = result;
});

trouter.get("/getGlobalStatusesByCategory", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getGlobalStatusesByCategory(reqData);
    _this.body = result;
});

trouter.get("/getLatestStatusByVehicleModelType", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getLatestStatusByVehicleModelType(reqData);
    _this.body = result;
});

trouter.get("/getLatestStatusByGroup", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getLatestStatusByGroup(reqData);
    _this.body = result;
});

trouter.get("/getAlertTotalByHandleState", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getAlertTotalByHandleState(reqData);
    //数据里时间戳有误
    _this.body = result;
});

trouter.get("/findAlertAlarmLogs", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.findAlertAlarmLogs(reqData);
    //数据里时间戳有误
    _this.body = result;
});

trouter.post("/handleAlertAlarm", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    let body = _this.request.body;
    reqData['token'] = _this.session.token;
    let result = await handler.handleAlertAlarm(reqData,body);
    //数据里时间戳有误
    _this.body = result;
});

trouter.get("/findStatusHistoryItems", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.findStatusHistoryItems(reqData);
    _this.body = result;
});

trouter.get("/getStatusByVehicleModelType", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getStatusByVehicleModelType(reqData);
    _this.body = result;
});

trouter.get("/getStatusByGroup", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getStatusByGroup(reqData);
    _this.body = result;
});

trouter.post("/findFaultReport", async function(ctx,next) {
    let _this = ctx;
    let reqData = _this.request.query;
    let body = _this.request.body;
    reqData['token'] = _this.session.token;
    let result = await handler.findFaultReport(reqData,body);
    //数据里时间戳有误
    _this.body = result;
});

module.exports = trouter;
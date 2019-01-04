/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const handler = require(path.join(process.cwd(), "server/service/vehicle/Tservice/handler"));

trouter.get("/queryVehsByUser", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.queryVehsByUser(reqData);
    _this.body = result;
});

trouter.get("/checkVinAndEng", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.checkVinAndEng(reqData);
    _this.body = result;
});

trouter.get("/verif-code", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.verifCode(reqData);
    _this.body = result;
});

trouter.get("/checkCode", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.checkCode(reqData);
    _this.body = result;
});

trouter.post("/openTService", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.openTService(reqData);
    _this.body = result;
});

trouter.get("/closeTService", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.closeTService(reqData);
    _this.body = result;
});

trouter.get("/queryTService", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.queryTService(reqData);
    _this.body = result;
});

trouter.post("/updateTbox", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateTbox(reqData);
    _this.body = result;
});

trouter.get("/getVehDealerById", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getVehDealerById(reqData);
    _this.body = result;
});

trouter.get("/quertTBoxVehicle", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.quertTBoxVehicle(reqData);
    _this.body = result;
});

module.exports = trouter;
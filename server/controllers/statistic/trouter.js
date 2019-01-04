/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const os = require("os");
const config = require(path.join(process.cwd(), "server/config"));
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const handler = require(path.join(process.cwd(), "server/service/statistic/handler"));
const { uploadFile } = require('../../util/upload');
trouter.post("/findReports", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.findReports(reqData);
    _this.body = result;
});
trouter.post("/findEquipReports", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.findEquipReports(reqData);
    _this.body = result;
});

trouter.post("/findSimInfoReports", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.findSimInfoReports(reqData);
    _this.body = result;
});
trouter.post("/findOwenerInfoReports", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.findOwenerInfoReports(reqData);
    _this.body = result;
});

module.exports = trouter;
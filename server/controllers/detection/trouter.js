"use strict";
const path = require("path");
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const service = require(path.join(process.cwd(), "server/service/detection/handler"));

/**
 * 车辆产线检测状态列表
 */
trouter.get("/findVehicleDetectionList", async function (ctx, next) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await service.findVehicleDetectionList(reqData);
    let _body = {
        status: 0,
        data: {}
    };
    if (result.status == "SUCCEED") {
        _body = {
            status: 1,
            data: result.datas,
            totalCount:result.totalCount
        }
    }
    _this.body = _body;
});

trouter.get("/queryDataListWithHbase", async function (ctx, next) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await service.finQueryDataListWithHbase(reqData);
    let _body = {
        status: 0,
        data: {}
    };
    if (result.status == "SUCCEED") {
        _body = {
            status: 1,
            data: result.datas
        }
    }
    _this.body = _body;
});

trouter.get("/findVehicleDetectionData",async function (ctx, next) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await service.findVehicleDetectionData(reqData);
    let _body = {
        data: {}
    };
    if (result.status == "SUCCEED") {
        _body = {
            data: result.data
        }
    }
    _this.body = _body;
})



module.exports = trouter;
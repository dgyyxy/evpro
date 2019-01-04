"use strict";

const path = require("path");
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const service = require(path.join(process.cwd(), "server/service/afterSaleMgt/handler"));

trouter.get("/queryVehDeviceInfoList", async function (ctx, next) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await service.queryVehDeviceInfoList( reqData );
    let _body = {
        status: 0,
        data: {}
    };
    if (result.status == "SUCCEED") {
        _body = {
            status: 1,
            data: result.datas,
            pageIndex:result.pageIndex,
            pageCount:result.pageCount,
            pageSize:result.pageSize,
            totalCount:result.totalCount
        }
    }
    _this.body = _body;
});

module.exports = trouter;
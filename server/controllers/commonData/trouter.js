"use strict";

const path = require("path");
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const service = require(path.join(process.cwd(), "server/service/commonData/handler"));

//获取省市级联
trouter.get("/findProvincesAndCities", async function (ctx, next) {
    let _this = ctx;
    let result = await service.findProvincesAndCities();
    let _body = {
        status: 0,
        data: {}
    };
    if (result.status == "SUCCEED") {
        _body = {
            status: 1,
            data: result.data
        }
    }
    _this.body = _body;
});

module.exports = trouter;
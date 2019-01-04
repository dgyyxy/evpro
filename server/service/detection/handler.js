"use strict";
const path      = require("path");
const request   = require(path.join(process.cwd(), "server/util/request"));
const signUrl   = require(path.join(process.cwd(), "server/util/signurl"));

class Detection {

    constructor(){

    }

    /**
     * 查询车辆检测上报状态
     * @param reqData
     * @returns {*}
     */
    findVehicleDetectionList(reqData){
        let url = signUrl("detection", reqData, "findAllUploadDataListWithPage");
        return request.transfer({uri: url, method: "GET"});
    }

    findVehicleDetectionData(reqData){
        let url = signUrl("detection", reqData, "queryDetailByContent");
        return request.transfer({uri: url, method: "GET"});
    }

    finQueryDataListWithHbase(reqData){
        let url = signUrl("detection", reqData, "queryDataListWithHbase");
        return request.transfer({uri: url, method: "GET"});
    }
}

module.exports = exports = new Detection;
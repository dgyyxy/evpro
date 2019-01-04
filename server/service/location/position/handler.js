"use strict";

const path      = require("path");
const request   = require(path.join(process.cwd(), "server/util/request"));
const signUrl   = require(path.join(process.cwd(), "server/util/signurl"));

/**
 * 构造函数
 * @constructor
 */
function Position(){}

/**
 * 根据关键字获取车辆列表
 * @param params
 * @returns {*}
 */
Position.prototype.getVehicleListByKeyword = function (params){
    let url = signUrl("vehicle", params, "getVehicleListByKeyword");
    return request.transfer({uri: url, method: "GET"});
}

Position.prototype.getUnreadMessageCount = function (params){
    let url = signUrl("message", params, "getUnreadMessageCount");
    return request.transfer({uri: url, method: "GET"});
}

/**
 * 获取车辆分页列表
 * @param params
 */
Position.prototype.getVehInfoList = function (params){
    let url = signUrl("vehicle/vehicle",params,"getVehInfoList");
    return request.transfer({uri: url, method: "GET"});
};

Position.prototype.findAllLatestLocationList = function (params){
    let url = signUrl("location", {pageIndex: 1, pageSize: 1000},"findAllLatestLocationList");
    return request.transfer({uri: url, method: "GET"});
};

/**
 * 得到最新车辆位置
 * @param params
 * @returns {*}
 */
Position.prototype.findLatest = function (params){
    let url = signUrl("location", params,"findLatest");
    return request.transfer({uri: url, method: "GET"});
};

/**
 * 查询指定设备的最新位置信息
 * @param param {deviceId: String,deviceType:[VEHICLE]}
 */
// Position.prototype.findAllLocationList = function (param){
//     let url = signUrl("location", param,"findAllLocationList");
//     return request.transfer({uri: url, method: "GET"});
// };

Position.prototype.findAllLocationList = function (param){
    let url = signUrl("location", param,"findAllLocationListWithPage");
    return request.transfer({uri: url, method: "GET"});
};

module.exports = exports = new Position;
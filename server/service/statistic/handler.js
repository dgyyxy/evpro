"use strict";
const path = require("path");
const fs = require("fs");
const request = require(path.join(process.cwd(), "server/util/request"));
const signUrl = require(path.join(process.cwd(), "server/util/signurl"));
function statisticReport(){}

statisticReport.prototype.findReports = function(reqInfo) {
    let url = signUrl("statisticReport/rePort/vehBase", reqInfo, "find");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqInfo
    });
};
statisticReport.prototype.findEquipReports = function(reqInfo) {
    let url = signUrl("statisticReport/rePort/device", reqInfo, "find");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqInfo
    });
};
statisticReport.prototype.findSimInfoReports = function(reqInfo) {
    let url = signUrl("statisticReport/rePort/sim", reqInfo, "find");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqInfo
    });
};
statisticReport.prototype.findOwenerInfoReports = function(reqInfo) {
    let url = signUrl("statisticReport/rePort/owner", reqInfo, "find");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqInfo
    });
};

module.exports = exports = new statisticReport;
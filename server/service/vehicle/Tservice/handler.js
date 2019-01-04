/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const request = require(path.join(process.cwd(), "server/util/request"));
const signUrl = require(path.join(process.cwd(), "server/util/signurl"));

function Tservice() {
}

Tservice.prototype.queryVehsByUser = function (reqInfo) {
    let url = signUrl("vehicle/tservice", reqInfo, "queryVehsByUser");
    return request.transfer({uri: url, method: "GET"});
};

Tservice.prototype.checkVinAndEng = function (reqInfo) {
    let url = signUrl("vehicle/tservice", reqInfo, "checkVinAndEng");
    return request.transfer({uri: url, method: "GET"});
};

Tservice.prototype.verifCode = function (reqInfo) {
    let url = signUrl("verify", reqInfo, "verif-code");
    return request.transfer({uri: url, method: "GET"});
};

Tservice.prototype.checkCode = function (reqInfo) {
    let url = signUrl("verify/verif-code", reqInfo, "checkCode");
    return request.transfer({uri: url, method: "GET"});
};

Tservice.prototype.openTService = function (reqInfo) {
    let url = signUrl("vehicle/tservice", {}, "openTService");
    return request.transfer({uri: url, method: "POST",formData:reqInfo});
};

Tservice.prototype.closeTService = function (reqInfo) {
    let url = signUrl("vehicle/tservice", reqInfo, "closeTService");
    return request.transfer({uri: url, method: "GET"});
};

Tservice.prototype.queryTService = function (reqInfo) {
    let url = signUrl("vehicle/tservice", reqInfo, "queryTService");
    return request.transfer({uri: url, method: "GET"});
};

Tservice.prototype.updateTbox = function (reqInfo) {
    let url = signUrl("vehicle/tservice", {}, "updateTbox");
    return request.transfer({uri: url, method: "POST",formData:reqInfo});
};

Tservice.prototype.getVehDealerById = function (reqInfo) {
    let url = signUrl("vehicle/dealer", reqInfo, "getVehDealerById");
    return request.transfer({uri: url, method: "GET"});
};

Tservice.prototype.quertTBoxVehicle = function (reqInfo) {
    let url = signUrl("vehicle/tservice", reqInfo, "quertTBoxVehicle");
    return request.transfer({uri: url, method: "GET"});
};

module.exports = new Tservice;
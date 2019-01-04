"use strict";

const path = require("path");
const request = require(path.join(process.cwd(), "server/util/request"));
const signUrl = require(path.join(process.cwd(), "server/util/signurl"));

class AfterSaleMgt {
    constructor() {

    }

    async queryVehDeviceInfoList(reqData) {
        let url = signUrl("device", reqData, "queryVehDeviceInfoList");
    	return request.transfer({uri: url, method: "GET"});
    }
}

module.exports = exports = new AfterSaleMgt;
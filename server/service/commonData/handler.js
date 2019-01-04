"use strict";

const path = require("path");
const request = require(path.join(process.cwd(), "server/util/request"));
const signUrl = require(path.join(process.cwd(), "server/util/signurl"));

class CommonData {
    constructor() {

    }

    async findProvincesAndCities() {
        let url = signUrl("commonData/division", {keywords: "中国", level: "COUNTRY", sub: 2, boundary: false}, "find");
        return request.transfer({uri: url, method: "GET"});
    }
}

module.exports = exports = new CommonData;
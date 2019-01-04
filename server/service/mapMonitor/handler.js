"use strict";

const path = require("path");
const request = require(path.join(process.cwd(), "server/util/request"));
const signUrl = require(path.join(process.cwd(), "server/util/signurl"));

class MapMonitor{

    constructor(){

    }

    async getLocationVehicleList(params){
        let url = signUrl("vehicle/vehicle",params,"getLocationVehicleList");
        return request.transfer({uri: url, method: "GET"});
    }

    /*async getAlertDeviceTotal(params){
        let url = signUrl("status", params, "getAlertDeviceTotal");
        return request.transfer({uri: url, method: "GET"});
    }*/

    async getLocationVehicleOnline(params){
        var url = signUrl("vehicle/vehicle",params,"getLocationVehicleOnline");
        return request.transfer({uri: url, method: "GET"});
    }

    async findStatusHistoryByTimeRange(params){
        let url = signUrl("status", params, "findStatusHistoryByTimeRange");
        return request.transfer({uri: url, method: "GET"});
    }

}

module.exports = new MapMonitor();
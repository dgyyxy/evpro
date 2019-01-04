/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const request = require(path.join(process.cwd(), "server/util/request"));
const signUrl = require(path.join(process.cwd(), "server/util/signurl"));

class Remote{
    constructor(){

    }
    findLatestDeviceUploadConfigs(reqData){
        let url = signUrl("remote", reqData, "findLatestDeviceUploadConfigs");
        return request.transfer({uri: url, method: "GET"});
    }
    searchSendBatchConfigsHistory(reqData){
        let url = signUrl("remote", reqData, "searchSendBatchConfigsHistory");
        return request.transfer({uri: url, method: "GET"});
    }
    findSendBatchConfigs(reqData){
        let url = signUrl("remote", reqData, "findSendBatchConfigs");
        return request.transfer({uri: url, method: "GET"});
    }
    searchDeviceConfigsHistory(reqData){
        let url = signUrl("remote", reqData, "searchDeviceConfigsHistory");
        return request.transfer({uri: url, method: "GET"});
    }
    sendBatchConfigs(reqData){
        let url = signUrl("remote", {}, "sendBatchConfigs");
        return request.transfer({uri: url, method: "POST", body: reqData});
    }
    findConfigs(reqData){
        let url = signUrl("remote", reqData, "findConfigs");
        return request.transfer({uri: url, method: "GET"});
    }

    /**
     * 下发远程指令
     */
    sendCommand(reqData) {
        let url = signUrl("remote", {}, "sendCommand");
        return request.transfer({uri: url, method: "POST", body: reqData.params, headers: { appId: '999' }});
    }

    /*远程升级*/
    remoteUpdating(reqDataQ,reqDataB){
        let url = signUrl("evgb-gateway", reqDataQ, "remoteUpdating");
        return request.transfer({uri: url, method: "POST", body: reqDataB});
    }
}

module.exports = exports = new Remote;
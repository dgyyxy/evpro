/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const request = require(path.join(process.cwd(), "server/util/request"));
const signUrl = require(path.join(process.cwd(), "server/util/signurl"));

function VehicleStatus(){}

VehicleStatus.prototype.constructor = VehicleStatus;

VehicleStatus.prototype.getVehInfoList = function(reqInfo){
    let url = signUrl("vehicle/vehicle", reqInfo, "getVehInfoList");
    return request.transfer({uri: url, method: "GET"});
};

VehicleStatus.prototype.findAlertAlarmHistoryByTimeRange = function(reqInfo){
    let url = signUrl("status", reqInfo, "findAlertAlarmHistoryByTimeRange");
    return request.transfer({uri: url, method: "GET"});
};

VehicleStatus.prototype.getAlertDeviceTotal = function(reqInfo){
    let url = signUrl("status", reqInfo, "getAlertDeviceTotal");
    return request.transfer({uri: url, method: "GET"});
};

VehicleStatus.prototype.getAlertStat = function(reqInfo){
    let url = signUrl("status", reqInfo, "getAlertStat");
    return request.transfer({uri: url, method: "GET"});
};

VehicleStatus.prototype.getAllCategories = function(reqInfo){
    let url = signUrl("status", reqInfo, "getAllCategories");
    return request.transfer({uri: url, method: "GET"});
};

VehicleStatus.prototype.getAllAlertLevel = function(reqInfo){
    let url = signUrl("status", reqInfo, "getAllAlertLevel");
    return request.transfer({uri: url, method: "GET"});
};

VehicleStatus.prototype.getAlertTotalByHandleState = function(reqInfo){
    let url = signUrl("status", reqInfo, "getAlertTotalByHandleState");
    return request.transfer({uri: url, method: "GET"});
};

VehicleStatus.prototype.findAlertAlarmLogs = function(reqInfo){
    let url = signUrl("status", reqInfo, "findAlertAlarmLogs");
    return request.transfer({uri: url, method: "GET"});
};

VehicleStatus.prototype.handleAlertAlarm = function(reqInfo, body){
    let url = signUrl("status", reqInfo, "handleAlertAlarm");
    return request.transfer({uri: url, method: "POST",body: body});
};

VehicleStatus.prototype.findStatusHistoryByTimeRange = async function(reqInfo){
    let url = signUrl("status", reqInfo, "findStatusHistoryByTimeRange");
    let result = await request.transfer({uri: url, method: "GET"});
    if(result.datas.length > 0) {
        let datas = result.datas;
        let newDatas = [];
        for (let i in datas) {
            let obj = {};
            obj.uploadTime = datas[i].uploadTime;
            obj.statusId = datas[i].statusId;
            newDatas.push(obj);
        }
        result.datas = newDatas;
    }
    return new Promise((resolve)=>{
        resolve(result);
    })
};

VehicleStatus.prototype.getGlobalStatusesByCategory = async function(reqInfo){
    let url = signUrl("status", reqInfo, "getGlobalStatusesByCategory");
    let result = await request.transfer({uri: url, method: "GET"});
    if(result.data) {
        let datas = result.data;
        let newDatas = [];
        for (let data of datas) {
            newDatas.push(String(data.code));
        }
        result.data = newDatas;
    }
    return new Promise((resolve)=>{
        resolve(result);
    });
};

VehicleStatus.prototype.getLatestStatusByVehicleModelType = async function(reqInfo){
    let url = signUrl("status", reqInfo, "getLatestStatusByVehicleModelType");
    let result = await request.transfer({uri: url, method: "GET"});
    if(result.data) {
        //处理车辆概况数据顺序
        handleVehicleModelType(result);
    }
    return new Promise((resolve)=>{
        resolve(result);
    });
};

VehicleStatus.prototype.getLatestStatusByGroup = async function(reqInfo){
    let url = signUrl("status", reqInfo, "getLatestStatusByGroup");
    let result = await request.transfer({uri: url, method: "GET"});
    if(result.data) {
        //处理车辆详细信息数据格式
        handleGroup(result);
    }
    return new Promise((resolve)=>{
        resolve(result);
    });
};

VehicleStatus.prototype.findStatusHistoryItems = async function(reqInfo){
    let url = signUrl("status", reqInfo, "findStatusHistoryItems");
    let result = await request.transfer({uri: url, method: "GET"});
    if(result.data) {
        //处理短时间速度和电压的数据
        let data = result.data;
        let speedArr = [],
            voltageArr = [],
            timeArr = [];
        for (let dataItem of data) {
            let time = new Date(dataItem.uploadTime).toLocaleTimeString();
            let speed = "",
                voltage = "";
            dataItem.items.forEach(function (item) {
                if (item.code === "1001004") {
                    speed = item.value
                }
                if (item.code === "1008002-1") {
                    voltage = item.value
                }
            });
            timeArr.unshift(time);
            speedArr.unshift(speed);
            voltageArr.unshift(voltage);

        }
        let newData = {
            uploadTimeArr: timeArr,
            speedArr: speedArr,
            voltageArr: voltageArr
        };
        result.data = newData;
    }
    return new Promise((resolve)=>{
        resolve(result);
    });
};

VehicleStatus.prototype.getStatusByVehicleModelType = async function(reqInfo){
    let url = signUrl("status", reqInfo, "getStatusByVehicleModelType");
    let result = await request.transfer({uri: url, method: "GET"});
    if(result.data) {
        //处理车辆概况数据顺序
        handleVehicleModelType(result);
    }
    return new Promise((resolve)=>{
        resolve(result);
    });
};

VehicleStatus.prototype.getStatusByGroup = async function(reqInfo){
    let url = signUrl("status", reqInfo, "getStatusByGroup");
    let result = await request.transfer({uri: url, method: "GET"});
    //处理车辆详细信息数据格式
    if(result.data){
        handleGroup(result);
    }
    return new Promise((resolve)=>{
        resolve(result);
    });
};

VehicleStatus.prototype.findFaultReport = async function(reqInfo, body){
    let url = signUrl("statistic-report", reqInfo, "findReport");
    let result = await request.transfer({uri: url, method: "POST",body: body});
    if(result.data.data){
        let datas = result.data.data;
        let totalArr = [],
            chargingArr = [],
            driveArr = [],
            motorArr = [],
            otherArr = [],
            times = [];
        for(let data of datas){
            totalArr.push(data.total);
            chargingArr.push(data.items["1007021"].total);
            driveArr.push(data.items["1007024"].total);
            motorArr.push(data.items["1007026"].total);
            otherArr.push(data.items["1007028"].total);
            times.push(new Date(data.statTime).toLocaleString());
        }
        result.data.data = {};
        result.data.data.totalArr = totalArr;
        result.data.data.chargingArr = chargingArr;
        result.data.data.driveArr = driveArr;
        result.data.data.motorArr = motorArr;
        result.data.data.otherArr = otherArr;
        result.data.data.times = times;
    }
    return new Promise((resolve)=>{
        resolve(result);
    });
};

//处理车辆概况数据顺序
function handleVehicleModelType(result){
    let nullObj = {value :'', unit:''};
    let newItemsObj = {
        one: nullObj,
        two: nullObj,
        three: nullObj,
        four: nullObj,
        five: nullObj,
        six: nullObj
    };
    let items = result.data.items;
    for(let i = 0;i < items.length;i++){
        switch (items[i].code){
            case '1002002':
                newItemsObj.one = items[i];
                break;
            case '1006009':
                newItemsObj.two = items[i];
                break;
            case '1006003':
                newItemsObj.three = items[i];
                break;
            case '1002004':
                newItemsObj.four = items[i];
                break;
            case '1006012':
                newItemsObj.five = items[i];
                break;
            case '1006006':
                newItemsObj.six = items[i];
                break;
        }
    }
    result.data.items = newItemsObj;
}

//处理车辆详细信息数据格式
function handleGroup(result){
    let groupKeyItems = result.data.groupKeyItems;
    let speed = 0,
        soc = 0,
        nullObj = {code: 0};
    for(let groupKeyItem of groupKeyItems){
        groupKeyItem.newItems = [];
        //为不满6列的数据填充
        let mo = groupKeyItem.items.length % 6;
        let cha = 6 - mo;
        if(mo !== 0){
            for(let n = 0;n < cha;n++){
                groupKeyItem.items.push(nullObj);
            }
        }

        //提取速度与soc
        for(let item of groupKeyItem.items){
            if(item.code === '1001004'){
                speed = item.value;
            }
            if(item.code === '1001008'){
                soc = item.value;
            }
        }

        let index = 0;
        while (index < groupKeyItem.items.length){
            groupKeyItem.newItems.push(groupKeyItem.items.slice(index, index += 6));
        }
        groupKeyItem.items = null;
    }
    result.data.speed = speed;
    result.data.soc = soc;
}

module.exports = exports = new VehicleStatus;
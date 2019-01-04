/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const os = require("os");
const config = require(path.join(process.cwd(), "server/config"));
const trouter = require(path.join(process.cwd(), "server/middleware/trouter"));
const handler = require(path.join(process.cwd(), "server/service/vehicle/vehicle/handler"));
const { uploadFile } = require('../../../util/vehicle/upload');

trouter.get("/getVehList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    reqData['token'] = _this.session.token;
    let result = await handler.getVehList(reqData);
    _this.body = result;
});

trouter.get("/getVehModelList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehModelList(reqData);
    _this.body = result;
});

trouter.get("/getVehSeriesList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehSeriesList(reqData);
    _this.body = result;
});

trouter.get("/getVehBrandList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehBrandList(reqData);
    _this.body = result;
});

trouter.get("/getVehDealerList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehDealerList(reqData);
    _this.body = result;
});

trouter.get("/getVehDealerByName", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehDealerByName(reqData);
    _this.body = result;
});

trouter.get("/getVehDeviceList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehDeviceList(reqData);
    _this.body = result;
});

trouter.get("/getDeviceChangeInfoList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getDeviceChangeInfoList(reqData);
    _this.body = result;
});

trouter.get("/getVehSimList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehSimList(reqData);
    _this.body = result;
});

trouter.get("/getVehColorList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehColorList(reqData);
    _this.body = result;
});

trouter.get("/getVehById", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehById(reqData);
    _this.body = result;
});

trouter.get("/getVehAttribute", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehAttribute(reqData);
    _this.body = result;
});

trouter.get("/getVehDeviceModelList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehDeviceModelList(reqData);
    _this.body = result;
});

trouter.post("/addOrUpdateVeh", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addOrUpdateVeh(reqData);
    _this.body = result;
});

trouter.post("/addVehModel", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addVehModel(reqData);
    _this.body = result;
});

trouter.post("/updateVehModel", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateVehModel(reqData);
    _this.body = result;
});

trouter.post("/addVehColor", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addVehColor(reqData);
    _this.body = result;
});

trouter.post("/updateVehColor", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateVehColor(reqData);
    _this.body = result;
});

trouter.post("/addVehSeries", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addVehSeries(reqData);
    _this.body = result;
});

trouter.post("/updateVehSeries", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateVehSeries(reqData);
    _this.body = result;
});

trouter.post("/addVehBrand", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addVehBrand(reqData);
    _this.body = result;
});

trouter.post("/updateVehBrand", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateVehBrand(reqData);
    _this.body = result;
});

trouter.post("/addOrUpdateVehDealer", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addOrUpdateVehDealer(reqData);
    _this.body = result;
});

trouter.post("/addOrUpdateVehDevice", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addOrUpdateVehDevice(reqData);
    _this.body = result;
});

trouter.post("/updateVehDevice", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateVehDevice(reqData);
    _this.body = result;
});

trouter.post("/addVehDevice", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addVehDevice(reqData);
    _this.body = result;
});

trouter.post("/addOrUpdateVehSim", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addOrUpdateVehSim(reqData);
    _this.body = result;
});

trouter.post("/deleteVehModel", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.deleteVehModel(reqData);
    _this.body = result;
});

trouter.post("/deleteVehColor", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.deleteVehColor(reqData);
    _this.body = result;
});

trouter.post("/deleteVehSeries", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.deleteVehSeries(reqData);
    _this.body = result;
});

trouter.post("/deleteVehBrand", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.deleteVehBrand(reqData);
    _this.body = result;
});

trouter.get("/getVehOwner", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehOwner(reqData);
    _this.body = result;
});

trouter.get("/getVehOwnerList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehOwnerList(reqData);
    _this.body = result;
});

trouter.post("/addOrUpdateOwner", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addOrUpdateOwner(reqData);
    _this.body = result;
});

trouter.get("/getVehSimInfoList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehSimInfoList(reqData);
    _this.body = result;
});

trouter.post("/addVehSim", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addVehSim(reqData);
    _this.body = result;
});

trouter.post("/updateVehSim", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateVehSim(reqData);
    _this.body = result;
});

trouter.get("/getVehDeviceInfoList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehDeviceInfoList(reqData);
    _this.body = result;
});

trouter.post("/bindSimForDev", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.bindSimForDev(reqData);
    _this.body = result;
});

trouter.get("/getVehInfoList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehInfoList(reqData);
    _this.body = result;
});

trouter.get("/getDeviceListByvehVin", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getDeviceListByvehVin(reqData);
    _this.body = result;
});

trouter.post("/unBindDevForVehicle", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.unBindDevForVehicle(reqData);
    _this.body = result;
});

trouter.post("/bindDevForVehicle", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.bindDevForVehicle(reqData);
    _this.body = result;
});

trouter.post("/addVeh", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addVeh(reqData);
    _this.body = result;
});

trouter.post("/updateVeh", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateVeh(reqData);
    _this.body = result;
});

trouter.post("/writeOff", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.writeOff(reqData);
    _this.body = result;
});

trouter.post("/addOwner", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addOwner(reqData);
    _this.body = result;
});

trouter.post("/updateOwner", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateOwner(reqData);
    _this.body = result;
});

trouter.get("/getVehOwnerByIdNumber", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehOwnerByIdNumber(reqData);
    _this.body = result;
});

trouter.get("/getVehDeviceByType", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehDeviceByType(reqData);
    _this.body = result;
});

trouter.post("/unbindOwner", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.unbindOwner(reqData);
    _this.body = result;
});

trouter.post("/bindOwner", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let vehicleSaleInfo = reqData.vehicleSaleInfo;
    let ownerExist = reqData.ownerExist;
    let result = await handler.bindOwner(vehicleSaleInfo,ownerExist);
    _this.body = result;
});

trouter.get("/getVehByVin", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehByVin(reqData);
    _this.body = result;
});

trouter.get("/getTelcomCarrier", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getTelcomCarrier(reqData);
    _this.body = result;
});

trouter.post("/unbindSimForDev", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.unbindSimForDev(reqData);
    _this.body = result;
});

trouter.get("/getVehSimByType", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehSimByType(reqData);
    _this.body = result;
});

trouter.post("/addDeviceManufacturer", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addDeviceManufacturer(reqData);
    _this.body = result;
});

trouter.post("/addDeviceModel", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addDeviceModel(reqData);
    _this.body = result;
});

trouter.post("/delDeviceManufacturer", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.delDeviceManufacturer(reqData);
    _this.body = result;
});

trouter.post("/delDeviceModel", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.delDeviceModel(reqData);
    _this.body = result;
});

trouter.post("/updateDeviceManufacturer", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateDeviceManufacturer(reqData);
    _this.body = result;
});

trouter.post("/updateDeviceModel", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateDeviceModel(reqData);
    _this.body = result;
});

trouter.get("/getDeviceManufacturer", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getDeviceManufacturer(reqData);
    _this.body = result;
});

trouter.get("/getDeviceModel", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getDeviceModel(reqData);
    _this.body = result;
});

trouter.get("/getSimPackageList", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getSimPackageList(reqData);
    _this.body = result;
});

trouter.get("/getVehModelType", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehModelType(reqData);
    _this.body = result;
});

trouter.get("/getVehTagTypeAll", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehTagTypeAll(reqData);
    _this.body = result;
});

trouter.get("/getVehSeriesById", async function(ctx) {
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehSeriesById(reqData);
    _this.body = result;
});

trouter.post("/addVehDealer", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.addVehDealer(reqData);
    _this.body = result;
});

trouter.post("/updateVehDealer", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.updateVehDealer(reqData);
    _this.body = result;
});

trouter.post("/withdrawNetWork", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.withdrawNetWork(reqData);
    _this.body = result;
});

trouter.post("/importSim", async function(ctx){
    let _this = ctx;
    let serverFilePath = path.join(os.tmpdir(),path.sep + config.appinfo.appkey);
    let uploadResult;
    try{
        uploadResult = await uploadFile( _this, {
            fileType: 'album',
            path: serverFilePath
        });
    }catch (e){
        console.log(e);
        _this.body = e;
        return;
    }
    let result;
    if(uploadResult.status){
        result = await handler.importSim(uploadResult.path, uploadResult.fileName);
    }
    _this.body = result;
});

trouter.post("/importDev", async function(ctx){
    let _this = ctx;
    let serverFilePath = path.join(os.tmpdir(),path.sep + config.appinfo.appkey);
    let uploadResult;
    try{
        uploadResult = await uploadFile( _this, {
            fileType: 'album',
            path: serverFilePath
        });
    }catch (e){
        console.log(e);
        _this.body = e;
        return;
    }
    let result;
    if(uploadResult.status){
        result = await handler.importDev(uploadResult.path, uploadResult.fileName);
    }
    _this.body = result;
});

trouter.post("/importVehTag", async function(ctx){
    console.log('-----------------------------------'+ctx);
    let _this = ctx;
    let serverFilePath = path.join(os.tmpdir(),path.sep + config.appinfo.appkey);
    let uploadResult;
    try{
        uploadResult = await uploadFile( _this, {
            fileType: 'album',
            path: serverFilePath
        });
    }catch (e){
        console.log(e);
        _this.body = e;
        return;
    }
    let result;
    if(uploadResult.status){
        result = await handler.importVehTag(uploadResult.path, uploadResult.fileName);
    }
    _this.body = result;
});

trouter.post("/importVeh", async function(ctx){
    let _this = ctx;
    let serverFilePath = path.join(os.tmpdir(),path.sep + config.appinfo.appkey);
    let uploadResult;
    try{
        uploadResult = await uploadFile( _this, {
            fileType: 'album',
            path: serverFilePath
        });
    }catch (e){
        console.log(e);
        _this.body = e;
        return;
    }
    let result;
    if(uploadResult.status){
        result = await handler.importVeh(uploadResult.path, uploadResult.fileName);
    }
    _this.body = result;
});

trouter.post("/deleteVehTagByVin",async function(ctx,next){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.deleteVehTagByVin(reqData);
    let _body = {
        status: 0,
        data: {}
    };
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            data: result.datas
        }
    }
    _this.body = _body;
});

trouter.get("/getVehItemAll",async function(ctx,next){
    let _this = ctx;
    let reqData = _this.request.query;
    let result = await handler.getVehItemAll(reqData);
    let _body = {
        status: 0,
        data: {}
    };
    if(result.status == "SUCCEED"){
        _body = {
            status: 1,
            data: result.data
        }
    }
    _this.body = _body;
});

trouter.post("/addVehModelAndRemote", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let vehicleModel = reqData.vehicleModel;
    let remoteCodes = reqData.remoteCodes;
    let result = await handler.addVehModelAndRemote(vehicleModel,remoteCodes);
    _this.body = result;
});

trouter.post("/updateVehModelAndRemote", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let vehicleModel = reqData.vehicleModel;
    let remoteCodes = reqData.remoteCodes;
    let result = await handler.updateVehModelAndRemote(vehicleModel,remoteCodes);
    _this.body = result;
});

trouter.post("/vehDevWriteOffAndUnBind", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.vehDevWriteOffAndUnBind(reqData);
    _this.body = result;
});

trouter.post("/returnedGoods", async function(ctx){
    let _this = ctx;
    let reqData = _this.request.body;
    let result = await handler.returnedGoods(reqData);
    _this.body = result;
});

module.exports = trouter;
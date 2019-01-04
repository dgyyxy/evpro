/**
 * Created by Jie.Liu on 2016/12/7.
 */
"use strict";
const path = require("path");
const fs = require("fs");
const request = require(path.join(process.cwd(), "server/util/request"));
const signUrl = require(path.join(process.cwd(), "server/util/signurl"));

function Vehicle() {}

Vehicle.prototype.getVehList = function(reqInfo) {
    let url = signUrl("vehicle/vehicle", reqInfo, "getVehList");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getVehModelList = function(reqInfo) {
    let url = signUrl("vehicle/model", reqInfo, "getVehModelList");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getVehSeriesList = function(reqInfo) {
    let url = signUrl("vehicle/series", reqInfo, "getVehSeriesList");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getVehBrandList = function(reqInfo) {
    let url = signUrl("vehicle/brand", reqInfo, "getVehBrandList");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.getVehDealerList = function(reqInfo) {
    let url = signUrl("vehicle/dealer", reqInfo, "getVehDealerList");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.getVehDeviceList = function(reqInfo) {
    let url = signUrl("vehicle/device", reqInfo, "getVehDeviceList");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getDeviceChangeInfoList = function(reqData) {
    let url = signUrl("vehicle/device", reqData, "getDeviceChangeInfoList");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getVehSimList = function(reqInfo) {
    let url = signUrl("vehicle/sim", reqInfo, "getVehSimList");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.getVehById = function(reqInfo) {
    let url = signUrl("vehicle/vehicle", reqInfo, "getVehById");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.getVehAttribute = function(reqInfo) {
    let url = signUrl("vehicle/vehicle", reqInfo, "getVehAttribute");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.addOrUpdateVeh = function(reqData) {
    let url = signUrl("vehicle/vehicle", {}, "addOrUpdateVeh");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.addVehModel = function(reqData) {
    reqData.modelTypeId = 1;
    let url = signUrl("vehicle/model", {}, "addVehModel");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.updateVehModel = function(reqData) {
    reqData.modelTypeId = 1;
    let url = signUrl("vehicle/model", {}, "updateVehModel");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.addVehColor = function(reqData) {
    reqData.modelTypeId = 1;
    let url = signUrl("vehicle/color", {}, "addVehColor");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.updateVehColor = function(reqData) {
    reqData.modelTypeId = 1;
    let url = signUrl("vehicle/color", {}, "updateVehColor");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.addVehSeries = function(reqData) {
    reqData.seriesTypeId = 1;
    let url = signUrl("vehicle/series", {}, "addVehSeries");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.updateVehSeries = function(reqData) {
    reqData.seriesTypeId = 1;
    let url = signUrl("vehicle/series", {}, "updateVehSeries");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.addVehBrand = function(reqData) {
    let url = signUrl("vehicle/brand", {}, "addVehBrand");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.updateVehBrand = function(reqData) {
    let url = signUrl("vehicle/brand", {}, "updateVehBrand");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.addOrUpdateVehDealer = function(reqData) {
    let url = signUrl("vehicle/dealer", {}, "addOrUpdateVehDealer");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.addOrUpdateVehDevice = function(reqData) {
    let url = signUrl("vehicle/device", {}, "addOrUpdateVehDevice");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.updateVehDevice = function(reqData) {
    let url = signUrl("vehicle/device", {}, "updateVehDevice");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.addVehDevice = function(reqData) {
    let url = signUrl("vehicle/device", {}, "addVehDevice");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.getVehDeviceModelList = function(reqData) {
    let url = signUrl("vehicle/device", reqData, "getVehDeviceModelList");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.addOrUpdateVehSim = function(reqData) {
    let url = signUrl("vehicle/sim", {}, "addOrUpdateVehSim");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.getVehColorList = function(reqData) {
    let url = signUrl("vehicle/color", reqData, "getVehColorList");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.deleteVehModel = function(reqData) {
    let url = signUrl("vehicle/model", reqData, "deleteVehModel");
    return request.transfer({
        uri: url,
        method: "POST"
    });

}

Vehicle.prototype.deleteVehColor = function(reqData) {
    let url = signUrl("vehicle/color", reqData, "deleteVehColor");
    return request.transfer({
        uri: url,
        method: "POST"
    });

}

Vehicle.prototype.deleteVehSeries = function(reqData) {
    let url = signUrl("vehicle/series", reqData, "deleteVehSeries");
    return request.transfer({
        uri: url,
        method: "POST"
    });

}

Vehicle.prototype.deleteVehBrand = function(reqData) {
    let url = signUrl("vehicle/brand", reqData, "deleteVehBrand");
    return request.transfer({
        uri: url,
        method: "POST"
    });

}

Vehicle.prototype.getVehOwner = function(reqData) {
    let url = signUrl("vehicle/owner", reqData, "getVehOwner");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.getVehOwnerList = function(reqData) {
    let url = signUrl("vehicle/owner", reqData, "getVehOwnerList");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.addOrUpdateOwner = function(reqData) {
    let url = signUrl("vehicle/owner", {}, "addOrUpdateOwner");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.getVehSimInfoList = function(reqData) {
    let url = signUrl("vehicle/sim", reqData, "getVehSimInfoList");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.addVehSim = function(reqData) {
    let url = signUrl("vehicle/sim", {}, "addVehSim");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.updateVehSim = function(reqData) {
    let url = signUrl("vehicle/sim", {}, "updateVehSim");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.getVehDeviceInfoList = function(reqData) {
    let url = signUrl("vehicle/device", reqData, "getVehDeviceInfoList");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.bindSimForDev = function(reqData) {
    let url = signUrl("vehicle/sim", reqData, "bindSimForDev");
    return request.transfer({
        uri: url,
        method: "POST"
    });

}

Vehicle.prototype.getVehInfoList = function(reqData) {
    let url = signUrl("vehicle/vehicle", reqData, "getVehInfoList");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.getDeviceListByvehVin = function(reqData) {
    let url = signUrl("vehicle/device", reqData, "getDeviceListByvehVin");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.getVehSeriesById = function(reqData) {
    let url = signUrl("vehicle/series", reqData, "getVehSeriesById");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.unBindDevForVehicle = function(reqData) {
    let url = signUrl("vehicle/device", reqData, "unBindDevForVehicle");
    return request.transfer({
        uri: url,
        method: "POST"
    });

}

Vehicle.prototype.bindDevForVehicle = function(reqData) {
    let url = signUrl("vehicle/device", reqData, "bindDevForVehicle");
    return request.transfer({
        uri: url,
        method: "POST"
    });

}

Vehicle.prototype.addVeh = function(reqData) {
    let url = signUrl("vehicle/vehicle", {}, "addVeh");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.updateVeh = function(reqData) {
    let url = signUrl("vehicle/vehicle", {}, "updateVeh");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.writeOff = function(reqData) {
    let url = signUrl("vehicle/vehicle", reqData, "writeOff");
    return request.transfer({
        uri: url,
        method: "POST"
    });

}

Vehicle.prototype.addOwner = function(reqData) {
    let url = signUrl("vehicle/owner", {}, "addOwner");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });

}

Vehicle.prototype.updateOwner = function(reqData) {
    let url = signUrl("vehicle/owner", {}, "updateOwner");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });
}

Vehicle.prototype.getVehOwnerByIdNumber = function(reqData) {
    let url = signUrl("vehicle/owner", reqData, "getVehOwnerByIdNumber");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getVehDeviceByType = function(reqData) {
    let url = signUrl("vehicle/device", reqData, "getVehDeviceByType");
    return request.transfer({
        uri: url,
        method: "GET"
    });

}

Vehicle.prototype.unbindOwner = function(reqData) {
    let url = signUrl("vehicle/vehicle", reqData, "unbindOwner");
    return request.transfer({
        uri: url,
        method: "POST"
    });
}

Vehicle.prototype.bindOwner = function(vehicleSaleInfo, ownerExist) {
    let url = signUrl("vehicle/vehicle", {}, "bindOwner");
    return request.transfer({
        uri: url + '&ownerExist=' + ownerExist,
        method: "POST",
        body: vehicleSaleInfo
    });

}

Vehicle.prototype.getVehByVin = function(reqData) {
    let url = signUrl("vehicle/vehicle", reqData, "getVehByVin");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getTelcomCarrier = function(reqData) {
    let url = signUrl("vehicle/sim", reqData, "getTelcomCarrier");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getVehDealerByName = function(reqData) {
    let url = signUrl("vehicle/dealer", reqData, "getVehDealerByName");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.unbindSimForDev = function(reqData) {
    let url = signUrl("vehicle/sim", reqData, "unbindSimForDev");
    return request.transfer({
        uri: url,
        method: "POST"
    });
}

Vehicle.prototype.getVehSimByType = function(reqData) {
    let url = signUrl("vehicle/sim", reqData, "getVehSimByType");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getSimPackageList = function(reqData) {
    let url = signUrl("vehicle/sim", reqData, "getSimPackageList");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.addDeviceManufacturer = function(reqData) {
    let url = signUrl("vehicle/deviceModel", {}, "addDeviceManufacturer");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });
}

Vehicle.prototype.addDeviceModel = function(reqData) {
    let url = signUrl("vehicle/deviceModel", {}, "addDeviceModel");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });
}

Vehicle.prototype.delDeviceManufacturer = function(reqData) {
    let url = signUrl("vehicle/deviceModel", reqData, "delDeviceManufacturer");
    return request.transfer({
        uri: url,
        method: "POST"
    });
}

Vehicle.prototype.delDeviceModel = function(reqData) {
    let url = signUrl("vehicle/deviceModel", reqData, "delDeviceModel");
    return request.transfer({
        uri: url,
        method: "POST"
    });
}

Vehicle.prototype.updateDeviceManufacturer = function(reqData) {
    let url = signUrl("vehicle/deviceModel", {}, "updateDeviceManufacturer");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });
}

Vehicle.prototype.updateDeviceModel = function(reqData) {
    let url = signUrl("vehicle/deviceModel", {}, "updateDeviceModel");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });
}

Vehicle.prototype.getDeviceManufacturer = function(reqData) {
    let url = signUrl("vehicle/deviceModel", reqData, "getDeviceManufacturer");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getDeviceModel = function(reqData) {
    let url = signUrl("vehicle/deviceModel", reqData, "getDeviceModel");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.getVehModelType = function(reqData) {
    let url = signUrl("vehicle/model", reqData, "getVehModelType");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.importSim = function(serverFilePath, fileName) {
    let url = signUrl("vehicle/sim", {}, "importSim");
    let formData = {
        simFile: {
            value: fs.createReadStream(serverFilePath),
            options: {
                filename: fileName
            }
        }
    };
    return request.transferFile({
        uri: url,
        method: "POST",
        formData: formData
    });
}

Vehicle.prototype.importDev = function(serverFilePath, fileName) {
    let url = signUrl("vehicle/device", {}, "importDev");
    let formData = {
        devFile: {
            value: fs.createReadStream(serverFilePath),
            options: {
                filename: fileName
            }
        }
    };
    return request.transferFile({
        uri: url,
        method: "POST",
        formData: formData
    });
}

Vehicle.prototype.importVeh = function(serverFilePath, fileName) {
    let url = signUrl("vehicle/vehicle", {}, "importVehicle");
    let formData = {
        vehicleFile: {
            value: fs.createReadStream(serverFilePath),
            options: {
                filename: fileName
            }
        }
    };
    return request.transferFile({
        uri: url,
        method: "POST",
        formData: formData
    });
}

Vehicle.prototype.importVehTag = function(serverFilePath, fileName) {
    let url = signUrl("vehicle/vehicle", {}, "importVehTag");
    let formData = {
        vehTagFile: {
            value: fs.createReadStream(serverFilePath),
            options: {
                filename: fileName
            }
        }
    };
    return request.transferFile({
        uri: url,
        method: "POST",
        formData: formData
    });
}

Vehicle.prototype.addVehDealer = function(reqData) {
    let url = signUrl("vehicle/dealer", {}, "addVehDealer");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });
}

Vehicle.prototype.updateVehDealer = function(reqData) {
    let url = signUrl("vehicle/dealer", {}, "updateVehDealer");
    return request.transfer({
        uri: url,
        method: "POST",
        body: reqData
    });
}

Vehicle.prototype.withdrawNetWork = function(reqData) {
    let url = signUrl("vehicle/dealer", reqData, "withdrawNetWork");
    return request.transfer({
        uri: url,
        method: "POST"
    });
}

Vehicle.prototype.getVehTagTypeAll = function(reqData) {
    let url = signUrl("vehicle/vehicle", reqData, "getVehTagTypeAll");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.deleteVehTagByVin = function(reqData) {
    let url = signUrl("vehicle/vehicle", reqData, "deleteVehTagByVin");
    return request.transfer({
        uri: url,
        method: "DELETE"
    });
}

Vehicle.prototype.getVehItemAll = function(reqData) {
    let url = signUrl("vehicle/item", reqData, "getVehItemAll");
    return request.transfer({
        uri: url,
        method: "GET"
    });
}

Vehicle.prototype.addVehModelAndRemote = function(vehicleModel, remoteCodes) {
    let url = signUrl("vehicle/model", {}, "addVehModelAndRemote");
    return request.transfer({
        uri: url + '&remoteCodes=' + remoteCodes,
        method: "POST",
        body: vehicleModel
    });
}

Vehicle.prototype.updateVehModelAndRemote = function(vehicleModel, remoteCodes) {
    let url = signUrl("vehicle/model", {}, "updateVehModelAndRemote");
    return request.transfer({
        uri: url + '&remoteCodes=' + remoteCodes,
        method: "POST",
        body: vehicleModel
    });
}

Vehicle.prototype.vehDevWriteOffAndUnBind = function(reqData) {
    let url = signUrl("vehicle/device", reqData, "vehDevWriteOffAndUnBind");
    return request.transfer({
        uri: url,
        method: "POST"
    });
}

Vehicle.prototype.returnedGoods = function(reqData) {
    let url = signUrl("vehicle/vehicle", reqData, "returnedGoods");
    return request.transfer({
        uri: url,
        method: "POST"
    });
}

module.exports = exports = new Vehicle;
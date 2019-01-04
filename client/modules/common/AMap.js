/**
 * create by gary.duan
 */
"user strict"
let carUrl = require("./images/car.png");
import GPS	from './gps';
import $ from "jquery";
import {NUtil} from "./Utils.js";

var _AMap = function(){};

let markers = [],icon,infoWin,_map,polyline;

_AMap.prototype.constructor = _AMap;

/**
 * 初始化地图
 * @param  {[type]} style   [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
_AMap.prototype.init = function(options){
    _map = new AMap.Map(document.getElementById(options.container),{
        zoom: options.zoom,
        resizeEnable: true,
        center: [options.lonlat.lon, options.lonlat.lat]
    });
    _map.setMapStyle("amap://styles/normal");

    if(options.control){
        AMap.plugin(['AMap.ToolBar','AMap.Scale'],
            function(){
                _map.addControl(new AMap.ToolBar());
                _map.addControl(new AMap.Scale());
            });
    }
    return _map;
};

/**
 * 设置覆盖物
 * @param  {[type]}  locations [description]
 * @param  {Boolean} isCancel  [description]
 * @return {[type]}            [description]
 */
_AMap.prototype.marker = function(locations, isCancel){
    let _this = this;
    //删除地图上所有的覆盖物
    _map.clearMap();

    var drawWindow = function(address, statusChange, latlon, marker, loca){
        if(loca.acquisitionTime){
            loca.acquisitionTime = NUtil.Format(new Date(loca.acquisitionTime) , "yyyy-MM-dd hh:mm:ss")
        }
        let alertInfo = "",
            alertTime = "";
        $.asyncAjax({
            url: 'api/getAlertStat',
            method: 'GET',
            data: {
                deviceId:loca.vin,
                deviceType:'VEHICLE',
                handleStates:'0'
            }
        }).then(function (res){
            if(res.status){
                console.log( res.data );
                alertInfo = "一级报警："+res.data.level1+"个，二级报警："+res.data.level2+"个，三级报警："+res.data.level3+"个";
                $.asyncAjax({
                    url: 'api/findStatusHistoryByTimeRange',
                    method: 'GET',
                    data: {
                        deviceId:loca.vin,
                        deviceType:'VEHICLE',
                        pageIndex:1,
                        pageSize:1
                    }
                }).then(function (res){
                    if(res.status && res.data.length) {
                        alertTime = res.data[0].uploadTime;
                        if (alertTime) {
                            alertTime = NUtil.Format(new Date(alertTime), "yyyy-MM-dd hh:mm:ss")
                        }
                    }
                    let winInfo = '<div class="map-obox"><div>vin码：' + (loca.vin ? loca.vin : "") + '</div>'
                        +'<div>设备号：' + (loca.deviceSN ? loca.deviceSN : "") +'</div>'
                        +'<div>ICCID：' + (loca.iccid ? loca.iccid : "") +'</div>'
                        +'<div>经销商：' + (loca.dealerName ? loca.dealerName : "") +'</div>'
                        +'<div>车主姓名：' + (loca.ownerName ? loca.ownerName : "") +'</div>'
                        +'<div>车牌号：' + (loca.licensePlate ? loca.licensePlate : "") +'</div>'
                        +'<div>车辆品牌：' + (loca.brandName ? loca.brandName : "") +'</div>'
                        +'<div>车辆类型：' + (loca.modelName ? loca.modelName : "") +'</div>'
                        +'<div>终端状态：</div>'
                        +'<div>报警状态：'+ alertInfo +'</div>'
                        +'<div>车辆状态：' + statusChange +'</div>'
                        +'<div>最后有效位置时间：' + (loca.acquisitionTime ? loca.acquisitionTime : "") + '</div>'
                        +'<div>最后状态时间：' + (alertTime ? alertTime : "") + '</div>'
                        +'<div>最新地址：' + (address ? address : "") + '</div>'
                        +'<div>经度：'+ (latlon.lon ? latlon.lon : "") + '</div>'
                        +'<div>纬度：' + (latlon.lat ? latlon.lat : "") + '</div></div>';
                    var info = [];
                    info.push(winInfo);
                    let infoWindow = new AMap.InfoWindow({
                        content: info.join("<br/>"),
                        offset: new AMap.Pixel(0, -30)
                    });
                    infoWindow.open(_map, marker.getPosition());
                })
            }
        })

    };

    var infoDetail = function(loca, latlon, marker){
        if(loca && latlon){
            let vehicleStatus = loca.vehicleStatus;
            let statusChange = "";
            switch (vehicleStatus){
                case 'ONLINE':
                    statusChange = "在线";
                    break;
                case 'OFFLINE':
                    statusChange = loca.offlineTime ? loca.offlineTime : '离线';
                    break;
                case 'NOT_MONITOR':
                    statusChange = "未监控";
                    break;
                case 'DISAPPEAR':
                    statusChange = "消失";
                    break;
                case 'EXPIRED':
                    statusChange = "过期";
                    break;
                case 'ALERT':
                    statusChange = "故障";
                    break;
                default:
                    statusChange = "";
                    break;
            }
            let geoc = new AMap.Geocoder({extensions: "all"});
            geoc.getAddress([latlon.lon, latlon.lat], function(status, result){
                if(status === "complete" && result.info === "OK"){
                    let address = result.regeocode.addressComponent;
                    let addressDetail = address.province+address.city+address.district+address.township+address.street+address.streetNumber;
                    drawWindow(addressDetail, statusChange, latlon, marker, loca)
                }else{
                    drawWindow(null, "", latlon, marker, loca);
                }
            });
        }else{
            drawWindow(null, "", latlon, marker, loca);
        }
    };


    if(locations.length == 0){
        this.mapToVehCenter({latitude:34.34127,longitude:108.93984});
        this.mapToMaxZoom(4);
    }else{
        for(let i in locations){
            let loca = locations[i];
            if(loca.latitude && loca.longitude){
                let latitude = loca.latitude,
                    longitude = loca.longitude,
                    latlon = GPS.gcj_encrypt(latitude,longitude),
                    marker;
                marker = new AMap.Marker({
                    map: _map,
                    position: [latlon.lon, latlon.lat],
                    icon: new AMap.Icon({
                        size: new AMap.Size(50, 28),
                        image: carUrl
                    })
                });
                AMap.event.addListener(marker, 'click', function(){
                    infoDetail(loca, latlon, marker);
                });
            }
        }
    }



};

/**
 * 设置地图显示的缩放比例
 * @param  {[type]} zoom [description]
 * @return {[type]}      [description]
 */
_AMap.prototype.mapToMaxZoom = function(zoom){
    _map.setZoom(zoom);
};

/**
 * 地图中心位置
 * @param  {[type]} points [description]
 * @return {[type]}        [description]
 */
_AMap.prototype.mapToVehCenter = function(points){
    let latlon = GPS.gcj_encrypt(points.latitude,points.longitude);
    _map.setCenter([latlon.lon,latlon.lat]);
};

//清除
_AMap.prototype.nClear = function(_map){
    _map.clearMap();
    _map.clearInfoWindow();
};

//获取坐标
_AMap.prototype.nLonLatFilter = function(lat, lon){
    let latlon = GPS.gcj_encrypt(lat, lon);
    return latlon;
};

//创建覆盖层
_AMap.prototype.nSetCarMarker = function(options){
    let _map = options._map,
        carInfo = options.carInfo,
        zoom = options.zoom,
        showWindow = options.showWindow;

    let _this = this,
        latlon = GPS.gcj_encrypt(carInfo.latitude, carInfo.longitude),
        center = new AMap.LngLat(latlon.lon, latlon.lat);

    if(typeof zoom === "number" || undefined === zoom){
        _map.setCenter(center);
        _map.setZoom(zoom ? zoom : 12);
    }
    let marker = new AMap.Marker({
            position: center,
            map: _map
        }),
        markerIcon = new AMap.Icon({
            image: carUrl,
            size: new AMap.Size(50, 28)
        }),
        info = new AMap.InfoWindow();
    marker.setIcon(markerIcon);

    var drawWindow = function(address){
        info.setContent(
            `<div class="map-obox"><div>vin码：${carInfo.vin}</div>`
            + `<div>设备号：${carInfo.deviceSN ? carInfo.deviceSN : ''}</div>`
            + `<div>ICCID：${carInfo.iccid ? carInfo.iccid : ''}</div>`
            + `<div>经销商：${carInfo.saleInfoList.length ? (carInfo.saleInfoList[0].vehicleDealer ? carInfo.saleInfoList[0].vehicleDealer.name : '') : ''}</div>`
            + `<div>车主姓名：${carInfo.ownerName ? carInfo.ownerName : ''}</div>`
            + `<div>车牌号：${carInfo.licensePlate ? carInfo.licensePlate : ''}</div>`
            + `<div>车辆品牌：${carInfo.brandName ? carInfo.brandName : ''}</div>`
            + `<div>车辆类型：${carInfo.modelName ? carInfo.modelName : ''}</div>`
            + `<div>终端状态：</div>`
            + `<div>报警状态：</div>`
            + `<div>采集时间：${NUtil.Format(new Date(carInfo.acquisitionTime), "yyyy-MM-dd hh:mm:ss")}</div>`
            + `<div>上传时间：${NUtil.Format(new Date(carInfo.uploadTime), "yyyy-MM-dd hh:mm:ss")}</div>`
            + `<div>最新地址：${(address ? address : "")}</div>`
            + `<div>经度：${latlon.lon}</div>`
            + `<div>纬度：${latlon.lat}</div></div>`
        );
        info.open(_map, center);
    };


    var openWindow = function(){
        let geoc = new AMap.Geocoder({
            extensions: "all"
        });

        geoc.getAddress(center, function(status, result){
            if(status === "complete" && result.info === "OK"){
                let address = result.regeocode.addressComponent;
                let addressDetail = address.province+address.city+address.district+address.township+address.street+address.streetNumber;
                drawWindow(addressDetail);
            }else{
                drawWindow("车辆位置获取失败！");
            }
        });
    };


    AMap.event.addListener(marker, "click", function(){
        openWindow();
    });

};

_AMap.prototype.nPloyline = function(_map, info){
    let positions = info.positions;
    let veh = info.veh;
    if(polyline){
        polyline.path = this.nCreatePath(positions);
    }else{
        polyline = new AMap.Polyline({
            map: _map,
            path: this.nCreatePath(positions),
            strokeColor: '#269AEA',
            strokeWeight: 5
        });
    }
    veh.latitude = positions[positions.length - 1]["latitude"];
    veh.longitude = positions[positions.length - 1]["longitude"];
    veh.acquisitionTime = positions[positions.length - 1]["acquisitionTime"];
    let options = {
        _map: _map,
        carInfo: veh
    };
    this.nSetCarMarker(options);
};


_AMap.prototype.nCreatePath = function(positions){
    var path = [],
        index = 0;
    for(; index < positions.length; index++){
        let latlon = GPS.gcj_encrypt(positions[index]["latitude"])
        path.push(new AMap.LngLat(latlon.lon, latlon.lat));
    }
    return path;
};

_AMap.prototype.nTrace = function(_map, info){
    let positions = info.positions;
    let veh = info.veh;

    if(polyline){
        polyline.setPath(this.nCreatePath(positions));
    }

    //判断前后是否移动
    if(positions.length >= 2){
        let now = {
            lat: positions[positions.length - 1]["latitude"],
            lon: positions[positions.length - 1]["longitude"],
            acquisitionTime: positions[positions.length - 1]["acquisitionTime"]
        };
        let last = {
            lat: positions[positions.length - 2]["latitude"],
            lon: positions[positions.length - 2]["longitude"]
        };
        if (now.lat !== last.lat || now.lon !== last.lon) {
            veh.latitude = now.lat;
            veh.longitude = now.lon;
            veh.acquisitionTime = now.acquisitionTime;
            let options = {
                _map: _map,
                carInfo: veh,
                zoom: true
            };
            this.nSetCarMarker(options);
        }
    }
};

_AMap.prototype.setCenter = function (lat, lon, _map) {
    let latlon = GPS.gcj_encrypt(lat, lon);
    _map.panTo(new AMap.LngLat(latlon.lon, latlon.lat));
};

/**
 * 更具坐标得到地址信息
 * @param  {[type]} point   [description]
 * @param  {[type]} callBak [description]
 * @return {[type]}         [description]
 */
_AMap.prototype.nGeocode = function(point, callBak){
    let geoc = new AMap.Geocoder();
    let latlon = GPS.gcj_encrypt(point.latitude, point.longitude);
    let apoint = new AMap.LngLat(latlon.lon, latlon.lat);
    geoc.getAddress(apoint, callBak);

};

/**
 * 画出车辆位置
 * @param  {[type]} carInfo   [description]
 * @param  {[type]} qqmap     [description]
 * @param  {[type]} markerArr [description]
 * @return {[type]}           [description]
 */
_AMap.prototype.nCreateIcon = function(carInfo,_map) {
    _map.clearMap();
    let latlon = GPS.gcj_encrypt(carInfo.latitude, carInfo.longitude),
        iconPoint = new AMap.LngLat(latlon.lon, latlon.lat),
        icon = new AMap.Icon({
            image: carUrl,
            size: new AMap.Size(50,28)
        });
    let marker = new AMap.Marker({
        position: iconPoint,
        icon: icon,
        map: _map
    });
};


let TMap = new _AMap;

export { TMap };

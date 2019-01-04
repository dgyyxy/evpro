<template>
    <div class="location-box">
        <div>
            <ul class="breadcrumb">
                <li>车辆位置监控</li>
                <li>追踪定位</li>
            </ul>
            <div class="smart-widget">
                <div class="smart-widget-inner">
                    <div class="smart-widget-body">
                        <form @submit.prevent="toggoleSearchModal()" class="form-inline no-margin">
                            <div class="form-group">
                                <label class="sr-only">type</label>
                                <select class="form-control" v-model="type">
                                    <option v-for="type in typeList" v-bind:value="type.value">{{type.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="sr-only">关键字</label>
                                <input type="text" class="form-control" placeholder="关键字" v-model="keyword"/>
                            </div>
                            <button type="button" class="btn btn-success m-left-sm" v-on:click="toggoleSearchModal()"
                                    :disabled="setIntervalTrace">搜索
                            </button>
                            <div class="form-group m-left-sm" v-show="currentCar">
                                <span>车主姓名：</span>
                                <span>{{currentCar.ownerName | DefaultFilter(currentCar)}}</span><br>
                                <span>车牌号：</span>
                                <span>{{currentCar.licensePlate | DefaultFilter(currentCar)}}</span>
                            </div>
                            <button type="button" class="btn btn-success right" v-on:click="refresh"
                                    :disabled="setIntervalTrace || !currentCar">刷新
                            </button>
                            <button type="button" class="btn btn-success right m-right-sm" v-on:click="carTrace()"
                                    :disabled="!currentCar||!lonlat" :class="{'location-position-redlight':setIntervalTrace}">
                                {{setIntervalTrace ? '停止追踪' : '追踪'}}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="mapWrap">
            <div class="location-position-map-btn">
                <button type="button" class="btn btn-success right" title="车辆居中" v-on:click="carInMapCenter()"
                        v-show="lonlat"><i class="glyphicon glyphicon-screenshot"></i></button>
                <button type="button" class="btn btn-success right m-right-sm" title="地图放大至最大倍数" v-on:click="mapToMaxZoom()"
                        v-show="lonlat"><i class="glyphicon glyphicon-resize-full"></i></button>
            </div>
            <div id="positionMapContainer"></div>
        </div>
        <modal v-model="searchResultShow" large :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button class="close" type="button" @click="searchResultShow = false">
                    <span>×</span>
                </button>
                <h4 class="modal-title">车辆选择</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form @submit.prevent="search()" class="form-inline no-margin m-bottom-sm">
                    <div class="form-group">
                        <label class="sr-only">type</label>
                        <select class="form-control" v-model="type">
                            <option v-for="type in typeList" v-bind:value="type.value">{{type.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="sr-only">关键字</label>
                        <input type="text" class="form-control" placeholder="关键字" v-model="keyword"/>
                    </div>
                    <button type="button" class="btn btn-success m-left-sm" v-on:click="search()">搜索</button>
                </form>
                <div class="data-table table-responsive">
                    <table class="table table-condensed table-hover table-bordered">
                        <thead>
                        <tr>
                            <th>vin</th>
                            <th>车牌号</th>
                            <th>车主姓名</th>
                            <th>SIM卡电话号码</th>
                            <th>车型</th>
                            <th class="width180">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="vehicle in result.datas">
                            <td v-text="vehicle.vin"></td>
                            <td v-text="vehicle.licensePlate"></td>
                            <td v-text="vehicle.ownerName"></td>
                            <td v-text="vehicle.simNumber"></td>
                            <td v-text="vehicle.modelName"></td>
                            <td class="text-align-center">
                                <button type="button" class="btn btn-success btn-xs"
                                        v-on:click="carLocation(vehicle , undefined , true)">定位
                                </button>&nbsp;&nbsp;&nbsp;&nbsp;
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div style='text-align:center' v-show='resultShow'>结果不存在，请重新输入</div>
                </div>
                <div class="pagination-row clearfix">
                    <div class="pull-right">
                        <zpagenav :page="result.pageIndex" :page-size="result.pageSize" :total="result.totalCount"
                                  :max-link="maxLink" :page-handler="search"></zpagenav>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="searchResultShow=false">关闭</button>
            </div>
        </modal>
    </div>
</template>
<style scoped>
    .mapWrap .location-position-map-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 1;
    }
    #positionMapContainer {
        width: 100%;
        height: 100%;
    }

    .width180 {
        width: 180px;
    }

    .btn.location-position-redlight {
        background: #f8341a;
        opacity: 1;
        overflow: hidden;
        /* IE10、Firefox and Opera，IE9以及更早的版本不支持 */
        animation-name: breath;
        animation-duration: 2s;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        /* Safari and Chrome */
        -webkit-animation-name: breath;
        -webkit-animation-duration: 2s;
        -webkit-animation-timing-function: ease-in-out;
        -webkit-animation-iteration-count: infinite;
    }

    .btn.location-position-redlight:focus {
        background: #f8341a;
    }

    .btn.location-position-redlight:hover {
        animation-play-state: paused;
        -webkit-animation-play-state: paused;
        background: #32c5cd;

    }

    @keyframes breath {
        from {
            opacity: 1;
        }
        50% {
            opacity: 0.3;
        }
        to {
            opacity: 1;
        }
    }

    @-webkit-keyframes breath {
        from {
            opacity: 1;
        }
        50% {
            opacity: 0.3;
        }
        to {
            opacity: 1;
        }
    }

</style>
<script>
    import {TMap} from '../common/AMap';
    import {modal, alert} from 'vue-strap';
    import positionService from "./service.js";
    import $ from "jquery";

    export default{
        data(){
            return {
                result: positionService.getInitData(),
                accountRe: {"data": []},
                pageIndex: 1,
                pageSize: 10,
                totalCount: 0,
                maxLink: 5,
                type: "vin",
                keyword: "",
                typeList: [
                    {
                        name: "Vin",
                        value: "vin"
                    },
                    {
                        name: "车牌号",
                        value: "licensePlate"
                    },
                    {
                        name: "车主姓名",
                        value: "ownerName"
                    },
                    {
                        name: "SIM卡电话号码",
                        value: "simNumber"
                    },
                    {
                        name: "ICCID",
                        value: "ICCID"
                    }
                ],
                _map: null,
                vin: "",
                setIntervalTrace: null,
                searchResultShow: false,
                currentCar: {},
                currentCarPosition: [],
                currentCarCount: 0,
                dealerId: "",
                lonlat: null,
                resultShow:false
            }
        },
        components: {
            modal, alert
        },
        methods: {
            pageHandler(page) {
                this.search();
            },
            toggoleSearchModal(){
                $.extend(this.result, positionService.getInitData());
                this.searchResultShow = true;
                this.search();
            },
            search(page){
                let _this = this,
                    params = {
                        type: _this.type,
                        keyword: _this.keyword,
                        pageSize: _this.result.pageSize,
                        dealerIds: _this.dealerId
                    };
                if (typeof page === "number") {
                    params.pageIndex = page;
                } else {
                    params.pageIndex = _this.result.pageIndex;
                }
                _this.$http.get("api/getVehInfoList", {params: params}).then(function (res) {
                    if ("SUCCEED" === res.body.status) {
                        _this.resultShow=false;
                        if( res.body.totalCount==0 ) _this.resultShow=true;
                        $.extend(_this.result, res.body);
                    } else {
                        $.extend(_this.result, positionService.getInitData());
                    }
                });
            },
            refresh(){
                if (this.currentCar) {
                    TMap.nClear(this._map);
                    this.carLocation(this.currentCar, undefined, true, true);
                }
            },
            //车辆定位
            carLocation(vehicle, zoom, showWindow,showAlert){
                let _this = this;
                _this.currentCarCount = 0;
                _this.currentCarPosition = [];
                _this.searchResultShow = false;
                _this.$http.get("api/findLatest", {
                    params: {
                        deviceId: vehicle.vin,
                        deviceType: "VEHICLE"
                    }
                }).then(function (res) {
                    if ("SUCCEED" === res.body.status) {
                        _this.currentCar = vehicle;
                        if (res.body.data) {
                            let options = {
                                _map: _this._map,
                                carInfo: {},
                                zoom: zoom,
                                showWindow: showWindow
                            };
                            $.extend(options.carInfo, vehicle, res.body.data);
                            $.extend(_this.currentCar,res.body.data);
                            _this.currentCarPosition.push(res.body.data);
                            _this.lonlat = TMap.nLonLatFilter(res.body.data.latitude, res.body.data.longitude);
                            TMap.nSetCarMarker(options);
                        } else {
                            _this.lonlat = null;
                            _this._map = TMap.init({
                                container: "positionMapContainer",
                                control: true,
                                lonlat: {
                                    lat: 39.9,
                                    lon: 116.4
                                },
                                zoom: 4
                            });
                            this.$Notice.warning({
                                title: '提醒',
                                desc:'没有查到车辆位置'
                            });
                        }
                        _this.searchResultShow = false;
                    }
                    if (showAlert) {
                        if("SUCCEED" === res.body.status){
                            this.$Notice.success({
                                title: '提醒',
                                desc:'位置刷新成功'
                            });
                        }else{
                            this.$Notice.error ({
                                title: '提醒',
                                desc:'位置刷新失败'
                            });
                        }
                    }
                });
            },
            //车辆追踪
            carTrace(){
                let _this = this;
                if (_this.setIntervalTrace) {
                    clearInterval(_this.setIntervalTrace);
                    _this.setIntervalTrace = null;
                } else {
                    _this.searchResultShow = false;
                    let info = {
                        positions: _this.currentCarPosition.slice(0, ++_this.currentCarCount),
                        veh: _this.currentCar
                    };
                    TMap.nPloyline(_this._map, info);
                    _this.setIntervalTrace = setInterval(function () {
                        _this.$http.get("api/findLatest", {
                            params: {
                                deviceId: _this.currentCar.vin,
                                deviceType: "VEHICLE"
                            },
                            headers: {"No-Loading": "true"}
                        }).then(function (res) {
                            if (res.body.status === 'SUCCEED') {
                                _this.currentCarPosition.push(res.body.data);
                                _this.lonlat = TMap.nLonLatFilter(res.body.data.latitude, res.body.data.longitude);
                                $.extend(_this.currentCar,res.body.data);
                                let info = {
                                    positions: _this.currentCarPosition.slice(0, ++_this.currentCarCount),
                                    veh: _this.currentCar
                                };
                                TMap.nTrace(_this._map, info);
                            }
                        });
                    }, 1000 * 10);
                }
            },
            carInMapCenter(){
                let _this = this;
                TMap.setCenter(_this.lonlat.lat, _this.lonlat.lon, _this._map);
            },
            mapToMaxZoom(){
                this._map.setZoom(18);
            }
        },
        beforeRouteLeave(to, from, next) {
            let _this = this;
            clearInterval(_this.setIntervalTrace);
            _this.setIntervalTrace = null;
            next(true);
        },
        created(){
            let _this = this;
            /*_this.$http.get('api/findOrgIdByToken').then(function (res) {
                if (res.body.status) {
                    if (res.body.org) {
                        _this.dealerId = res.body.org.code;
                    } else {
                        _this.dealerId = null;
                    }
                } else {
                    this.$Notice.warning({
                        title: '提醒',
                        desc: '没有查到本用户经销商代码'
                    });
                }
            });*/
        },
        mounted(){
            let _this = this;
            _this.$nextTick(function () {
                _this._map = TMap.init({
                    container: "positionMapContainer",
                    control: true,
                    lonlat: {
                        lat: 39.9,
                        lon: 116.4
                    },
                    zoom: 4
                });
            });


        }
    }
</script>

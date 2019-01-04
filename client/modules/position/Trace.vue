<template>
    <div class="location-box">
        <div>
            <ul class="breadcrumb">
                <li>车辆位置监控</li>
                <li>轨迹回放</li>
            </ul>
            <div class="smart-widget">
                <div class="smart-widget-inner">
                    <div class="smart-widget-body">
                        <form @submit.prevent="search()" class="form-inline no-margin">
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
                            <div class="form-group m-left-sm" v-show="currentVehicle">
                                <span>车主姓名：</span>
                                <span>{{currentVehicle.ownerName | DefaultFilter(currentVehicle)}}</span><br>
                                <span>车牌号：</span>
                                <span>{{currentVehicle.licensePlate | DefaultFilter(currentVehicle)}}</span>
                            </div>
                            <button type="button" class="btn btn-success right" v-on:click="confirmTime"
                                    :disabled="!currentVehicle.vin || dateTime[0]===null">回放
                            </button>
                            <div class="m-right-sm right">
                                <date-picker class="left" v-model="dateTime" type="datetimerange"
                                             @on-change="datePickerChange"
                                             :options="datePickerOption" placeholder="请选择开始时间 —— 结束时间"
                                             placement="bottom-end" :editable="false"
                                             style="width: 280px"></date-picker>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div id="playControl" v-show="!playControlHidden">
            <div class="progressWrap">
                <span>播放进度：</span>
                <progress id="trackPro" class="progress-bar" :value="progressValue" max="100"></progress>&nbsp;
                <span id="trackProSpan" v-text="progressValue"></span>%&nbsp;
                <button type="button" id="stopBtn" class="btn btn-success" v-on:click="stop">停止</button>&nbsp;
                <button type="button" v-show="!interval" class="btn btn-success" v-on:click="start">开始</button>
                <button type="button" v-show="interval" class="btn btn-success" v-on:click="pause">暂停</button>&nbsp;
                <button type="button" id="speedBtn" class="btn btn-success" v-on:click="speedUp">快进</button>&nbsp;&nbsp;<span
                    style="font-size: 16px;">×{{speed}}</span>
            </div>
        </div>
        <div class="mapWrap">
            <div id="traceMapContainer"></div>
        </div>
        <modal v-model="trackModalShow" large :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button class="close" type="button" @click="trackModalShow = false">
                    <span>×</span>
                </button>
                <h4 class="modal-title">查看轨迹</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div>
                    <form @submit.prevent="search()" class="form-inline m-bottom-sm">
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
                        &nbsp;&nbsp;
                        <button type="button" class="btn btn-success" v-on:click="search()">搜索</button>
                    </form>
                    <div class="data-table table-responsive">
                        <table class="table table-condensed table-hover table-bordered"
                               id="dataTable">
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
                                            v-on:click="playTrack(vehicle)">查看轨迹
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div style='text-align:center' v-show='resultShow'>结果不存在，请重新输入</div>
                    </div>
                    <div class="btn-wrap">
                        <div class="pagination-row clearfix">
                            <div class="pull-right pull-left-sm">
                                <zpagenav :page="result.pageIndex" :page-size="result.pageSize"
                                          :total="result.totalCount" :max-link="maxLink"
                                          :page-handler="search"></zpagenav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="trackModalShow=false">关闭</button>
            </div>
        </modal>
    </div>
</template>
<style scoped>
    #playControl {
        position: absolute;
        top: 120px;
        z-index: 1;
        width: 100%;
        text-align: center;
    }

    #traceMapContainer{
        height:100%;
        width:100%;
    }

    #trackProSpan {
        display: inline-block;
        width: 45px;
    }

    .progress-bar {
        width: 300px;
        height: 10px;
        border-radius: 5px;
        float: none;
    }

    .progress-bar::-webkit-progress-bar {
        background-color: #9b9b9b;
        border-radius: 5px;
    }

    .progress-bar::-webkit-progress-value {
        background-color: #2baab1;
        border-radius: 5px;
    }

    .progressWrap {
        background: #ffffff;
        padding: 10px;
        width: 80%;
        margin: 0 auto;
    }
</style>
<script>
    import {NUtil} from '../common/Utils';
    import {TMap} from '../common/AMap';
    import {modal, alert} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    import positionService from "./service.js";
    function getVehicleListByKeyword(param) {
        return this.$http.post('api/getVehicleListByKeyword', {
            pageIndex: param.pageIndex,
            pageSize: param.pageSize,
            type: param.type,
            keyword: param.keyword
        }).then(function (response) {
            let result = response.body;
            let re = {};
            if (result.status) {
                re = {
                    accountRe: result
                };
                this.pageIndex = result.pageIndex;
                this.totalCount = result.totalCount;
            }
            return re;
        });
    }
    export default{
        data(){
            return {
                resultShow:true,
                result: positionService.getInitData(),
                locationsResult: {
                    totalCount: 0,
                    datas: []
                },
                currentVehicle: {},
                playedLocation: 0,
                speed: 1,
                interval: null,
                PAGE_SIZE: 60,
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
                _map: {},
                pauseBtnText: "暂停",
                tracePlayBack: "",
                pointNum: 0,
                intervalTime: 200,
                speedMultiple: 1,
                setIntervalTrace: false,
                trackModalShow: false,
                playControlHidden: true,
                userName: "",
                carNumber: "",
                dealerId: "",
                dateTime: [new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7), new Date()],
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                tracePageIndex: 1,
                tracePageSize: 10
            }
        },
        components: {
            modal, alert, datePicker
        },
        methods: {
            datePickerChange(time){
                let flag = 0;
                let sub = 0;
                for (let i = 0; i < time.length; i++) {
                    if (time[i] === '-') {
                        flag++;
                        if (flag === 3) {
                            sub = i;
                            break;
                        }
                    }
                }
                let startTime = new Date(time.slice(0, sub - 1));
                let endTime = new Date(time.slice(sub + 1));
                if (endTime.getTime() - startTime.getTime() > 7 * 24 * 60 * 60 * 1000) {
                    this.$Notice.warning({
                        title: '提醒',
                        desc: "最大范围为一周，结束时间已调整至" + new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString()
                    });
                    this.dateTime = [startTime, new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000)];
                }
            },
            pageHandler(page) {
                let promise = getVehicleListByKeyword.apply(this, [{pageIndex: page, pageSize: this.pageSize}]);
                promise.then(function (data) {
                    this.accountRe = data.accountRe;
                });
            },
            search(page){
                let _this = this,
                    params = {
                        dealerIds: _this.dealerId,
                        type: _this.type,
                        keyword: _this.keyword,
                        pageSize: _this.result.pageSize
                    };
                if (typeof page === "number") {
                    params.pageIndex = page;
                } else {
                    params.pageIndex = _this.result.pageIndex;
                }
                _this.trackModalShow = true;
                _this.$http.get("api/getVehInfoList", {params: params}).then(function (res) {

                    if ("SUCCEED" === res.body.status) {
                        _this.resultShow=false;
                        if( res.body.totalCount==0 ) _this.resultShow=true;
                        $.extend(_this.result, res.body);
                        //_this.result.datas = res.body.datas;
                    } else {
                        $.extend(_this.result, positionService.getInitData());
                    }
                });
            },
            confirmTime(){
                let _this = this;
                _this.loadPositions(_this.currentVehicle);
            },
            playTrack(vehicle){
                let _this = this;
                _this.currentVehicle = vehicle;
                _this.loadPositions(_this.currentVehicle);
            },
            // 独立出loadPositions请求数据的方法
            loadPositionsAjax(vehicle) {
                let _this = this
                let params = {
                    pageIndex: _this.tracePageIndex,
                    pageSize: _this.tracePageSize,
                    deviceId: vehicle.vin,
                    deviceType: "VEHICLE",
                    startTime: _this.dateTime[0] ? _this.dateTime[0].getTime() : new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
                    endTime: _this.dateTime[1] ? _this.dateTime[1].getTime() : new Date.getTime(),
                };
                console.log(params)
                return new Promise((resolve, reject) => {
                    _this.$http.get("api/findAllLocationList", {params: params, headers: {"No-Loading": "true"}}).then((res) => {
                        if ("SUCCEED" === res.body.status) {
                            _this.locationsResult.totalCount = res.body.totalCount;
                            resolve(res.body.datas)
                        } else if ("FAILED" === res.body.status) {
                            this.$Notice.error({
                                title: '提醒',
                                desc:"查询车辆轨迹数据失败"
                            });
                        }
                    })
                })
            },

            loadPositions(vehicle){
                this.stop();
                let _this = this
                _this.loadPositionsAjax(vehicle).then((data) => {
                    console.log(data)
                    if (data.length) {
                        _this.playControlHidden = false;
                        data.reverse().map((item, index) => {
                            _this.locationsResult.datas.push(item)
                        })
                        _this.pause();
                        _this.start();
                    } else {
                        _this.playControlHidden = true;
                        _this._map = TMap.init({
                            container: "traceMapContainer",
                            control: true,
                            lonlat: {
                                lat: 39.9,
                                lon: 116.4
                            },
                            zoom: 4
                        });
                        _this.$Notice.warning({
                            title: '提醒',
                            desc:"没有查到车辆轨迹"
                        });
                    }
                    _this.trackModalShow = false;
                })
            },
            start(){
                let _this = this;
                //播放完成后的重播
                if (_this.locationsResult.totalCount === _this.playedLocation) {
                    _this.playedLocation = 0;
                    TMap.nClear(this._map);
                }

                let info = {
                    positions: _this.locationsResult.datas.slice(0, ++_this.playedLocation),
                    veh: _this.currentVehicle
                };

                //播放
                TMap.nPolyline(_this._map, info);
                _this.interval = setInterval(function () {
                    if (_this.locationsResult.totalCount > _this.playedLocation) {
                        let info = {
                            positions: _this.locationsResult.datas.slice(0, ++_this.playedLocation),
                            veh: _this.currentVehicle
                        };
                        TMap.nTrace(_this._map, info);
                    } else {
                        _this.pause();
                    }
                    _this.tracePageIndex += 1

                    if (_this.tracePageIndex * _this.tracePageSize < _this.locationsResult.totalCount + _this.tracePageSize) {
                        _this.loadPositionsAjax(_this.currentVehicle).then((data) => {
                            data.map((item, index) => {
                                _this.locationsResult.datas.push(item)
                            })
                        })
                    }

                }, 1000 / _this.speed);

            },
            pause(){
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
            },
            speedUp(){
                this.speed = this.speed > 7 ? 1 : this.speed + 1;
                this.pause();
                this.start();
            },
            stop(){
                this.speed = 1;
                this.playedLocation = 0;
                this.pause();
                TMap.nClear(this._map);
                $.extend(this.$data.tracePageIndex, this.$options.data().tracePageIndex);
            }
        },
        computed: {
            progressValue: function () {
                let percent = 0 === this.playedLocation ? 0 : parseFloat(this.playedLocation / this.locationsResult.totalCount);
                return isNaN(percent) ? 0 : (percent * 100).toFixed(2);
            }
        },
        beforeRouteLeave(to, from, next) {
            let _this = this;
            clearInterval(_this.interval);
            _this.interval = null;
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
                    _this.$Notice.warning({
                        title: '提醒',
                        desc:"没有查到本用户经销商代码"
                    });
                }
            });*/
        },
        mounted(){
            let _this = this;
            _this.$nextTick(function () {
                _this._map = TMap.init({
                    container: "traceMapContainer",
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

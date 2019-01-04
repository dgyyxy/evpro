<template>
    <div>
        <div class="status-middle-row row">
            <div class="col-md-5 left">
                <div class="veh-survey">
                    <span class="title">车辆概况</span>
                    <table class="table table-bordered">
                        <tbody>
                        <tr>
                            <td>
                                驱动电机状态 ： <br/>{{historyLatestStatusData.items.one.value + ' ' + historyLatestStatusData.items.one.unit}}
                            </td>
                            <td>
                                电池单体最高温度值 ：<br/>{{historyLatestStatusData.items.two.value + ' ' + historyLatestStatusData.items.two.unit}}
                            </td>
                            <td>
                                电池单体电压最高值 ：<br/>{{historyLatestStatusData.items.three.value + ' ' + historyLatestStatusData.items.three.unit}}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                驱动电机转速 ：<br/>{{historyLatestStatusData.items.four.value + ' ' + historyLatestStatusData.items.four.unit}}
                            </td>
                            <td>
                                电池单体最低温度值 ：<br/>{{historyLatestStatusData.items.five.value + ' ' + historyLatestStatusData.items.five.unit}}
                            </td>
                            <td>
                                电池单体电压最低值 ：<br/>{{historyLatestStatusData.items.six.value + ' ' + historyLatestStatusData.items.six.unit}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="status-map-wrap">
                    <div class="title history-title">
                        <span>车辆位置：{{vehHistoryAddress}}</span>
                    </div>
                    <div id="status-history-map"></div>
                </div>
            </div>
            <div class="col-md-3 middle">
                <div id="status-history-gauge"></div>
            </div>
            <div class="col-md-4" id="status-history-right">
                <div class="row">
                    <div class="col-md-7" id="status-history-query">
                        <div class="content">
                            <div class="query-top">
                                <div class="title"><span class="glyphicon glyphicon-dashboard"></span> 最近时间
                                </div>
                                <div class="status-radios">
                                    <radio v-model="historyFastQueryTime" button selected-value="0"
                                    >5分钟前
                                    </radio>
                                    <radio v-model="historyFastQueryTime" button selected-value="1"
                                    >2小时前
                                    </radio>
                                    <radio v-model="historyFastQueryTime" button selected-value="2"
                                    >5小时前
                                    </radio>
                                    <radio v-model="historyFastQueryTime" button selected-value="3"
                                    >自定义
                                    </radio>
                                </div>
                            </div>
                            <div class="query-bottom" v-show="historyFastQueryTime === '3'">
                                <div class="title"><span class="glyphicon glyphicon-filter"></span> 时间筛选
                                </div>
                                <date-picker class="date" v-model="historyStartDate" ref="historyEndDate"
                                             :options="datePickerStartOption" type="datetime" placeholder="选择开始时间"
                                             style="width: 180px"></date-picker>
                                <date-picker class="date" v-model="historyEndDate" ref="historyStartDate"
                                             :options="datePickerEndOption" type="datetime" placeholder="选择结束时间"
                                             style="width: 180px"></date-picker>
                            </div>
                            <button class="btn btn-sm btn-success" @click="getHistoryList(null,1)"
                                    :disabled="!historyFastQueryTime">查询
                            </button>
                        </div>
                    </div>
                    <div class="col-md-5" id="status-history-choose">
                        <div class="content">
                            <div class="title">请选择时间</div>
                            <div v-show="historyNoData">无数据！</div>
                            <div class="list" v-show="!historyNoData">
                                <div v-for="historyItem in historyList"
                                     :class="{'active':historyItem.statusId === history.latestStatusByVehicleModelType.statusId}"
                                     @click="getHistoryStatus(historyItem.statusId)">{{historyItem.uploadTime | DateFilter}}
                                </div>
                            </div>
                            <div class="page">
                                <button class="btn btn-sm" :disabled="historyStatus.pageIndex<=1"
                                        @click="historyPageHandler(historyStatus.pageIndex-1)">
                                    <span class="glyphicon glyphicon-menu-left"></span>
                                </button>
                                <button class="btn btn-sm"
                                        :disabled="historyStatus.pageIndex >= historyPage.pageCount"
                                        @click="historyPageHandler(historyStatus.pageIndex+1)">
                                    <span class="glyphicon glyphicon-menu-right"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="status-bottom-tb" v-show="historyLatestCateDataByGroup.groupKeyItems">
            <ul class="next-prev-arrow">
                <li class="glyphicon glyphicon-step-backward" @click="vehTimeStatusBackward()"></li>
                <li class="glyphicon glyphicon-step-forward" @click="vehTimeStatusForward()"></li>
            </ul>
            <div class="status-bottom-tb-tab" id="status-bottom-tb-tab-history">
                <ul class="nav nav-tabs" role="tablist">
                    <li role="presentation" v-for="(groupName, index) in groupNames"
                        :class="{'active':tabNum === index}">
                        <a href="javascript:void(0)" role="tab"
                           @click=bottomTabSelect(index)>{{groupName}}</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane" :class="{'active':tabNum === index}"
                         v-for="(groupKeyItem, index) in historyLatestCateDataByGroup.groupKeyItems">
                        <table class="table table-bordered">
                            <tbody>
                            <tr v-for="tr in groupKeyItem.newItems">
                                <td v-for="newItem in tr">
                                    <template v-if="newItem.code">
                                        {{newItem.name}} ： {{newItem.value | trueFalseFilter(groupKeyItem.groupKey)}} {{newItem.unit}}
                                    </template>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {TMap} from '../../common/AMap';
    import {radio} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    import $ from 'jquery';

    import echarts from 'echarts/lib/echarts';
    require('echarts/lib/chart/gauge');
    require('echarts/lib/chart/line');
    require('echarts/lib/component/tooltip');
    require('echarts/lib/component/title');
    require('echarts/lib/component/axis');
    require('echarts/lib/component/grid');
    require('echarts/lib/component/legend');

    function setTime() {
        let d = new Date();
        let t = d.getTime();
        let obj = {
            startTime: Math.round(t) - 5 * 60 * 1000,
            endTime: Math.round(t)
        }
        return obj
    }
    export default{
        data(){
            return {
                historyStartDate: null,
                historyEndDate: null,
                historyList: [],
                historyNoData: null,
                vehHistoryAddress: '无数据',
                historyLatestStatusData: {
                    items: {
                        one: {
                            value: '',
                            unit: ''
                        },
                        two: {
                            value: '',
                            unit: ''
                        },
                        three: {
                            value: '',
                            unit: ''
                        },
                        four: {
                            value: '',
                            unit: ''
                        },
                        five: {
                            value: '',
                            unit: ''
                        },
                        six: {
                            value: '',
                            unit: ''
                        },
                    }
                },
                historyLatestCateDataByGroup: {},
                history: {
                    latestStatusByVehicleModelType: {
                        statusId: '',
                        modelTypeCode: 'EV',
                        importanceLevel: 1,
                    },
                    latestStatusByGroupCate: {
                        statusId: '',
                        groupType: 'CATEGORY',
                        groupKeys: '',
                    }
                },
                historyFastQueryTime: "",
                historyStatus: {
                    deviceType: 'VEHICLE',
                    deviceId: '',
                    startTime: '',
                    endTime: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                historyPage: {
                    totalCount: 0,
                    pageCount: 0
                },
                _maphitory: {},
                tabNum:0,
                historyMarkersArr: [],
                statusGaugeOption: {
                    series: [
                        {
                            name: '速度',
                            type: 'gauge',
                            z: 3,
                            min: 0,
                            max: 220,
                            splitNumber: 11,
                            radius: '72%',
                            center: ['50%', '27%'],
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    width: 10,
                                    color: [[0.2, "#a4ed96"], [0.6, "#95ccea"], [0.8, "#f4ae34"], [1, "#ee5314"]]
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length: 8,        // 属性length控制线长
                                splitNumber: 5,
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto'
                                }
                            },
                            splitLine: {           // 分隔线
                                length: 14,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer: {
                                length: "60%",
                                width: 6
                            },
                            title: {
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'bolder',
                                    fontSize: 16,
                                    color: "auto"
                                },
                                offsetCenter: ["0", "60%"]
                            },
                            detail: {
                                offsetCenter: ["0", "80%"],
                                formatter: function (value) {
                                    return value + " Km/h";
                                },
                                textStyle: {
                                    fontSize: 22,
                                    color: "auto"
                                }
                            },
                            data: {value: 0, name: '速 度'}
                        }, {
                            name: 'SOC',
                            type: 'gauge',
                            z: 3,
                            min: 0,
                            max: 100,
                            splitNumber: 10,
                            radius: '72%',
                            center: ['50%', '75%'],
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    width: 10,
                                    color: [[0.2, "#a4ed96"], [0.6, "#95ccea"], [0.8, "#f4ae34"], [1, "#ee5314"]]
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length: 8,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto'
                                }
                            },
                            splitLine: {           // 分隔线
                                length: 14,         // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            pointer: {
                                length: "60%",
                                width: 6
                            },
                            title: {
                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                    fontWeight: 'bolder',
                                    fontSize: 16,
                                    color: "auto"
                                },
                                offsetCenter: ["0", "60%"]
                            },
                            detail: {
                                offsetCenter: ["0", "80%"],
                                textStyle: {
                                    fontSize: 22,
                                    color: "auto"
                                }
                            },
                            data: {value: 0, name: 'SOC'}
                        }
                    ]
                },

            }
        },
        components: {
            radio, datePicker
        },
        computed: {
            currentDeviceId(){
                return this.$store.state.vehicleStatusSearch.deviceId;
            },
            groupKeys(){
                return this.$store.state.vehicleStatusSearch.groupKeys;
            },
            groupNames(){
                return this.$store.state.vehicleStatusSearch.groupNames;
            },
            datePickerStartOption(){
                let _this = this;
                return {
                    disabledDate (date) {
                        if (_this.historyEndDate) {
                            return date.valueOf() > Date.now() || date.valueOf() >= _this.historyEndDate.getTime();
                        } else {
                            return date.valueOf() > Date.now();
                        }
                    }
                }
            },
            datePickerEndOption() {
                let _this = this;
                return {
                    disabledDate(date){
                        if (_this.historyStartDate) {
                            return date.valueOf() > Date.now() || date.valueOf() <= _this.historyStartDate.getTime();
                        } else {
                            return date.valueOf() > Date.now();
                        }
                    }
                }
            }
        },
        methods: {
            //----------------------历史------------------------
            getHistoryList(pageHandleFlag, reset){
                let _this = this;
                if (reset) {
                    _this.historyStatus.pageIndex = 1;
                }
                if (!pageHandleFlag) {
                    let historyFastQueryTime = _this.historyFastQueryTime;
                    if (historyFastQueryTime === "0") {
                        let objTime = setTime();
                        _this.historyStatus.startTime = objTime.startTime;
                        _this.historyStatus.endTime = objTime.endTime;
                    } else if (historyFastQueryTime === "1") {
                        _this.historyStatus.endTime = Math.round(new Date().getTime());
                        _this.historyStatus.startTime = _this.historyStatus.endTime - 1000 * 60 * 60 * 2;
                    } else if (historyFastQueryTime === "2") {
                        _this.historyStatus.endTime = Math.round(new Date().getTime());
                        _this.historyStatus.startTime = _this.historyStatus.endTime - 1000 * 60 * 60 * 5;
                    } else if (historyFastQueryTime === "3") {
                        _this.historyStatus.startTime = _this.historyStartDate ? _this.historyStartDate.getTime() : 0;
                        _this.historyStatus.endTime = _this.historyEndDate ? _this.historyEndDate.getTime() : new Date().getTime();
                    }
                }
                _this.historyStatus.deviceId = _this.currentDeviceId;
                _this.$http.get('api/findStatusHistoryByTimeRange', {params: _this.historyStatus}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.historyList = data.body.datas;
                        _this.historyStatus.pageIndex = data.body.pageIndex;
                        _this.historyPage.pageCount = data.body.pageCount;
                        if (_this.historyList.length === 0) {
                            _this.historyNoData = 1;
                            _this.$store.dispatch('setWindowAlert', {
                                type: "success",
                                text: "该时间段无历史数据"
                            })
                        } else {
                            _this.historyNoData = 0;
                        }
                    } else {
                        _this.historyList = [];
                        _this.historyStatus.pageIndex = 1;
                        _this.historyPage.totalCount = 0;
                    }
                });
            },
            //历史车辆概况
            getHistoryStatus(statusId){
                let _this = this;
                if (statusId) {
                    _this.history.latestStatusByVehicleModelType.statusId = statusId;
                    _this.history.latestStatusByGroupCate.statusId = statusId
                }
                _this.tabNum = 0;
                _this.history.latestStatusByVehicleModelType.groupKeys = _this.groupKeys;
                _this.history.latestStatusByVehicleModelType.deviceId = _this.currentDeviceId;
                _this.$http.get('api/getStatusByVehicleModelType', {params: _this.history.latestStatusByVehicleModelType}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.historyLatestStatusData = data.body.data;
                        let _map = _this._maphitory;
                        let point = {
                            longitude: _this.historyLatestStatusData.longitude,
                            latitude: _this.historyLatestStatusData.latitude,
                        };
                        if (point.longitude > 0 && point.latitude > 0) {
                            TMap.setCenter(point.latitude, point.longitude, _map);
                            TMap.nGeocode(point, function (status, result) {
                                    let address = data.addressComponents;
                                    _this.vehHistoryAddress = address.province + address.city + address.district  + address.street + address.streetNumber;
                                });
                            TMap.nCreateIcon(point, _map, _this.historyMarkersArr);
                        } else if (point.longitude === undefined || point.latitude === undefined) {
                            _this.TmapInit();
                            _this.vehAddress = "无数据";
                        } else {
                            _this.TmapInit();
                            _this.vehHistoryAddress = "无效位置数据";
                        }
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取车辆概况数据失败"
                        })
                    }
                });
                _this.history.latestStatusByGroupCate.groupKeys = _this.groupKeys;
                _this.history.latestStatusByGroupCate.deviceId = _this.currentDeviceId;
                _this.$http.get('api/getStatusByGroup', {params: _this.history.latestStatusByGroupCate}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.historyLatestCateDataByGroup = data.body.data;
                        let option = {
                            series: [
                                {data: {value: data.body.data.speed}},
                                {data: {value: data.body.data.soc}}
                            ]
                        };
                        //echarts speed & soc set
                        _this.statusHistoryGauge.setOption(option);
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取车辆详细数据失败"
                        })
                    }
                });
            },
            //翻页
            historyPageHandler(pageIndex){
                this.historyStatus.pageIndex = pageIndex;
                this.getHistoryList(1);
            },
            //echarts init
            echartsInit(){
                let _this = this;
                let statusHistoryGaugeDom = document.querySelector('#status-history-gauge');
                _this.statusHistoryGauge = echarts.init(statusHistoryGaugeDom);
                _this.statusHistoryGauge.setOption(_this.statusGaugeOption);
            },
            //dom操作
            vehTimeStatusBackward(){
                let $menu = $(".status-bottom-tb-tab>.nav-tabs");
                $menu.animate({
                    left: 0
                }, 500)
            },
            vehTimeStatusForward(){
                let $menu = $(".status-bottom-tb-tab>.nav-tabs");
                let $screen = $(".status-bottom-tb-tab");
                let w = $menu.width() - $screen.width();
                if (w > 0) {
                    $menu.animate({
                        left: -w + 'px'
                    }, 500);
                }
            },
            TmapInit(){
                this._maphitory = TMap.init({
                    container: "status-history-map",
                    zoomControl: true,
                    control: false,
                    lonlat: {
                        lat: 39.9,
                        lon: 116.4
                    },
                    zoom: 11
                });
            },
            bottomTabSelect(num){
                this.tabNum = num;
            }
        },
        mounted(){
            let _this = this;
            _this.$nextTick(function () {
                //echarts init
                _this.echartsInit();
                _this.TmapInit();
            });

        }
    }
</script>

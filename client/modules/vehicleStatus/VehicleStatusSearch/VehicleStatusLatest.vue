<template>
    <div>
        <div class="time-refresh-option">
            <div>更新时间：
                <span v-show="latestStatusData.uploadTime">{{latestStatusData.uploadTime | DateFilter}}</span>
                <span v-show="!latestStatusData.uploadTime">无</span>
            </div>
            <div>自动刷新频率</div>
            <div class="form-group">
                <select class="form-control input-sm" v-model="refreshTime" @change="statusSetTimeoutRefresh()">
                    <option v-for="time in refreshTimes" v-bind:value="time.value">{{time.name}}</option>
                </select>
            </div>
        </div>
        <div class="status-middle-row row">
            <div class="col-md-5 left">
                <div class="veh-survey">
                    <span class="title">车辆概况</span>
                    <table class="table table-bordered">
                        <tbody>
                        <tr>
                            <td>驱动电机状态 ： <br/> {{latestStatusData.items.one.value + ' ' + latestStatusData.items.one.unit}}
                            </td>
                            <td>电池单体最高温度值 ：<br/> {{latestStatusData.items.two.value + ' ' + latestStatusData.items.two.unit}}</td>
                            <td>电池单体电压最高值 ：<br/> {{latestStatusData.items.three.value + ' ' + latestStatusData.items.three.unit}}
                            </td>
                        </tr>
                        <tr>
                            <td>驱动电机转速 ：<br/> {{latestStatusData.items.four.value + ' ' + latestStatusData.items.four.unit}}
                            </td>
                            <td>电池单体最低温度值 ：<br/> {{latestStatusData.items.five.value + ' ' + latestStatusData.items.five.unit}}
                            </td>
                            <td>电池单体电压最低值 ：<br/> {{latestStatusData.items.six.value + ' ' + latestStatusData.items.six.unit}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="status-map-wrap">
                    <div class="title" style="z-index:1;">
                        <span :title="vehAddress">车辆位置：{{vehAddress}}</span>
                        <span>车辆状况：<i
                                v-bind:class="{'status-haserror':latestAbnormal>0}">{{latestAbnormal > 0 ? '异常' : '正常'}}</i></span>
                        <span><a href="javascript:void(0)" @click="showAbnormal"
                                 v-if="latestAbnormal>0">查看异常</a></span>
                    </div>
                    <div id="status-now-map"></div>
                </div>
            </div>
            <div class="col-md-3 middle">
                <div id="status-now-gauge"></div>
            </div>
            <div class="col-md-4 right">
                <div id="status-now-line"></div>
            </div>
        </div>
        <div class="status-bottom-tb" v-show="latestCateDataByGroups.groupKeyItems">
            <ul class="next-prev-arrow">
                <li class="glyphicon glyphicon-step-backward" @click="vehTimeStatusBackward()"></li>
                <li class="glyphicon glyphicon-step-forward" @click="vehTimeStatusForward()"></li>
            </ul>
            <div class="status-bottom-tb-tab" id="status-bottom-tb-tab-now">
                <ul class="nav nav-tabs" role="tablist">
                    <li role="presentation" v-for="(groupName, index) in groupNames"
                        v-bind:class="{active:index === tabNum}">
                        <a href="javascript:void(0)" role="tab"
                           @click=bottomTabSelect(index)>{{groupName}}</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane" v-bind:class="{active:index === tabNum}"
                         v-for="(groupKeyItem,index) in latestCateDataByGroups.groupKeyItems">
                        <table class="table table-bordered">
                            <tbody>
                            <tr v-for="tr in groupKeyItem.newItems">
                                <td v-for="newItem in tr">
                                    <template v-if="newItem.code">{{newItem.name}} ： {{newItem.value | trueFalseFilter(groupKeyItem.groupKey)}} {{newItem.unit}}</template>
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
                otherCharts:false,
                latestStatusData: {
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
                latestCateDataByGroups: {},
                latestAbnormal: '',
                tabNum: 0,
                vehAddress: '无数据',
                latestStatusByVehicleModelType: {
                    deviceType: 'VEHICLE',
                    deviceId: '',
                    modelTypeCode: 'EV',
                    importanceLevel: 1,
                },
                latestStatusByGroupCate: {
                    deviceType: 'VEHICLE',
                    deviceId: '',
                    groupType: 'CATEGORY',
                    groupKeys: '',
                },
                SomeMinutesStatusSearch: {
                    deviceType: 'VEHICLE',
                    deviceId: '',
                },
                latestAbnormalSearch: {
                    deviceType: 'VEHICLE',
                    deviceId: '',
                    handleState: '0'
                },
                _map: {},
                nowMarkersArr: [],
                refreshTimes: [
                    {
                        name: '1s',
                        value: 1000
                    }, {
                        name: '5s',
                        value: 5000
                    }, {
                        name: '10s',
                        value: 10000
                    }, {
                        name: '30s',
                        value: 30000
                    }],
                refreshTime: 10000,
                statusSetTimeoutRefreshTimer: null,
                statusNowGauge: null,
                statusNowLine: null,
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
                statusNowLineOption: {
                    title: [{
                        text: '可充电蓄能装置总电压数据（V）',
                        top: '3%',
                        left: "left",
                        textStyle: {
                            fontSize: 14,
                            color: "#619288",
                            fontWeight: "normal"
                        }
                    }, {
                        text: '最近五分钟数据',
                        top: '3%',
                        right: "2%",
                        textStyle: {
                            fontSize: 12,
                            fontWeight: "normal"
                        }
                    }, {
                        text: '车速变化分析（km/h）',
                        top: '51%',
                        left: "left",
                        textStyle: {
                            fontSize: 14,
                            color: "#ec983e",
                            fontWeight: "normal"
                        }
                    }],
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{b}<br/> {c}'
                    },
                    xAxis: [{
                        show: true,
                        gridIndex: 0,
                        type: "category",
                        boundaryGap: false,
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {show: false},
                        splitLine: {show: true},
                        data: []
                    }, {
                        show: true,
                        gridIndex: 1,
                        type: "category",
                        boundaryGap: false,
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {show: false},
                        splitLine: {show: true},
                        data: []
                    }],
                    grid: [{
                        show: true,
                        left: '3%',
                        right: '3%',
                        bottom: '48%',
                        top: "12%",
                        containLabel: true,
                        borderColor: "#eeeeee",
                        backgroundColor: "#f6f6f6"
                    }, {
                        show: true,
                        left: '3%',
                        right: '3%',
                        bottom: '1%',
                        top: "60%",
                        containLabel: true,
                        borderColor: "#eeeeee",
                        backgroundColor: "#f6f6f6"
                    }],
                    yAxis: [{
                        gridIndex: 0,
                        type: 'value',
                        nameTextStyle: {fontSize: 14},
                        axisTick: false
                    },
                        {
                            gridIndex: 1,
                            type: 'value',
                            nameTextStyle: {fontSize: 14},
                            axisTick: false
                        }],
                    series: [{
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        name: '可充电蓄能装置电压数据',
                        type: 'line',
                        lineStyle: {normal: {color: '#619288'}},
                        data: []
                    }, {
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        name: '车速变化分析',
                        type: 'line',
                        lineStyle: {normal: {color: '#ec983e'}},
                        data: []
                    }]
                },

            }
        },
        components: {},
        computed: {
            currentDeviceId(){
                return this.$store.state.vehicleStatusSearch.deviceId;
            },
            groupKeys(){
                return this.$store.state.vehicleStatusSearch.groupKeys;
            },
            groupNames(){
                return this.$store.state.vehicleStatusSearch.groupNames;
            }
        },
        methods: {
            //----------------------实时------------------------
            //    车辆数据
            getLatestStatus(){
                let _this = this;
                _this.latestStatusByVehicleModelType.groupKeys = _this.groupKeys;
                _this.latestStatusByVehicleModelType.deviceId = _this.currentDeviceId;
                _this.$http.get('api/getLatestStatusByVehicleModelType', {params: _this.latestStatusByVehicleModelType,headers:{"No-Loading":"true"}}).then(function (data) {
                    if(data.body){
                        if (data.body.status === "SUCCEED") {
                            //车辆概况
                            _this.latestStatusData = data.body.data;
                            //地图定位
                            let _map = _this._map;
                            let point = {
                                longitude: _this.latestStatusData.longitude,
                                latitude: _this.latestStatusData.latitude,
                            };
                            if (point.longitude > 0 && point.latitude > 0) {
                                TMap.setCenter(point.latitude, point.longitude, _map);
                                TMap.nGeocode(point, function(status, result){
                                    if(status === "complete" && result.info === "OK"){
                                        let address = result.regeocode.addressComponent;
                                        _this.vehAddress = address.province+address.city+address.district+address.township+address.street+address.streetNumber;
                                    }else{
                                        _this.vehAddress = "车辆位置获取失败！";
                                    }
                                });
                                TMap.nCreateIcon(point, _map);
                            } else if(point.longitude === undefined || point.latitude === undefined){
                                _this.TmapInit();
                                _this.vehAddress = "无数据";
                            }else{
                                _this.TmapInit();
                                _this.vehAddress = "无效位置数据";
                            }
                        } else {
                            _this.$store.dispatch('setWindowAlert', {
                                type: "danger",
                                text: "获取车辆概况数据失败"
                            })
                        }
                    }else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "数据格式有误"
                        })
                    }

                });
                _this.latestStatusByGroupCate.groupKeys = _this.groupKeys;
                _this.latestStatusByGroupCate.deviceId = _this.currentDeviceId;
                _this.$http.get('api/getLatestStatusByGroup', {params: _this.latestStatusByGroupCate,headers:{"No-Loading":"true"}}).then(function (data) {
                    if(data.body){
                        if (data.body.status === "SUCCEED") {
                            _this.latestCateDataByGroups = data.body.data;
                            let option = {
                                series: [
                                    {data: {value: data.body.data.speed}},
                                    {data: {value: data.body.data.soc}}
                                ]
                            };
                            //echarts speed & soc set
                            _this.statusNowGauge.setOption(option);
                        } else {
                            _this.$store.dispatch('setWindowAlert', {
                                type: "danger",
                                text: "获取车辆详细数据失败"
                            })
                        }
                    }else{
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "数据格式有误"
                        })
                    }
                });
            },
            //    短时间速度与电压
            findStatusHistoryItems(){
                let _this = this;
                let SomeMinutesStatusSearch = _this.SomeMinutesStatusSearch;
                let objTime = setTime();
                SomeMinutesStatusSearch.endTime = objTime.endTime;
                SomeMinutesStatusSearch.startTime = objTime.startTime;
                SomeMinutesStatusSearch.deviceId = _this.currentDeviceId;
                SomeMinutesStatusSearch.statusCodes = "1001004";
                _this.$http.get('api/findStatusHistoryItems', {params: SomeMinutesStatusSearch,headers:{"No-Loading":"true"}}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        let result = data.body.data;
                        _this.statusNowLineOption.xAxis[1].data = result.uploadTimeArr;
                        _this.statusNowLineOption.series[1].data = result.speedArr;
                        _this.statusNowLine.setOption(_this.statusNowLineOption);
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取五分钟内速度失败"
                        })
                    }
                });
                SomeMinutesStatusSearch.statusCodes = "1008002-1";
                _this.$http.get('api/findStatusHistoryItems', {params: SomeMinutesStatusSearch,headers:{"No-Loading":"true"}}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        let result = data.body.data;
                        _this.statusNowLineOption.xAxis[0].data = result.uploadTimeArr;
                        _this.statusNowLineOption.series[0].data = result.voltageArr;
                        _this.statusNowLine.setOption(_this.statusNowLineOption);
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取五分钟内电压失败"
                        })
                    }
                });
            },
            //    正异常
            getAlertTotalByHandleState(){
                let _this = this;
                _this.latestAbnormalSearch.deviceId = _this.currentDeviceId;
                _this.$http.get('api/getAlertTotalByHandleState', {params: _this.latestAbnormalSearch,headers:{"No-Loading":"true"}}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        //正异常
                        _this.latestAbnormal = data.body.data.alertTotal;
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取车辆正异常失败"
                        })
                    }
                });
            },
            //定时刷新
            statusSetTimeoutRefresh(){
                let _this = this;
                if (_this.statusSetTimeoutRefreshTimer) {
                    clearInterval(_this.statusSetTimeoutRefreshTimer);
                    _this.statusSetTimeoutRefreshTimer = null;
                }
                _this.statusSetTimeoutRefreshTimer = setInterval(function () {
                    _this.getLatestStatus();
                    _this.findStatusHistoryItems();
                    _this.getAlertTotalByHandleState();
                }, _this.refreshTime);
            },
            //查看异常
            showAbnormal(){
                this.$router.push('VehicleStatusSoloCallPolice');
            },
            //echarts init
            echartsInit(){
                let _this = this;
                let statusNowGaugeDom = document.querySelector('#status-now-gauge'),
                    statusNowLineDom = document.querySelector('#status-now-line');

                _this.statusNowGauge = echarts.init(statusNowGaugeDom);
                _this.statusNowLine = echarts.init(statusNowLineDom);

                _this.statusNowLine.setOption(_this.statusNowLineOption);
                _this.statusNowGauge.setOption(_this.statusGaugeOption);


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
                this._map = TMap.init({
                    container: "status-now-map",
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
        destroyed() {
            let _this = this;
            clearInterval(_this.statusSetTimeoutRefreshTimer);
            _this.statusSetTimeoutRefreshTimer = null;
        },
        watch: {
            currentDeviceId(){
                let _this = this;
                _this.getLatestStatus();                 //车辆数据
                //实时
                _this.findStatusHistoryItems();             //5分钟历史
                _this.getAlertTotalByHandleState();         //异常报警
                //定时刷新
                _this.statusSetTimeoutRefresh();            //实时刷新
            }
        },
        created(){
            if(this.currentDeviceId){
                this.getLatestStatus();                 //车辆数据
            }else{
                this.$router.push('/VehicleStatusSearch');
            }
        },
        mounted(){
            let _this = this;
            _this.$nextTick(function () {
                _this.TmapInit();
                //echarts init
                _this.echartsInit();
                //实时
                _this.findStatusHistoryItems();             //5分钟历史
                _this.getAlertTotalByHandleState();         //异常报警
                //定时刷新
                _this.statusSetTimeoutRefresh();            //实时刷新
            });
        }
    }
</script>

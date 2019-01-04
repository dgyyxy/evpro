<template>
    <div>
        <div class="status-middle-row row">
            <div class="col-md-9 left">
                <div id="status-count-lines-box">
                    <div id="status-count-line-all"></div>
                    <div id="status-count-line-detail"></div>
                </div>
            </div>
            <div class="col-md-3" id="status-count-right">
                <div class="content">
                    <div class="query-top">
                        <div class="title"><span class="glyphicon glyphicon-dashboard"></span> 最近时间
                        </div>
                        <div class="status-radios">
                            <radio v-model="countFastQueryTime" button selected-value="0"
                            >1 天前
                            </radio>
                            <radio v-model="countFastQueryTime" button selected-value="1"
                            >3 天前
                            </radio>
                            <radio v-model="countFastQueryTime" button selected-value="2"
                            >1 周前
                            </radio>
                            <radio v-model="countFastQueryTime" button selected-value="3"
                            >自定义
                            </radio>
                        </div>
                    </div>
                    <div class="query-bottom" v-show="countFastQueryTime === '3'">
                        <div class="title"><span class="glyphicon glyphicon-filter"></span> 时间筛选
                        </div>
                        <date-picker class="date" v-model="countStartDate" :options="datePickerStartOption" type="datetime" placeholder="选择开始时间"
                                     style="width: 180px" :editable="false"></date-picker>
                        <date-picker class="date" v-model="countEndDate" :options="datePickerEndOption" type="datetime" placeholder="选择结束时间"
                                     style="width: 180px" :editable="false"></date-picker>
                    </div>
                    <button class="btn btn-sm btn-success" @click="getCountData()" :disabled="!countFastQueryTime">查询
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
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
    export default{
        data(){
            return {
                countStartDate: null,
                countEndDate: null,
                countFastQueryTime: "",
                countSearch: {
                    deviceType: 'VEHICLE',
                    deviceId: '',
                    startStatTime: '',
                    endStatTime: '',
                    statType: '',
                    codes: []
                },
                countListResult: {},
                statusCountLineAll: null,
                statusCountLineDetail: null,
                statusCountLineAllOption: {
                    title: {
                        text: '故障发生总次数'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        show: true,
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top: 50,
                        containLabel: true,
                        borderColor: "#eeeeee",
                        backgroundColor: "#f6f6f6"
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {show: false},
                        splitLine: {show: true},
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: {
                        name: '故障总数',
                        type: 'line',
                        data: []
                    }
                },
                statusCountLineDetailOption: {
                    title: [{
                        text: '监控项故障发生总次数'
                    }, {
                        text: '筛选项目：',
                        bottom: 30,
                        textStyle: {
                            fontSize: 14,
                            fontWeight: "normal"
                        }
                    }],
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        bottom: 30,
                        data: ['可充电储能装置', '驱动电机', '发动机', '其他故障']
                    },
                    grid: {
                        show: true,
                        left: '3%',
                        right: '4%',
                        bottom: 55,
                        top: 50,
                        containLabel: true,
                        borderColor: "#eeeeee",
                        backgroundColor: "#f6f6f6"
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {show: false},
                        splitLine: {show: true},
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '可充电储能装置',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '驱动电机',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '发动机',
                            type: 'line',
                            data: []
                        },
                        {
                            name: '其他故障',
                            type: 'line',
                            data: []
                        }
                    ]
                }
            }
        },
        components: {
            radio, datePicker
        },
        computed: {
            currentDeviceId(){
                return this.$store.state.vehicleStatusSearch.deviceId;
            },
            monitorCode(){
                return this.$store.state.vehicleStatusSearch.monitorCode;
            },
            datePickerStartOption(){
                let _this = this;
                return {
                    disabledDate (date) {
                        if(_this.countEndDate){
                            return date.valueOf() > Date.now() || date.valueOf() >= _this.countEndDate.getTime();
                        }else{
                            return date.valueOf() > Date.now();
                        }
                    }
                }
            },
            datePickerEndOption() {
                let _this = this;
                return {
                    disabledDate(date){
                        if(_this.countStartDate){
                            return date.valueOf() > Date.now() || date.valueOf() <= _this.countStartDate.getTime();
                        }else{
                            return date.valueOf() > Date.now();
                        }
                    }
                }
            }
        },
        methods: {
            //            ----------------------故障统计------------------------
            getCountData(){
                function todaySetZero(){
                    let today = new Date();
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    return today.getTime();
                }
                let _this = this;
                let countFastQueryTime = _this.countFastQueryTime;
                _this.countSearch.statType = 'DAILY';
                if (countFastQueryTime === "0") {
                    _this.countSearch.endStatTime = todaySetZero();
                    _this.countSearch.startStatTime = _this.countSearch.endStatTime - 1000 * 60 * 60 * 24;
                } else if (countFastQueryTime === "1") {
                    _this.countSearch.endStatTime = todaySetZero();
                    _this.countSearch.startStatTime = _this.countSearch.endStatTime - 1000 * 60 * 60 * 24 * 3;
                } else if (countFastQueryTime === "2") {
                    _this.countSearch.endStatTime = todaySetZero();
                    _this.countSearch.startStatTime = _this.countSearch.endStatTime - 1000 * 60 * 60 * 24 * 7;
                } else if (countFastQueryTime === "3") {
                    if (_this.countStartDate === '') {
                        _this.countSearch.startStatTime = 0;
                    } else {
                        _this.countSearch.startStatTime = _this.countStartDate.getTime();
                        console.log(_this.countSearch.startStatTime);
                    }
                    if (_this.countEndDate === '') {
                        _this.countSearch.endStatTime = new Date().getTime();
                    } else {
                        _this.countSearch.endStatTime = _this.countEndDate.getTime();
                        console.log(_this.countSearch.endStatTime);
                    }
                }
                _this.countSearch.codes = _this.monitorCode;
                _this.countSearch.deviceId = _this.currentDeviceId;
                console.log(_this.countSearch);
                _this.$http.post('api/findFaultReport', _this.countSearch, {params: {name: "VEHICLE_STATUS_REPORT"}}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.countListResult = data.body.data.data;
                        if (_this.countListResult.times.length) {
                            _this.statusCountLineAllOption.xAxis.data = _this.countListResult.times;
                            _this.statusCountLineAllOption.series.data = _this.countListResult.totalArr;
                            _this.statusCountLineDetailOption.xAxis.data = _this.countListResult.times;
                            _this.statusCountLineDetailOption.series[0].data = _this.countListResult.chargingArr;
                            _this.statusCountLineDetailOption.series[1].data = _this.countListResult.driveArr;
                            _this.statusCountLineDetailOption.series[2].data = _this.countListResult.motorArr;
                            _this.statusCountLineDetailOption.series[3].data = _this.countListResult.otherArr;
                            _this.statusCountLineAll.setOption(_this.statusCountLineAllOption);
                            _this.statusCountLineDetail.setOption(_this.statusCountLineDetailOption);
                        } else {
                            _this.statusCountLineAllOption.xAxis.data = [];
                            _this.statusCountLineAllOption.series.data = [];
                            _this.statusCountLineDetailOption.xAxis.data = [];
                            _this.statusCountLineDetailOption.series[0].data = [];
                            _this.statusCountLineDetailOption.series[1].data = [];
                            _this.statusCountLineDetailOption.series[2].data = [];
                            _this.statusCountLineDetailOption.series[3].data = [];
                            _this.statusCountLineAll.setOption(_this.statusCountLineAllOption);
                            _this.statusCountLineDetail.setOption(_this.statusCountLineDetailOption);
                            _this.$store.dispatch('setWindowAlert', {
                                type: "success",
                                text: "无故障数据"
                            })
                        }
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取故障数据失败"
                        })
                    }
                });
            },

            //echarts init
            echartsInit(){
                let _this = this;
                let statusCountLineAllDom = document.querySelector('#status-count-line-all'),
                    statusCountLineDetailDom = document.querySelector('#status-count-line-detail');

                _this.statusCountLineAll = echarts.init(statusCountLineAllDom);
                _this.statusCountLineDetail = echarts.init(statusCountLineDetailDom);

                _this.statusCountLineAll.setOption(_this.statusCountLineAllOption);
                _this.statusCountLineDetail.setOption(_this.statusCountLineDetailOption);
            },
        },
        mounted(){
            let _this = this;
            //echarts init
            _this.$nextTick(function () {
                _this.echartsInit();
            });
        }
    }
</script>

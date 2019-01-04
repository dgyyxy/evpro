<template>
    <div id="full-screen">
        <!--车辆查询-->
        <modal large v-model="vehicleSearchShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="vehicleSearchShow=false"><span>×</span></button>
                <h4 class="modal-title">车辆查询</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form @submit.prevent="vehicleSearch(1)" class="form-inline m-bottom-sm" role="form" novalidate>
                    <div class="form-group">
                        <select class="form-control" v-model="vehicleInfo.type">
                            <option v-for="type in searchTypes" v-bind:value="type.value">{{type.name}}</option>
                        </select>
                        <input type="text" class="form-control" v-model="vehicleInfo.keyword" placeholder="关键字"/>
                    </div>
                    <button type="button" class="btn btn-sm btn-success" v-on:click="vehicleSearch(1)">搜索</button>
                </form>
                <div class="data-table table-responsive">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>车辆VIN</th>
                            <th>品牌</th>
                            <th>车系</th>
                            <th>车型</th>
                            <th>车牌号码</th>
                            <th>车主姓名</th>
                            <th>SIM卡电话号码</th>
                            <th>设备号码</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="vehicle in vehicleList">
                            <td>{{vehicle.vin}}</td>
                            <td>{{vehicle.brandName}}</td>
                            <td>{{vehicle.seriesName}}</td>
                            <td>{{vehicle.modelName}}</td>
                            <td>{{vehicle.licensePlate}}</td>
                            <td>{{vehicle.ownerName}}</td>
                            <td>{{vehicle.simNumber}}</td>
                            <td>{{vehicle.deviceSN}}</td>
                            <td>
                                <i-button type="ghost" size="small" icon="document-text" v-on:click="searchVehicleStatus(vehicle)">查看</i-button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination-row clearfix">
                    <div class="pull-right pull-left-sm">
                        <zpagenav :page="vehicleInfo.pageIndex" :page-size="vehicleInfo.pageSize"
                                  :total="vehiclePage.totalCount" :max-link="vehiclePage.maxLink"
                                  :page-handler="vehiclePageHandler"></zpagenav>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="vehicleSearchShow=false">取消</button>
            </div>
        </modal>
        <alert v-model="windowAlertParam.isShow" placement="top" duration="0" :type="windowAlertParam.type"
               width="400px" dismissable>
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p>{{windowAlertParam.text}}！</p>
        </alert>
        <ul class="breadcrumb">
            <li>车辆状态监控</li>
            <li>车辆状态查询</li>
            <div style="float: right;margin-top: -6px;">
                <button type="button" class="right btn btn-sm btn-success" @click="handleFullScreen()">
                    {{fullScreenText}}
                </button>
            </div>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form @submit.prevent="vehicleSearch(1)" class="form-inline no-margin">
                        <div class="form-group">
                            <select class="form-control" v-model="vehicleInfo.type">
                                <option v-for="type in searchTypes" v-bind:value="type.value">{{type.name}}</option>
                            </select>
                            <input type="text" class="form-control" v-model="vehicleInfo.keyword" placeholder="关键字"/>
                        </div>
                        <button type="button" class="btn btn-sm btn-success m-left-sm" v-on:click="vehicleSearch(1)">搜索</button>
                        <div class="form-group vehicle-double-detail m-left-sm" v-show="vehicleInfoShow">
                            <div>
                                <div>VIN: {{vehicleInfoDisplay.vin}}</div>
                                <div>车型：{{vehicleInfoDisplay.modelName}}</div>
                            </div>
                            <div>
                                <div>车牌：{{vehicleInfoDisplay.licensePlate}}</div>
                                <div>车主姓名：{{vehicleInfoDisplay.ownerName}}</div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="tab-container" v-show="vehicleInfoShow" id="status-tab">
            <ul class="nav-tabs clearfix">
                <router-link :to="{path:'/status/VehicleStatusSearch/VehicleStatusLatest'}" tag="li" active-class="active">
                    <a>车辆实时状态</a>
                </router-link>
                <router-link :to="{path:'/status/VehicleStatusSearch/VehicleStatusHistory'}" tag="li" active-class="active">
                    <a>历史状态</a>
                </router-link>
                <router-link :to="{path:'/status/VehicleStatusSearch/VehicleStatusSoloCallPolice'}" tag="li" active-class="active">
                    <a>实时报警</a>
                </router-link>
                <router-link :to="{path:'/status/VehicleStatusSearch/VehicleStatusFaultCount'}" tag="li" active-class="active">
                    <a>状态统计</a>
                </router-link>
            </ul>
            <router-view></router-view>
        </div>
    </div>
</template>
<style>

    .modal {
        position: absolute;
    }

    .status-haserror {
        color: #e42727;
    }

    /*---------------车辆信息双行隔线组件----------------*/
    .vehicle-double-detail {
        overflow: hidden;
    }

    .vehicle-double-detail > div {
        float: left;
        margin-right:10px;
    }
    /*---------------选项卡组件----------------*/
    #status-tab .time-refresh-option {
        line-height: 30px;
        position: absolute;
        right: 34px;
        top: 122px;
        overflow: hidden;
    }

    #status-tab .time-refresh-option > div {
        float: left;
    }

    #status-tab .time-refresh-option > div:first-child,
    #status-tab .time-refresh-option > div:nth-child(2) {
        margin-right: 10px;
    }

    #status-tab > .nav-tabs {
        background-color: #ffffff;
        padding-left: 10px;
        height: 42px;
        line-height: 42px;
    }

    #status-tab > .nav-tabs > li {
        margin-right: 24px;
    }

    #status-tab > .nav-tabs > li > a {
        color: #333333;
        padding: 10px 14px;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
        border: 0;
    }

    #status-tab > .nav-tabs > li > a:hover {
        color: #32c5cd;
        background-color: transparent;
        border: 0;
    }

    #status-tab > .nav-tabs > li.active > a {
        color: #32c5cd;
        border: 0;
        border-bottom: solid 3px #32c5cd;
    }

    /*--------------实时和历史------------------*/
    .status-middle-row {
        background: #ffffff;
        min-height: 392px;
    }

    .status-middle-row .left {
        border-right: solid 1px #ccc;
        padding-left: 0;
        padding-right: 0;
    }

    .status-middle-row .left .veh-survey {
        position: relative;
        margin-top: 30px;
        margin-bottom: 16px;
        padding-left: 10px;
        padding-right: 10px;
        height: 100px;
    }

    .status-middle-row .left .veh-survey .title {
        position: absolute;
        top: -19px;
        left: 25px;
        background-color: #4c5f70;
        display: block;
        padding: 2px 5px;
        color: #ffffff;
    }

    .status-middle-row .left .veh-survey table{
        font-size:12px;
    }

    .status-middle-row .left .veh-survey table td{
        height: 51px;
    }

    /*历史右*/
    #status-history-right {
        padding: 0;
    }

    #status-history-query {
        padding: 0;
        border-right: solid 1px #ccc;
        height: 392px;
    }

    #status-history-query > .content {
        width: 184px;
        margin: 0 auto;
    }

    #status-history-query .title {
        color: #8c9dad;
        padding: 12px 0 12px 6px;

    }

    #status-history-query .query-top {
        margin-top: 5px;
    }

    #status-history-query .status-radios {
        overflow: hidden;
    }

    #status-history-query .status-radios > label {
        display: block;
        float: left;
        margin-left: 10px;
        margin-top: 10px;
    }

    .status-radios > label.active {
        background-color: #32c5cd;
        color: #fff;
    }

    .status-radios > label.active:hover {
        background-color: #32c5cd;
        color: #fff;
    }

    #status-history-query .btn-sm {
        margin-left: 18px;
        margin-top: 15px;
    }

    #status-history-query .query-bottom {
        margin-top: 16px;
    }

    #status-history-query .date {
        margin-top: 10px;
        margin-bottom: 6px;
    }

    #status-history-choose {
        height: 392px;
        font-size:12px;
        text-align: center;
    }

    #status-history-choose > .content {
        width: 130px;
        height: 392px;
        margin: 18px auto 0;
        position: relative;
    }

    #status-history-choose .list > div {
        margin: 12px 0;
        color: #666666;
        cursor: pointer;
    }

    #status-history-choose .list > div:hover {
        color: #32c5cd;
    }

    #status-history-choose .list > div.active {
        border-bottom: solid 2px #32c5cd;
    }

    #status-history-choose .page {
        position: absolute;
        right: 2px;
        bottom: 35px;
    }

    /*地图*/
    .status-map-wrap {
        width: 100%;
        height: 246px;
        position: relative;
    }

    .status-map-wrap .title {
        position: absolute;
        height: 40px;
        line-height: 40px;
        background-color: rgba(0, 0, 0, .7);
        top: 0;
        z-index: 10;
        width: 100%;
        color: #fff;
        overflow: hidden;
    }

    .status-map-wrap .title > * {
        float: left;
    }

    .status-map-wrap i {
        font-style: normal;
    }

    .status-map-wrap .title.history-title span:first-of-type {
        width: 100%;
    }

    .status-map-wrap .title span {
        margin-left: 10px;
    }

    .status-map-wrap .title span:first-of-type {
        width: 56%;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .status-map-wrap .title span:nth-last-of-type(2) {
        width: 24%;
    }

    .status-map-wrap .title a {
        color: #00adb3;
        text-decoration: underline;
    }

    #status-now-map {
        width: 100%;
        height: 100%;
    }

    #status-history-map {
        width: 100%;
        height: 100%;
    }

    .status-middle-row .middle {
        border-right: solid 1px #ccc;
        height: 392px;
    }

    #status-now-gauge {
        width: 250px;
        height: 390px;
        margin: 0 auto;
    }

    #status-history-gauge {
        width: 250px;
        height: 390px;
        margin: 0 auto;
    }

    #status-now-line {
        margin: 0 auto;
        height: 390px;
        width: 340px;
    }

    /*-------------------实时和历史底部----------------*/
    /*------------箭头--------------*/
    .status-bottom-tb {
        position: relative;
    }

    .status-bottom-tb-tab {
        margin: 10px 20px 0;
        overflow: hidden;
    }

    .status-bottom-tb .next-prev-arrow > li {
        position: absolute;
        width: 14px;
        height: 32px;
        background-color: #00adb2;
        top: 0;
        color: #ffffff;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
    }

    .status-bottom-tb .next-prev-arrow > li:first-child {
        left: 6px;
    }

    .status-bottom-tb .next-prev-arrow > li:last-child {
        right: 6px;
    }

    /*-------表格-----------*/
    .status-bottom-tb-tab {
        position: relative;
    }

    .status-bottom-tb-tab > .nav-tabs {
        border-bottom: solid 1px #2baab1;
        margin-bottom: 0;
        white-space: nowrap;
        position: absolute;
        min-width: 100%;
        height: 32px;
    }

    .status-bottom-tb-tab > .nav-tabs > li {
        display: inline-block;
        float: none;
    }

    .status-bottom-tb-tab > .nav-tabs > li > a {
        border: 0;
        padding: 7px 12px;
        margin-right: 0;
    }

    .status-bottom-tb-tab > .nav-tabs > li.active > a {
        color: #2baab1;
        border: solid 1px #2baab1;
        border-bottom-color: transparent;
        border-radius: 0;
    }

    .status-bottom-tb-tab > .nav-tabs > li.active > a:hover {
        border: solid 1px #2baab1;
        background-color: #ffffff;
        border-bottom-color: transparent;
    }

    .status-bottom-tb-tab > .nav-tabs > li > a:hover {
        background-color: transparent;
        border: 0;
    }

    .status-bottom-tb-tab > .tab-content {
        margin-top: 31px;
    }

    .status-bottom-tb-tab .table-bordered {
        background-color: #fff;
    }

    /*---------报警-------*/
    #status-soloalert-alertnum {
        background-color: #4c5f70;
        color: #ffffff;
        line-height: 35px;
        margin: 10px 0;
        padding: 2px 15px;
    }

    .status-alert-detail-top {
        font-size: 14px;
        line-height: 30px;
        margin-bottom: 4px;
    }

    .status-alert-detail-bottom {
        border-top: solid 1px #ccc;
    }

    .status-alert-detail-bottom .status-alert-detail-title {
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 6px;
        margin-top: 12px;
    }

    .alert-checked-tr {
        cursor: pointer;
    }

    .status-alert-activetr {
        color: #666;
        background-color: #e5edf4;
    }

    /*---故障统计----*/
    #status-count-lines-box {
        width: 700px;
        height: 600px;
        margin: 0 auto;
    }

    #status-count-line-all {
        width: 700px;
        height: 260px;
        margin-top: 10px;
    }

    #status-count-line-detail {
        width: 700px;
        height: 260px;
        margin-top: 10px;
    }

    #status-count-right {
        padding: 0;
    }

    #status-count-right {
        padding: 0;
        border-right: solid 1px #ccc;
        height: 392px;
    }

    #status-count-right > .content {
        width: 184px;
        margin: 0 auto;
    }

    #status-count-right .title {
        color: #8c9dad;
        padding: 12px 0 12px 6px;

    }

    #status-count-right .query-top {
        margin-top: 5px;
    }

    #status-count-right .status-radios {
        overflow: hidden;
    }

    #status-count-right .status-radios > label {
        display: block;
        float: left;
        margin-left: 10px;
        margin-top: 10px;
    }

    #status-count-right .status-radios > label.active {
        background-color: #32c5cd;
        color: #fff;
    }

    #status-count-right .status-radios > label.active:hover {
        background-color: #32c5cd;
        color: #fff;
    }

    #status-count-right .btn-sm {
        margin-left: 18px;
        margin-top: 10px;
    }

    #status-count-right .query-bottom {
        margin-top: 10px;
    }
</style>
<script>
    import {TMap} from '../common/AMap';
    import {modal, alert} from 'vue-strap';
    import $ from 'jquery';

    export default{
        data(){
            return {
                vehicleSearchShow: false,
                vehicleInfoShow: false,
                vehicleList: [],
                allCategories: [],
                vehicleInfo: {
                    type: 'vin',
                    keyword: '',
                    pageIndex: 1,
                    pageSize: 10
                },
                vehicleInfoDisplay: {},
                searchTypes: [
                    {
                        value: "vin",
                        name: "VIN"
                    },
                    {
                        value: "licensePlate",
                        name: "车牌号"
                    },
                    {
                        value: "ownerName",
                        name: "车主姓名"
                    },
                    {
                        value: "simNumber",
                        name: "SIM卡电话号码"
                    }
                ],
                vehiclePage: {
                    maxLink: 5,
                    totalCount: 0
                },
                fullScreenText: "全屏显示",
            }
        },
        computed: {
            windowAlertParam(){
                return this.$store.state.vehicleStatusSearch.alert;
            }
        },
        components: {
            modal,
            alert,
        },
        methods: {
            //搜索列表
            vehicleSearch(reset){
                let _this = this;
                _this.vehicleSearchShow = true;
                if (reset) {
                    _this.vehicleInfo.pageIndex = 1;
                }
                _this.$http.get('api/getVehInfoList', {params: _this.vehicleInfo}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.vehicleList = data.body.datas;
                        _this.vehicleInfo.pageIndex = data.body.pageIndex;
                        _this.vehiclePage.totalCount = data.body.totalCount;
                    }
                });
            },
            //翻页
            vehiclePageHandler(pageIndex){
                this.vehicleInfo.pageIndex = pageIndex;
                this.vehicleSearch();
            },

            //查看某车详细
            searchVehicleStatus(req){
                let _this = this;
                _this.vehicleSearchShow = false;
                _this.vehicleInfoShow = true;
                _this.vehicleInfoDisplay = req;
                _this.$store.commit('SET_DEVICE_ID', req.vin);
                _this.$router.push('/status/VehicleStatusSearch/VehicleStatusLatest');
            },
            //获取所有group
            getAllCategories(){
                let _this = this;
                _this.$http.get('api/getAllCategories', null).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.allCategories = data.body.data;
                        let groupKeys = [];
                        let groupNames = [];
                        for (let i = 0; i < _this.allCategories.length; i++) {
                            if(!_this.allCategories[i].ignore){
                                groupKeys.push(_this.allCategories[i].name);
                                groupNames.push(_this.allCategories[i].description);
                            }
                        }
                        groupKeys = groupKeys.join(',');
                        _this.$store.commit('SET_GROUPKEYS', {groupKeys:groupKeys,groupNames:groupNames});
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取详细数据分类失败"
                        })
                    }
                });
            },
            //获取所有监控项id
            getGlobalStatusesByCategory(){
                let _this = this;
                _this.$http.get('api/getGlobalStatusesByCategory', {params: {category: "1010"}}).then(function (data) {
                    if (data.body.status === "SUCCEED") {
                        _this.$store.commit('SET_MONITOR_CODE', data.body.data);
                    } else {
                        _this.$store.dispatch('setWindowAlert', {
                            type: "danger",
                            text: "获取监控项code失败"
                        })
                    }
                });
            },

            //dom操作
            handleFullScreen(){
                if(parent.vm){
                    if(this.fullScreenText === '全屏显示'){
                        this.fullScreenText = '退出全屏';
                        parent.vm.$store.commit('SET_FULL_SCREEN');
                    }else{
                        this.fullScreenText = '全屏显示';
                        parent.vm.$store.commit('CANCEL_FULL_SCREEN');
                    }
                }
            }
        },
        created(){
            let _this = this;
            _this.vehicleSearch();
            _this.getAllCategories();
            _this.getGlobalStatusesByCategory();
        },
        mounted(){


        }

    }
</script>
<template>
        <div>
        <div class="container-fluid content no-padding">
            <div class="row statistic-head">
                <div class="col-xs-12 col-sm-4"></div>
                <div class="col-xs-12 col-sm-4 text-c"><span id="nowTime" class="font-15"></span></div>
                <div class="col-xs-12 col-sm-4 text-r"><button type="button" @click="fullScreen" class="btn btn-success">{{btnText}}</button></div>
            </div>
        </div>
        <div class="con-container">
            <div class="left-container" :class="{ 'block-left': mapLeft, 'none-left':  !mapLeft}">
                <div class="tab-container">
                    <tabs >
                        <tab header="车辆监控" v-if="false">
                            <div class="tree-container" style="overflow-y:auto;" v-bind:style="{ height: autoHeight + 'px' }">
                                <ul id="treeDemo" class="ztree"></ul>
                            </div>
                        </tab>
                        <tab header="搜索">
                            <form class="form-horizontal" style="width: 94%;" v-if="!searchCall" @submit.prevent="searchVehicle">
                                <div class="form-group">
                                    <label class="col-md-4 col-sm-4 control-label" style="padding-right: 0;">省：</label>
                                    <div class="col-md-8 col-sm-8">
                                        <select class="form-control input-sm" v-model="proCitySel.province">
                                            <option value="">--请选择--</option>
                                            <option v-for="province in provincesAndCities" v-bind:value="province">{{province.name}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-4 col-sm-4 control-label" style="padding-right: 0;">市：</label>
                                    <div class="col-md-8 col-sm-8">
                                        <select class="form-control input-sm" v-model="proCitySel.city">
                                            <option value="">--请选择--</option>
                                            <option v-for="city in proCitySel.province.divisions" v-bind:value="city">{{city.name}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-4 col-sm-4 control-label" style="padding-right: 0;">搜索条件：</label>
                                    <div class="col-md-8 col-sm-8">
                                        <select class="form-control input-sm" v-model="searchVehData.type">
                                            <option v-for="conditions in searchCriteria" v-bind:value="conditions.value">{{conditions.name}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-4 col-sm-4 control-label" style="padding-right: 0;">关键词：</label>
                                    <div class="col-md-8 col-sm-8">
                                        <input type="text" class="form-control input-sm" v-model="searchVehData.keyword" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-4 col-sm-4 control-label" style="padding-right: 0;">状态：</label>
                                    <div class="col-md-8 col-sm-8">
                                        <select class="form-control input-sm" v-model="searchVehData.status">
                                            <option value="">--请选择--</option>
                                            <option v-for="status in statusList" v-bind:value="status.value">{{status.name}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div style="float: right;">
                                    <button type="button" class="btn btn-sm btn-success" @click="searchVehicle">搜索</button>
                                </div>
                            </form>
                            <div v-if="searchCall">
                                <div>
                                    <label class="control-label" style="margin-left:10px;">搜索条件：</label>
                                    <span class="searchinfo" v-show="searchitem" track-by="$index" v-for="searchitem in searchcondition">{{searchitem}}</span>
                                    <button type="button" class="btn btn-sm btn-success right" style="margin-right:15px;" @click="searchReset">重置</button>
                                </div>
                            </div>
                            <div class="searchpanel" v-if="searchCall">
                                <div class="data-table table-responsive searchcontent" style="margin-bottom: 15px;">
                                    <table class="table table-striped" id="dataTable">
                                        <thead>
                                        <tr>
                                            <th>
                                                <input type="checkbox" class="checkVehAll" v-model="vehSelectAll" @click="vehSelectAllCall">
                                            </th>
                                            <th>车主</th>
                                            <th>设备号</th>
                                            <th>状态</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="(vehicle,index) in vehicleList" 
                                        @click="checkTr(vehicle,index)" 
                                        style="cursor: pointer">
                                            <td><input 
                                            type="checkbox" 
                                            class="checkVeh" 
                                            :disabled="vehicle.vehicleStatus=='OFFLINE'||vehicle.vehicleStatus=='ONLINE'||vehicle.vehicleStatus=='ALERT'?false:true" 
                                            v-model="checkboxModel" 
                                            :value="vehicle"></td>
                                            <td>{{vehicle.ownerName}}</td>
                                            <td>{{vehicle.deviceSN}}</td>
                                            <td v-text="statusChange(vehicle.vehicleStatus,vehicle)"></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="pagination-row clearfix">
                                    <div class="pull-right pull-left-sm">
                                    <zpagenav :page="searchVehData.pageIndex" :total="searchVehData.totalCount" :page-size="searchVehData.pageSize" :max-link=5 :page-handler="search"></zpagenav>
                                    </div>
                                </div>

                            </div>
                        </tab>
                    </tabs>
                </div>
            </div>
            <div id="mcontainer" :class="{ 'display-left': mapLeft }"></div>
            <div class="sa-container">
                <a @click="displayLeft" class="sa">
                    <span>监</span>
                    <span>控</span>
                    <span>列</span>
                    <span>表</span>
                </a>
            </div>
            <div class="stat-container">
                <a class="totalcount" @click="clickStatus('')">
                    <span>总数</span>
                    <b>{{totalCount}}</b>
                </a>
                <a class="online" @click="clickStatus('online')">
                    <span>在线</span>
                    <b>{{onlineCount}}</b>
                </a>
                <a class="offline" @click="clickStatus('offline')">
                    <span>离线</span>
                    <b>{{offlineCount}}</b>
                </a>
                <a class="alert" @click="clickStatus('alert')">
                    <span>故障</span>
                    <b>{{breakdownCount}}</b>
                </a>
            </div>
            <div class="location-position-map-btn">
                <button type="button" class="btn btn-success right" title="车辆居中" @click="mapToCenter"
                        v-show="checkboxModel.length==1?true:false"><i class="glyphicon glyphicon-screenshot"></i></button>
                <button type="button" class="btn btn-success right m-right-sm" title="地图放大至最大倍数" @click="mapToMaxZoom"
                        v-show="checkboxModel.length==1?true:false"><i class="glyphicon glyphicon-resize-full"></i></button>
            </div>
        </div>
    </div>
</template>
<style scoped>
    #app{
        height: 100%;
    }
    .view{
        height: 100%;
        width: 100%;
    }
    .view .transition{
        opacity: .2;
        box-sizing: border-box;
        padding: 8px 20px;
    }
    .view .v-enter,
    .view .v-leave{
        opacity: 0;
    }
    a {
        color: #4c5f70;
    }
    .m-r-1{
        margin-right: 1rem !important;
    }
    #dayCountRemind{color: red; display: none; padding: 5px 0 0 75px;}
    .content{width: 100%; position: absolute; top: 0; z-index: 6; overflow: hidden;}
    .statistic-head{line-height: 37px; color: #fff;  background-color: #333;}
    .statistic-head .btn{padding: 5px 10px; font-size: 12px; line-height: 1;}
    .text-c{text-align: center;}
    .text-r{text-align: right;}
    .font-15{font-size: 15px; font-weight: 700;}
    .con-container{
        position: absolute;
        width: 100%;
        padding-top: 39px;
        height: 100%;
    }
    #mcontainer{
        box-sizing: border-box;
        height: 100%;
        border: 1px solid #e6e6e6;
        border-radius: 3px;
        transition: all .5s ease;
    }
    .display-left{
        transition: all .2s ease;
        margin-left: 320px;
    }
    .none-left{
        left: -500px;
    }
    .block-left{
        left: 0;
    }
    .left-container{
        position: absolute;
        top: 0;
        padding-top: 38px;
        width: 320px;
        background-color: #ffffff;
        height: 100%;
        transition: all .5s ease;
    }
    .tab-container {
        height: 100%;
        width: 100%;
    }
    .tab-container .nav-tabs{
        background-color: #f2f2f2;
        width: 100%;
        height: 40px;
    }
    .sheader{
        padding: 10px;
        text-align: center;
        font-weight: bold;
        background: #14171b;
        color: #abafbc;
    }
    .scontent{
        padding: 10px;
    }
    .scontent input{
        height: 25px;
        font-size: 12px;
        border-color: #e4e4e4;
        background: #f2f2f2;
        margin: 0;
        border-radius: 4px;
        box-shadow: inset 0 1px 1px #f2f2f2;
    }
    .scontent .form-group{
        margin-left: 0;
        margin-right: 0;
        margin-bottom: 0;
    }
    .sfooter{
        position: absolute;
        text-align: center;
        width: 100%;
        padding: 10px;
        left: 0;
        bottom: 0;
    }
    .sfooter .btn{
        margin: 0 15px;
    }
    .btn {
        transition: background-color .3s ease;
    }
    .btn:focus,.btn:hover {
        outline: 0;
        transition: background-color .3s ease;
    }
    .btn.btn-success {
        background: #2baab1;
        border: 1px solid #26969c
    }
    .btn.btn-success.active,.btn.btn-success:active,.btn.btn-success:focus,.btn.btn-success:hover {
        background: #32c5cd;
        transition: all .3s ease;
    }
    .btn.btn-danger {
        background: #e36159;
        border: 1px solid #df4c43
    }
    .btn.btn-danger.active,.btn.btn-danger:active,.btn.btn-danger:focus,.btn.btn-danger:hover {
        background: #e87e78;
        transition: all .3s ease;
    }
    .icon-color{
        color: #df4c43;
    }
    .sa-container{
        position: absolute;
        left: 320px;
        top: 60%;
        z-index: 1;
    }
    .sa{
        cursor: pointer;
        display: block;
        background-color: #df4c43;
        padding: 10px 5px;
        color: #ffffff;
        letter-spacing: 8px;
        font-weight: bold;
        border: 1px solid #df4c43;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
    }
    .sa:active,.sa:focus,.sa:hover{
        background: #e87e78;
        transition: all .3s ease;
        color: #ffffff;
    }
    .sa>span{
        width:100%;
        line-height:18px;
        display: block;
        text-align: center;
    }
    .stat-container{
        position: absolute;
        right: 25px;
        top: 60px;
        z-index: 1;
    }
    .stat-container a{
        cursor: pointer;
        padding: 8px 10px;
        color: #ffffff;
        float: left;
    }
    .stat-container a b{
        font-size: 14px;
        color: #df4c43;
    }
    .online{
        border: 1px solid #2baab1;
        border-radius: 20px;
        line-height: 14px;
        margin-left: 5px;
        background: #2baab1;
    }
    .alert{
        border: 1px solid #f1ca8c;
        border-radius: 20px;
        line-height: 14px;
        margin-left: 5px;
        background: #f1ca8c;
    }
    .offline{
        border: 1px solid #848484;
        border-radius:20px;
        line-height: 14px;
        margin-left: 5px;
        background: #848484;
    }
    .totalcount{
        border: 1px solid #659cff;
        border-radius: 20px;
        line-height: 14px;
        background: #659cff;
    }
    .searchpanel{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 100%;
        height:70%;
    }
    .searchcontent{
        height:80%;
        overflow-y:auto;
    }
    .searchinfo{
        font-size:13px;
        color:#666;
        margin:0 5px;
        width:auto;
        padding:3px;
        height:23px;
        border:1px solid #df4c43;
        display:inline-block;
    }
    .searchPage{
        position:absolute;
        bottom:0;
        right:10px;
    }
    .right{
        float:right;
    }
    .hide{
        display:none;
    }
    .data-table table thead tr th{
        background: #137ec3;
        color: #fff;
    }
    .table-bordered, .table-bordered>tbody>tr>td, .table-bordered>tbody>tr>th, .table-bordered>tfoot>tr>td, .table-bordered>tfoot>tr>th, .table-bordered>thead>tr>td, .table-bordered>thead>tr>th{
        border: 1px solid #ddd;
    }
    .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th{
        padding: 8px;
        line-height: 1.42857143;
        vertical-align: top;
    }
    .map-style-change{
        position: absolute;
        right:25px;
        bottom:20px;
        z-index:1;
    }
    .location-position-map-btn{
        position: absolute;
        top: 115px;
        right: 25px;
        z-index: 1;
    }
    .glyphicon {
        position: relative;
        top: 1px;
        display: inline-block;
        font-family: Glyphicons Halflings;
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
<script>
    import '../common/ajax.js';
    import { TMap } from '../common/AMap';
    import { tabs, tab } from 'vue-strap';
    import GPS from '../common/gps';

    function getLoanVehicleList(){
        console.log( this.searchVehData )
        let _this = this;
        _this.searchVehData.provinceCode = _this.proCitySel.province.id;
        _this.searchVehData.cityCode = _this.proCitySel.city.id;
        _this.$http.get('api/getLocationVehicleList', {params: _this.searchVehData}).then(function(res){
            if(res.body.status){
                console.log( res.body )
                console.log( res.body.data )
                _this.vehicleList = res.body.data;
                _this.searchVehData.pageIndex = res.body.pageIndex;
                _this.searchVehData.totalCount = res.body.totalCount;
            }
        });
    }

    function getAutoHeight(){
        this.autoHeight = document.documentElement.clientHeight-100;
    }

    export default{
        data(){
            return{
                btnText: '全屏显示',
                permission:{},
                mapLeft: true,
                vehSelectAll:false,
                provincesAndCities: [],
                token:"",
                statusList:[
                    {
                        "value":"ONLINE",
                        "name":"在线"
                    },
                    {
                        "value":"OFFLINE",
                        "name":"离线"
                    },
                    {
                        "value":"ALERT",
                        "name":"故障"
                    },
                    {
                        "value":"NOT_MONITOR",
                        "name":"未监控"
                    }
                ],
                searchVehData: {
                    provinceCode: "",
                    cityCode: "",
                    type: "deviceSN",
                    keyword: "",
                    status: "",
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                proCitySel: {
                    province: "",
                    city: ""
                },
                vehicleList: [],
                checked: "",
                checkboxModel: [],
                searchCall:false,
                searchcondition:[],
                onlineCount : 0,
                offlineCount : 0,
                totalCount:0,
                breakdownCount: 0,
                autoHeight : 0,
                searchCriteria:[
                    {
                        value:'deviceSN',
                        name:'设备号'
                    },
                    {
                        value:'ownerName',
                        name:'车主姓名'
                    },
                    {
                        value:'dealerName',
                        name:'经销商名称'
                    },
                    {
                        value:'simNumber',
                        name:'SIM卡号'
                    },
                    {
                        value:'vin',
                        name:'VIN'
                    }
                ]
            }
        },
        components:{
            tabs,
            tab
        },
        created() {
            let _this = this;
            getAutoHeight.apply(this, []);
            let resData = {};

            _this.$http.get('api/getAlertDeviceTotal',{params:{deviceType:'VEHICLE',handleStates:0}}).then(function(res){
                if(res.body.status === "SUCCEED"){
                    resData = res.body.data;
                    _this.breakdownCount = resData.alertDeviceTotal;
                }
            });

            _this.$http.get('api/findProvincesAndCities').then(function(res){
                if(res.body.status && res.body.data[0]){
                    _this.provincesAndCities = res.body.data[0].divisions;
                }
            });

            _this.$http.get('api/getLocationVehicleOnline').then(function(res){
                if(res.body.status){
                    resData = res.body.data;
                    _this.onlineCount = resData.onlineCount;
                    _this.offlineCount = resData.offlineCount;
                    _this.totalCount = resData.totalCount;
                }
            });

//            _this.$http.get('api/findFunctionsByResource').then(function(res){
//                if(res.body.status && res.body.admin){
//                    _this.permission = res.body.admin.permission;
//                    _this.token = res.body.token;
//                }
//            });
        },
        methods: {
            mapToCenter(){
                TMap.mapToVehCenter(this.checkboxModel[0]);
            },
            mapToMaxZoom(){
                TMap.mapToMaxZoom(18);
            },
            clickStatus(status){
                let _this = this;
                _this.searchVehData = {
                    provinceCode: "",
                    cityCode: "",
                    type: "deviceSN",
                    keyword: "",
                    status: status.toUpperCase(),
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0
                };
                this.searchVehicle();
            },
            vehSelectAllCall: function() {
                let checkboxModelTemp = [];
                if (this.vehSelectAll) {
                    this.vehicleList.forEach((vehicle) => {
                        checkboxModelTemp.push(vehicle);
                    });
                }
                this.checkboxModel = checkboxModelTemp;
            },
            fullScreen(){
                if(parent.vm){
                    if(this.btnText === '全屏显示'){
                        this.btnText = '退出全屏';
                        parent.vm.$store.commit('SET_FULL_SCREEN');
                        getAutoHeight.apply(this, []);
                    }else{
                        this.btnText = '全屏显示';
                        parent.vm.$store.commit('CANCEL_FULL_SCREEN');
                        getAutoHeight.apply(this, []);
                    }
                }
            },
            displayLeft(){
                this.mapLeft = !this.mapLeft;
                if(this.mapLeft){
                    $(".sa-container").css('left','320px');
                }else{
                    $(".sa-container").css('left','0');
                }
            },
            searchVehicle(){
                let _this = this;
                let searchVehName,searchVehStatus;
                _this.searchVehData.pageIndex = 1;
                _this.searchCall = true;
                getLoanVehicleList.apply(this, []);
                for(var i in _this.searchCriteria){
                    if(_this.searchVehData.type==_this.searchCriteria[i].value){
                        searchVehName = _this.searchCriteria[i].name;
                    }
                }
                for(var i in _this.statusList){
                    if(_this.searchVehData.status==_this.statusList[i].value){
                        searchVehStatus = _this.statusList[i].name;
                    }
                }
                _this.searchcondition=[_this.proCitySel.province.name,_this.proCitySel.city.name,searchVehName,_this.searchVehData.keyword,searchVehStatus];
            },
            searchReset(){
                this.searchCall = false;
                this.searchcondition = [];
                this.checkboxModel = [];
                this.proCitySel = {
                    province : "",
                    city :  ""
                };
            },
            search(page){
                this.searchVehData.pageIndex = page;
                getLoanVehicleList.apply(this, []);
            },
            statusChange(status,vehicle){
                switch (status){
                    case "OFFLINE":
                        return vehicle.offlineTime ? vehicle.offlineTime : '离线';
                        break;
                    case "ONLINE":
                        return "在线";
                        break;
                    case "ALERT":
                        return "故障";
                        break;
                    default:
                        return "未监控";
                }
            },
            checkTr(veh,index){
                if( veh.vehicleStatus=='OFFLINE'||
                    veh.vehicleStatus=='ONLINE'||
                    veh.vehicleStatus=='ALERT'){
                    let isCheck = $(".checkVeh").eq(index)[0].checked;
                    if(isCheck){
                        $(".checkVeh").eq(index)[0].checked = false;
                        this.checkboxModel = this.checkboxModel.filter(function (check) {
                            return check.vin != veh.vin;
                        });
                    }else{
                        $(".checkVeh").eq(index)[0].checked = true;
                        this.checkboxModel.push(veh);
                    }
                }else{
                    return false;
                }
            }
        },
        watch: {
            'checkboxModel':function(){
                if(this.vehicleList.length===this.checkboxModel.length){
                    this.vehSelectAll=true;
                }else{
                    this.vehSelectAll=false;
                }
                TMap.marker(this.checkboxModel,false);
            },
            vehSelectAll(yes) {
                this.vehSelectAll = yes;
            }
        },
        mounted(){
            var nowTime = document.querySelector("#nowTime");
            setTime ();
            function setTime (){
                var date = new Date();
                var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
                var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
                var h = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
                var m = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
                var s = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
                var time = date.getFullYear() + "-" + month + "-" + day + " " + h + ":" + m+ ":" + s;
                nowTime.innerHTML = time;
            }
            setInterval(function() {
                setTime ();
            }, 1000);

            var _this = this;
            _this.$nextTick(function () {
                TMap.init({
                    container: "mcontainer",
                    control: true,
                    lonlat: {
                        lat: 34.34127,
                        lon: 108.93984
                    },
                    zoom: 4
                });
            });
        }
    }
</script>

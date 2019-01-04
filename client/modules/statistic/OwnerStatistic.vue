<template>
    <div>
        <ul class="breadcrumb">
            <li>基础信息管理</li>
            <li>车主信息管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline" @submit.prevent="vehicleSearch">
                        <div class="form-group">
                            <label class="control-label label-name">省份：</label>
                            <select class="form-control input-sm input-fixed province" v-model="searchOwner.provinceCode" v-on:change="provinceChange()">
                                <option value="">全部</option>
                                <option v-for="provinceItem in provinceList" v-bind:value="provinceItem.id">{{provinceItem.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">城市：</label>
                            <select class="form-control input-sm input-fixed city" v-model="searchOwner.cityCode">
                                <option value="">全部</option>
                                <option v-for="cityItem in cityList" v-bind:value="cityItem.id">{{cityItem.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">品牌：</label>
                            <select class="form-control input-sm input-fixed brand" v-model="searchOwner.brandId" v-on:change="searchOwnerBrandChanged()">
                                <option value="">全部</option>
                                <option v-for="brand in vehBrandList" v-bind:value="brand.id">{{brand.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">车系：</label>
                            <select class="form-control input-sm input-fixed series" v-model="searchOwner.seriesId" v-on:change="searchOwnerSeriesChanged()">
                                <option value="">全部</option>
                                <option v-for="series in vehSeriesList" v-bind:value="series.id">{{series.name}}</option>
                            </select>
                        </div>
                    </form>
                    <form class="form-inline m-top-sm" v-if="message['/vehicle/ownerInformation/isOwnerTserviceAndStatus']">
                        <div class="form-group">
                            <label class="control-label label-name">T服务开通状态：</label>
                            <select class="form-control input-sm input-fixed" v-model="searchOwner.tServerStatus">
                                <option value="">全部</option>
                                <option v-for="tServerStatus in tServerStatusList" v-bind:value="tServerStatus.value">{{tServerStatus.text}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name left">T服务开通开始时间：</label>
                            <div class="left">
                                <date-picker type="datetime" :confirm="true" v-model="tServerStartTime" placeholder="T服务开通开始时间" style="width: 210px"></date-picker>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name left">T服务开通结束时间：</label>
                            <div class="left">
                                <date-picker type="datetime" :confirm="true" v-model="tServerEndTime" placeholder="T服务开通结束时间" style="width: 210px"></date-picker>
                            </div>
                        </div>
                    </form>
                    <form class="form-inline m-top-sm">
                        <div class="form-group">
                            <label class="control-label label-name">车型：</label>
                            <select class="form-control input-sm input-fixed model" v-model="searchOwner.modelId">
                                <option value="">全部</option>
                                <option v-for="model in vehModelList" v-bind:value="model.id">{{model.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                                <label class="control-label label-name datePicker">购车时间：</label>
                                <div class="form-group">
                                    <date-picker type="datetimerange" :options="datePickerOption" placement="bottom-end" v-model='datetime'></date-picker>
                                </div>
                            </div>
                        <button type="button" id="vehicleSearch" class="btn btn-sm btn-success" v-on:click="vehicleSearch">搜索</button>
                        <button @click="_export" class="btn btn-sm btn-default">导出</button>
                    </form>
                    <form class="form-inline m-top-sm" v-if="message['/vehicle/ownerInformation/isOwnerTserviceAndStatus']">
                        <div class="form-group">
                            <label class="control-label label-name">总人数：</label>
                            <label class="control-label label-name">{{searchOwnerTotalCount}}</label>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">开通人数：</label>
                            <label class="control-label label-name">{{openTServerNum}}</label>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="dataTable">
                <thead>
                <tr>
                    <th>省</th>
                    <th>男</th>
                    <th>女</th>
                    <th>总计</th>
                </tr>
                </thead>
                <tbody>
                
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="searchOwner.pageIndex" :page-size="searchOwner.pageSize" :total="searchOwnerTotalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<style>
    .input-fixed{
        width:140px !important;
    }
</style>
<script>
    import {modal,alert} from 'vue-strap';
    import $ from "jquery";
    import datePicker from 'iview/src/components/date-picker';
    import XLSX from 'xlsx';
    import 'xlsx/dist/xlsx.full.min.js';
    export default{
        data(){
            return {
                exportData:[],
                data: [
                  ["省","男","女","总计"]
                  ],
                datetime:[new Date(),new Date()],
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                ownerEditModal:{
                    isShow:false
                },
                ownerInfoModal:{
                    isShow:false
                },
                gender:"",
                VehSeriesList:[],
                maxLink: 5,
                vehicleOwnerList:{},
                provinceList:{},
                cityList:{},
                pageIndex:1,
                pageSize:10,
                totalCount:0,
                openTServerNum:0,
                email: "",
                ownerName: "",
                searchOwner:{
                    provinceCode:"",
                    cityCode:"",
                    type:"idNumber",
                    keyword:"",
                    brandId:"",
                    seriesId:"",
                    modelId:"",
                    pageIndex:1,
                    pageSize:10,
                    tServerStatus:"",
                    ageBracket:"",
                    tServerStartTime:"",
                    tServerEndTime:""
                },
                tServerStartTime:"",
                tServerEndTime:"",
                ageRangeList:[
                    {
                        "value":"0-20",
                        "text":"0-20"
                    },
                    {
                        "value":"21-30",
                        "text":"21-30"
                    },
                    {
                        "value":"31-40",
                        "text":"31-40"
                    },
                    {
                        "value":"41-50",
                        "text":"41-50"
                    },
                    {
                        "value":"50以上",
                        "text":"50以上"
                    }
                ],
                tServerStatusList:[
                    {
                        "value":"using",
                        "text":"开通成功"
                    },
                    {
                        "value":"failed",
                        "text":"开通失败"
                    },
                    {
                        "value":"closed",
                        "text":"已关闭"
                    },
                    {
                        "value":"expired",
                        "text":"已过期"
                    }
                ],
                searchOwnerTotalCount:0,
                vehBrandList:[],
                vehSeriesList:[],
                vehModelList:[],
                searchTypes:[
                    {
                        value: "idNumber",
                        name: "身份证号"
                    },
                    {
                        value: "vin",
                        name: "车辆VIN码"
                    },
                    {
                        value: "ownerName",
                        name: "车主姓名"
                    },
                    {
                        value: "mobilePhone",
                        name: "手机号"
                    },
                    {
                        value: "simNumber",
                        name: "SIM卡电话号码"
                    },
                    {
                        value: "deviceSn",
                        name: "设备编号"
                    }
                ],
                ownerInfoList:{
                    provinceCode:"",
                    cityCode:"",
                    mobilePhone:"",
                    firstName:"",
                    idNumber:"",
                    vehicleSaleInfos:[
                        {
                            vin:"",
                            dealerName:"",
                            licensePlate:"",
                            saleDate:""
                        }
                    ]
                },
                ownerEditParams:{
                    idNumber:"",
                    mobilePhone:"",
                    firstName:"",
                    email:"",
                    provinceCode:"",
                    cityCode:"",
                    address:"",
                    id:""
                },
                editOwnerParams: {
                    "address": "",
                    "birthday": "",
                    "cityCode": "",
                    "countryCode": "",
                    "createTime": new Date(),
                    "createdBy": "",
                    "dealerId": "",
                    "dealerName": "",
                    "districtCode": "",
                    "email": "",
                    "firstName": "",
                    "gender": "",
                    "homePhone": "",
                    "id": 0,
                    "idNumber": "",
                    "idType": "ID_CARD",
                    "lastName": "",
                    "mobilePhone": "",
                    "provinceCode": "",
                    "saledate": new Date(),
                    "updateTime": new Date(),
                    "updatedBy": "",
                    "vehicleSaleInfos": [
                        {
                            "dealerName": "",
                            "licensePlate": "",
                            "saleDate": new Date(),
                            "vin": ""
                        }
                    ],
                    "vin": ""
                },
                ownerIdNumber : "",
                ownerMobilePhone : "",
                ownerFirstName : "",
                ownerEmail : ""
            }
        },
        components: {
            modal,
            alert,
            datePicker
        },
        computed:{

        },
        methods:{
            _export(evt) {
              const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
              const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
              wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(this.data);
              saveAs(new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), "车主信息统计" + '.' + (wopts.bookType=="biff2"?"xls":wopts.bookType));
            },
            s2ab(s) {
                if (typeof ArrayBuffer !== 'undefined') {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                } else {
                    var buf = new Array(s.length);
                    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
            },
            loadHtml(callFun){
                let _this = this;
                _this.$http.post('api/findOwenerInfoReports', {"level": "PROVINCE"}).then(callFun);
            },
            getCountBySex(status,data){
                for (var i = 0; i < data.ownerGenderDtos.length; i++) {
                    if (data.ownerGenderDtos[i].gender == status) {
                        return data.ownerGenderDtos[i].count;
                    }
                }
            },
            getVehOwnerList(){
                let _this = this;
                let province =  $(".province option:selected").val();
                let provinceName =  $(".province option:selected").text();

                let city =  $(".city option:selected").val();
                let cityName =  $(".city option:selected").text();

                let brand =  $(".brand option:selected").val();
                let brandName =  $(".brand option:selected").text();

                let series =  $(".series option:selected").val();
                let seriesName =  $(".series option:selected").text();

                let model =  $(".model option:selected").val();
                let modelName =  $(".model option:selected").text();

                if(province != '' && city == '' && brand == '' && series == '' && model == ''){
                    _this.$http.post('api/findOwenerInfoReports', {"level": "PROVINCE","ownerProvinceDtos":[{"name":provinceName,"provinceCode":province}]}).then(function(data){
                        if(data.body.status=="SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.ownerProvinceDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="nid1_' + item.provinceCode + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>';
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }else if(province == ''){
                    _this.loadHtml(function(data){
                        if(data.body.status=="SUCCEED"){
                            var data = data.body.data.ownerProvinceDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="nid1_' + item.provinceCode + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>';
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }

                if(province != '' && city == '' && brand != '' && series == '' && model == ''){
                    _this.$http.post('api/findOwenerInfoReports', {level: "PROVINCE",'brandId':brand,ownerProvinceDtos:[{'name':name,'provinceCode':province}]}).then(function(data){
                        if(data.body.status=="SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.ownerProvinceDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="nid1_' + item.provinceCode + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>';
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }
                if(province != '' && city == '' && brand != '' && series != '' && model == ''){
                    _this.$http.post('api/findOwenerInfoReports', {level: "PROVINCE",'brandId':brand,'seriesId':series,ownerProvinceDtos:[{'name':name,'provinceCode':province}]}).then(function(data){
                        if(data.body.status=="SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.ownerProvinceDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="nid1_' + item.provinceCode + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>';
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }
                if(province != '' && city == '' && brand != '' && series != '' && model != ''){
                    _this.$http.post('api/findOwenerInfoReports', {level: "PROVINCE",'brandId':brand,'seriesId':series,'modelId':model,ownerProvinceDtos:[{'name':name,'provinceCode':province}]}).then(function(data){
                        if(data.body.status=="SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.ownerProvinceDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="nid1_' + item.provinceCode + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>';
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }

                if(province != '' && city != '' && brand == '' && series == '' && model == ''){
                    _this.$http.post('api/findOwenerInfoReports', {level: "CITY",ownerProvinceDtos:[{'name':name,'provinceCode':province,'ownerCityDtos':[{'name':cityName,'cityCode':city}]}]}).then(function(data){
                        if(data.body.status == "SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.ownerProvinceDtos[0].ownerCityDtos;
                            var str = '';
                            var id = 0;
                            console.log(data);
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let nid = 'nid2_'+item.cityCode;
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="'+ nid +'"  data-tt-branch="false">' + 
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>'; 
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }

                if(province != '' && city != '' && brand != '' && series == '' && model == ''){
                    _this.$http.post('api/findOwenerInfoReports', {level: "CITY",'brandId':brand,ownerProvinceDtos:[{'name':name,'provinceCode':province,'ownerCityDtos':[{'name':cityName,'cityCode':city}]}]}).then(function(data){
                        if(data.body.status == "SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.ownerProvinceDtos[0].ownerCityDtos;
                            var str = '';
                            var id = 0;
                            console.log(data);
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let nid = 'nid2_'+item.cityCode;
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="'+ nid +'"  data-tt-branch="false">' + 
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>'; 
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }
                if(province != '' && city != '' && brand != '' && series != '' && model == ''){
                    _this.$http.post('api/findOwenerInfoReports', {level: "CITY",'brandId':brand,'seriesId':series,ownerProvinceDtos:[{'name':name,'provinceCode':province,'ownerCityDtos':[{'name':cityName,'cityCode':city}]}]}).then(function(data){
                        if(data.body.status == "SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.ownerProvinceDtos[0].ownerCityDtos;
                            var str = '';
                            var id = 0;
                            console.log(data);
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let nid = 'nid2_'+item.cityCode;
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="'+ nid +'"  data-tt-branch="false">' + 
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>'; 
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }
                if(province != '' && city != '' && brand != '' && series != '' && model != ''){
                    _this.$http.post('api/findOwenerInfoReports', {level: "CITY",'brandId':brand,'seriesId':series,'modelId':model,ownerProvinceDtos:[{'name':name,'provinceCode':province,'ownerCityDtos':[{'name':cityName,'cityCode':city}]}]}).then(function(data){
                        if(data.body.status == "SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.ownerProvinceDtos[0].ownerCityDtos;
                            var str = '';
                            var id = 0;
                            console.log(data);
                            $.each(data,function(i,item){
                                if(item.count == ''){
                                    str == '';
                                }else{
                                   let nid = 'nid2_'+item.cityCode;
                                   let Fct = _this.getCountBySex("F",item);
                                   let Mct = _this.getCountBySex("M",item);
                                   if(typeof(Fct)=="undefined"){
                                    Fct = 0;
                                   };
                                   if(typeof(Mct)=="undefined"){
                                    Mct = 0;
                                   };
                                    str += '<tr data-node-id="'+ nid +'"  data-tt-branch="false">' + 
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  Mct + '</td>' +
                                        '<td>' +  Fct + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>'; 
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                    });
                }


            },
            getVehAttribute(){
                let _this=this;
                _this.$http.get('api/getVehAttribute', {params: {}}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehBrandList = data.body.datas;
                    }
                });
            },
            getProvinceList(){
                let _this = this;
                _this.$http.get('api/findProvincesAndCities',{params:{keywords: "中国", level: "COUNTRY", sub: 2}}).then(function(res){
                    if(res.body.status && res.body.data[0]){
                        _this.provinceList = res.body.data[0].divisions;
                    }
                });
            },
            pageHandler:function (pageIndex){
                let _this = this;
                _this.searchOwner.pageIndex = pageIndex;
                _this.getVehOwnerList();
            },
            vehicleSearch:function (){
                let _this = this;
                _this.searchOwner.pageIndex = 1;
                _this.getVehOwnerList();
            },
            provinceChange:function(){
                this.cityList={};
                for(let i in this.provinceList){
                    if(this.provinceList[i].id==this.searchOwner.provinceCode){
                        this.cityList=this.provinceList[i].divisions;
                    }

                    if(this.provinceList[i].id==this.ownerEditParams.provinceCode){
                        this.cityList=this.provinceList[i].divisions;
                    }
                }
                if(this.searchOwner.provinceCode==''){
                    this.searchOwner.cityCode = '';
                }
            },
            genderChange(gender){
                if(gender==='M'){
                    return '男'
                }else if(gender==='F'){
                    return '女'
                }
            },
            ownerInfo(owner){
                this.ownerInfoModal.isShow = true;
                this.ownerInfoList = owner;
            },
            ownerEdit(owner){
                let _this = this;
                _this.ownerEditModal.isShow = true;
                _this.ownerEditParams = {
                    idNumber:owner.idNumber,
                    mobilePhone:owner.mobilePhone,
                    firstName:owner.firstName,
                    email:owner.email,
                    provinceCode:owner.provinceCode,
                    cityCode:owner.cityCode,
                    address:owner.address,
                    id:owner.id
                };
                $(".ownerIdNumber").val(owner.idNumber);
                $(".ownerMobilePhone").val(owner.mobilePhone);
                $(".ownerFirstName").val(owner.firstName);
                $(".ownerEmail").val(owner.email);
            },
            saveOwnerInfoCall(scope){
                let _this = this;
                _this.ownerEditParams.idNumber = $(".ownerIdNumber").val();
                _this.ownerEditParams.mobilePhone = $(".ownerMobilePhone").val();
                _this.ownerEditParams.firstName = $(".ownerFirstName").val();
                _this.ownerEditParams.email = $(".ownerEmail").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateOwner',_this.ownerEditParams).then(function(res){
                            if(res.body.status=='SUCCEED' ){
                                _this.alert= {
                                    isShow: true,
                                    content: "修改车主信息成功",
                                    type: "success"
                                };
                                _this.ownerEditModal.isShow = false;
                                _this.getVehOwnerList();
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "修改车主信息失败,"+res.body.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            searchByprovinceCode:function(provinceCode){
                for(let i in this.provinceList){
                    if(this.provinceList[i].id==provinceCode){
                        return this.provinceList[i].name;
                    }
                }
            },
            searchByCityCode:function(cityCode){
                for(let i in this.provinceList){
                    for(let j in this.provinceList[i].divisions){
                        if(this.provinceList[i].divisions[j].id==cityCode){
                            return this.provinceList[i].divisions[j].name;
                        }
                    }
                }
            },
            isUndefined:function (value){
                if(value && value[0]){
                    return value[0].vin;
                }else{
                    return "";
                }
            },
            searchOwnerBrandChanged(){
                let _this = this;
                let id = _this.searchOwner.brandId;
                let vehBrandList = _this.vehBrandList;
                if(id){
                    for(let i in vehBrandList){
                        if(vehBrandList[i].id === id){
                            _this.vehSeriesList = vehBrandList[i].vehicleSeriesList;
                        }
                    }
                }else{
                    _this.vehSeriesList = [];
                    _this.vehModelList = [];
                }
                _this.searchOwner.modelId = "";
                _this.searchOwner.seriesId = "";
            },
            searchOwnerSeriesChanged(){
                let _this = this;
                let id = _this.searchOwner.seriesId;
                let vehSeriesList = _this.vehSeriesList;
                if(id){
                    for(let i in vehSeriesList){
                        if(vehSeriesList[i].id === id){
                            _this.vehModelList = vehSeriesList[i].vehicleModelList;
                        }
                    }
                }else{
                    _this.vehModelList = [];
                }
                _this.searchOwner.modelId = "";
            }
        },
        created (){
            this.getVehAttribute();
            this.getProvinceList();
            console.log(this.datetime[0])
        },
        mounted(){
            let _this = this;
            $('#dataTable').treetable({
                nodeIdAttr: "nodeId",
                parentIdAttr:"parentId",
                stringCollapse: "收起",
                stringExpand: "展开",
                expandable: true,
                onNodeExpand: function() {
                    let _node = this;
                    console.log(_node);
                    var name = _node.name;
                    var provinceCode = _node.id.split('_')[1];
                    var node = $("#dataTable").treetable("node",_node.id);
                    console.log(provinceCode);
                    console.log(node);
                    if(node.children.length == 0){
                        _this.$http.post('api/findOwenerInfoReports', {level: "CITY",ownerProvinceDtos:[{'name':name,'provinceCode':provinceCode}]}).then(function(data){
                            if(data.body.status == "SUCCEED"){
                                var data = data.body.data.ownerProvinceDtos[0].ownerCityDtos;
                                var str = '';
                                console.log(data);
                                $.each(data,function(i,item){
                                    if(item.count == ''){
                                        str == '';
                                    }else{
                                       let nid = 'nid2_'+item.cityCode;
                                       let Fct = _this.getCountBySex("F",item);
                                       let Mct = _this.getCountBySex("M",item);
                                       if(typeof(Fct)=="undefined"){
                                        Fct = 0;
                                       };
                                       if(typeof(Mct)=="undefined"){
                                        Mct = 0;
                                       };
                                        str += '<tr data-node-id="'+ nid +'" data-parent-id="'+ _node.id +'"  data-tt-branch="false">' + 
                                            '<td>' +  item.name + '</td>' +
                                            '<td>' +  Mct + '</td>' +
                                            '<td>' +  Fct + '</td>' +
                                            '<td>' +  item.count + '</td>' +
                                            '</tr>';
                                        _this.exportData.push(item.name);
                                        _this.exportData.push(Mct);
                                        _this.exportData.push(Fct);
                                        _this.exportData.push(item.count);
                                        _this.data.push(_this.exportData);
                                        console.log(_this.data);
                                        _this.exportData = [] 
                                    }
                                });
                                var node = $("#dataTable").treetable("node",_node.id);
                                $("#dataTable").treetable("loadBranch",node,str);
                            }
                        });
                    }else{
                        return false;
                    } 
                }
            });
            _this.loadHtml(function(data){
                if(data.body.status=="SUCCEED"){
                    var data = data.body.data.ownerProvinceDtos;
                    var str = '';
                    var id = 0;
                    $.each(data,function(i,item){
                        if(item.count == ''){
                            str == '';
                        }else{
                           let Fct = _this.getCountBySex("F",item);
                           let Mct = _this.getCountBySex("M",item);
                           if(typeof(Fct)=="undefined"){
                            Fct = 0;
                           };
                           if(typeof(Mct)=="undefined"){
                            Mct = 0;
                           };
                            str += '<tr data-node-id="nid1_' + item.provinceCode + '"  data-tt-branch="true">' +
                                '<td>' +  item.name + '</td>' +
                                '<td>' +  Mct + '</td>' +
                                '<td>' +  Fct + '</td>' +
                                '<td>' +  item.count + '</td>' +
                                '</tr>';
                            _this.exportData.push(item.name);
                            _this.exportData.push(Mct);
                            _this.exportData.push(Fct);
                            _this.exportData.push(item.count);
                            _this.data.push(_this.exportData);
                            console.log(_this.data);
                            _this.exportData = [] 
                        }
                    });
                    var node = $("#dataTable").treetable("node",id);
                    $("#dataTable").treetable("loadBranch",node,str);
                }
            });

        },
        props:["message"]
    }
</script>

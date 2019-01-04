<template>
    <div>
        <ul class="breadcrumb">
            <li>报表管理</li>
            <li>车辆信息报表</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body clearfix">
                    <div class="control-search col-md-11 col-sm-11">
                        <form class="form-inline m-bottom-md" @submit.prevent="vehicleSearch">
                            <div class="form-group">
                                <label class="control-label label-name">品牌：</label>
                                <select class="form-control input-sm input-fixed brand" v-model="vehicleinfo.brandId" v-on:change="vehicleInfoBrandChanged()">
                                    <option value="">全部</option>
                                    <option v-for="brand in vehBrandList" v-bind:value="brand.id">{{brand.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="control-label label-name">车系：</label>
                                <select class="form-control input-sm input-fixed series" v-model="vehicleinfo.seriesId" v-on:change="vehicleInfoSeriesChanged()">
                                    <option value="">全部</option>
                                    <option v-for="series in vehSeriesList" v-bind:value="series.id">{{series.name}}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="control-label label-name">车型：</label>
                                <select class="form-control input-sm input-fixed model" v-model="vehicleinfo.modelId">
                                    <option value="">全部</option>
                                    <option v-for="model in vehModelList" v-bind:value="model.id">{{model.name}}</option>
                                </select>
                            </div>
                            <button type="button" id="vehicleSearch" class="btn btn-sm btn-success" v-on:click="vehicleSearch">搜索</button>
                            <button @click="_export" class="btn btn-sm btn-default">导出</button>
                        </form>
                            
                    </div>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="dataTable">
                <thead>
                <tr>
                    <th>品牌</th>
                    <th>已转卖</th>
                    <th>已作废</th>
                    <th>有效</th>
                    <th>总计</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="vehicleinfo.pageIndex" :page-size="vehicleinfo.pageSize" :total="totalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
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
    .label-text{
        text-align:left !important;
        font-weight: normal;
        color: #666;
    }
    .label-title{
        font-weight:bold;
        text-align:left;
        font-size:16px;
        line-height:40px;
    }
    .red{
        color: red;
    }
    .form-height{
        height:34px;
        line-height:34px;
    }
    .control-label{
        padding-top: 0 !important;
        line-height:34px;
    }
    .modal{
        z-index:3 !important;
    }
    .dialog{
        z-index:10;
    }
    .dealertips{
        z-index:12;
    }
    .pagination>.active>a, .pagination>.active>a:focus, .pagination>.active>a:hover, .pagination>.active>span, .pagination>.active>span:focus, .pagination>.active>span:hover {
        z-index: 1 !important;
    }
</style>
<script>
    import {modal, alert, select} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    import treetable from 'jquery-treetable';
    import Vue from 'vue';
    import XLSX from 'xlsx';
    import 'xlsx/dist/xlsx.full.min.js';
    export default{
        data() {
            return {
                exportData:[],
                data: [
                  ["品牌","已转卖","已作废","有效","总计"]
                ],
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                vehReturnSalesModal:{
                    isShow:false
                },
                vehTagImportModal:{
                    isShow:false
                },
                vehTagImportResultModal:{
                    isShow:false
                },
                vehImportModal:{
                    isShow:false
                },
                vehImportResultModal:{
                    isShow:false
                },
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                deviceInfoModal:{
                    isShow:false
                },
                deviceBindModal:{
                    isShow:false
                },
                ownerInfoModal:{
                    isShow:false
                },
                ownerBindModal:{
                    isShow:false
                },
                vehicleAddModal:{
                    isShow:false
                },
                vehicleInfoModal:{
                    isShow:false
                },
                vehicleValidModal:{
                    isShow:false
                },
                vehicleValidInfoModal:{
                    isShow:false
                },
                vehToDeviceWriteOffModal:{
                    isShow:false
                },
                vehToOwnerUnbundlingModal:{
                    isShow:false
                },
                returnedGoodsList:{},
                ownerStatusStyle:"newOwnername",
                dealerName:"",
                tagTypeList:[],
                allgetVehDealerList:[],
                parentDealersTips:true,
                vehToDeviceUnbundlingInfo:{},
                vehToDeviceWriteOffInfo:{},
                vehToOwnerUnbundlingInfo:{},
                importResult:{},
                importVehResult:{},
                timeTips:"下线时间需小于当前时间",
                timeCompare:true,
                offLineDate: null,
                allAddShow:false,
                detailsShow:true,
                showCustomModal:false,
                deviceBindingShow:false,
                simBindingShow:false,
                buyDetailsShow:false,
                buyBindingShow:false,
                allDetailsShow:false,
                invalidShow:false,
                searchResult:false,
                searchResultData:false,
                isSearchClick:false,
                isSearchClickTips:false,
                invalidDetailsList:{},
                dealerPageIds:1,
                provinceList:{},
                cityList:{},
                name:"",
                vehicleModelAddOrEditShow:"新增",
                isAdd:true,
                modelName :"",
                vehVin:"",
                vehicleBuyDate:"",
                provinceCode:"",
                cityCode:"",
                invalidParams:{
                    vin  : 0,
                    remark : "",
                    updatedBy : ""
                },
                vehicleinfo: {
                    keyword:"",
                    type:"vin",
                    brandId:"",
                    seriesId:"",
                    modelId:"",
                    dealerIds:"",
                    status:"",
                    tagType:"",
                    pageIndex:1,
                    pageSize:10
                },
                maxLink: 5,
                totalCount: 0,
                vehicleinformation:[],
                allDetailsInfor:{},
                vehAttribute:[],
                vehBrandList:[],
                vehSeriesList:[],
                vehModelList:[],
                searchType: "",
                seriseType:"",
                modelType:"",
                colorType:"",
                ownerAddShow: false,
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
                        value: "engineNumber",
                        name: "引擎号"
                    },
                    {
                        value: "ownerName",
                        name: "车主姓名"
                    },
                    {
                        value: "dealerName",
                        name: "经销商名称"
                    },
                    {
                        value: "deviceSN",
                        name: "设备编号"
                    },
                    {
                        value: "simNumber",
                        name: "SIM卡电话号码"
                    }
                ],
                addSelect:{
                    brand: "",
                    series: "",
                    model: ""
                },
                addVehicle: {
                    id: 0,
                    vin: "",
                    offLineDate: "",
                    licensePlate: "",
                    engineNumber: "",
                    modelId: "",
                    colorId: ""
                },
                vehColorList: [],
                deviceInfoList:{},
                searchIdNumber:"",
                searchIdNumberResult:{},
                equipmentDetailsList:{},
                vehicleDetailsList:{},
                equipmentBindingList:{},
                equipmentSearchResult:{},
                isOwnerCurrent:true,
                bindingEquipmentSearch:{
                    type:"sn",
                    keyword:""
                },
                ownerBindVehicleList:{},
                ownerBindVehicleParams:{
                    "dealerId": 1,
                    "saleDate":"",
                    "vehicle": {
                        "vin": "",
                        "licensePlate":""
                    },
                    "vehicleOwner": {
                        "address": "",
                        "birthday": "",
                        "cityCode": "",
                        "countryCode": "",
                        "createTime": new Date(),
                        "createdBy": "",
                        "districtCode": "",
                        "email": "",
                        "firstName": "",
                        "gender": "M",
                        "homePhone": "",
                        "id": 0,
                        "idNumber": "",
                        "idType": "ID_CARD",
                        "lastName": "",
                        "mobilePhone": "",
                        "provinceCode": "",
                        "updateTime": "",
                        "updatedBy": ""
                    }
                },
                vehcolorId : "",
                vehvin : "",
                vehengineNumber : "",
                vehlicensePlate : "",
                owneridNumber : "",
                ownerfirstName : "",
                ownermobilePhone : "",
                file: null,
                isFileHas:true,
                isCall:false
            }
        },
        components: {
            modal,
            alert: alert,
            vSelect: select,
            datePicker,

        },
        created (){
            let _this = this;
            _this.getvehbrandList();
            _this.vehicleSearchList();
            _this.getVehAttribute();
            _this.getVehTagTypeAll();
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
                    var id = this.id;
                    var dataId = id.split('_')[1];
                    var dataIdPre = id.split('_')[0]+'_';
                    var node = $("#dataTable").treetable("node",id);
                    if(dataIdPre == 'nid1_'){
                        if(node.children.length == 0){
                            _this.$http.post('api/findReports', {level:2,vehBrandDtos:[{'id':dataId}]}).then(function(data){
                                if(data.body.status=="SUCCEED"){
                                    var data = data.body.data.vehBrandDtos[0].vehSeriesDtos;
                                    var str = '';
                                    $.each(data,function(i,item){
                                        if(item.count == 0){
                                            str == '';
                                        }else{
                                           let nid = 'nid2_'+item.id;
                                           let validCt = _this.getCountByStatus("VALID",item);
                                           let resellCt = _this.getCountByStatus("RESELL",item);
                                           let writtenoffCt = _this.getCountByStatus("WRITTENOFF",item);
                                           if(typeof(validCt)=="undefined"){
                                            validCt = 0;
                                           };
                                           if(typeof(resellCt)=="undefined"){
                                            resellCt = 0;
                                           };
                                           if(typeof(writtenoffCt)=="undefined"){
                                            writtenoffCt = 0;
                                           };
                                            
                                            str += '<tr data-node-id="'+ nid +'" data-parent-id="'+id+'"  data-tt-branch="true">' + 
                                                '<td>' +  item.name + '</td>' +
                                                '<td>' +  resellCt + '</td>' +
                                                '<td>' +  writtenoffCt + '</td>' +
                                                '<td>' +  validCt + '</td>' +
                                                '<td>' +  item.count + '</td>' +
                                                '</tr>';
                                            _this.exportData.push(item.name);
                                            _this.exportData.push(resellCt);
                                            _this.exportData.push(writtenoffCt);
                                            _this.exportData.push(validCt);
                                            _this.exportData.push(item.count);
                                            _this.data.push(_this.exportData);
                                            console.log(_this.data);
                                            _this.exportData = []
                                        }
                                    });

                                    $("#dataTable").treetable("loadBranch",node,str);
                                }
                            });
                        }else{
                            return false;
                        }
                    }else if(dataIdPre == 'nid2_'){
                        console.log(dataIdPre);
                        if(node.children.length == 0){
                            _this.$http.post('api/findReports', {level:3,vehBrandDtos:[{'vehSeriesDtos':[{'id':dataId}]}]}).then(function(data){
                                if(data.body.status=="SUCCEED"){
                                    var data = data.body.data.vehBrandDtos[0].vehSeriesDtos[0].vehModelDtos;
                                    var str = '';
                                    $.each(data,function(i,item){
                                        if(item.count == 0){
                                            str == '';
                                        }else{
                                           let nid = 'nid3_'+item.id;
                                           let validCt = _this.getCountByStatus("VALID",item);
                                           let resellCt = _this.getCountByStatus("RESELL",item);
                                           let writtenoffCt = _this.getCountByStatus("WRITTENOFF",item);
                                           if(typeof(validCt)=="undefined"){
                                            validCt = 0;
                                           };
                                           if(typeof(resellCt)=="undefined"){
                                            resellCt = 0;
                                           };
                                           if(typeof(writtenoffCt)=="undefined"){
                                            writtenoffCt = 0;
                                           };
                                            
                                            str += '<tr data-node-id="'+ nid +'" data-parent-id="'+id+'"  data-tt-branch="false">' + 
                                                '<td>' +  item.name + '</td>' +
                                                '<td>' +  resellCt + '</td>' +
                                                '<td>' +  writtenoffCt + '</td>' +
                                                '<td>' +  validCt + '</td>' +
                                                '<td>' +  item.count + '</td>' +
                                                '</tr>';
                                            _this.exportData.push(item.name);
                                            _this.exportData.push(resellCt);
                                            _this.exportData.push(writtenoffCt);
                                            _this.exportData.push(validCt);
                                            _this.exportData.push(item.count);
                                            _this.data.push(_this.exportData);
                                            console.log(_this.data);
                                            _this.exportData = []
                                        }
                                    });

                                    $("#dataTable").treetable("loadBranch",node,str);
                                }
                            });
                        }else{
                            return false;
                        }
                    } 
                }
            });
            _this.loadHtml(function(data){
                if(data.body.status=="SUCCEED"){
                    $("#dataTable tbody").html("");
                    var data = data.body.data.vehBrandDtos;
                    var str = '';
                    var id = 0;
                    $.each(data,function(i,item){
                        if(item.count == 0){
                            str == '';
                        }else{
                           let validCt = _this.getCountByStatus("VALID",item);
                           let resellCt = _this.getCountByStatus("RESELL",item);
                           let writtenoffCt = _this.getCountByStatus("WRITTENOFF",item);
                           if(typeof(validCt)=="undefined"){
                            validCt = 0;
                           };
                           if(typeof(resellCt)=="undefined"){
                            resellCt = 0;
                           };
                           if(typeof(writtenoffCt)=="undefined"){
                            writtenoffCt = 0;
                           };
                            str += '<tr data-node-id="nid1_' + item.id + '"  data-tt-branch="true">' +
                                '<td>' +  item.name + '</td>' +
                                '<td>' +  resellCt + '</td>' +
                                '<td>' +  writtenoffCt + '</td>' +
                                '<td>' +  validCt + '</td>' +
                                '<td>' +  item.count + '</td>' +
                                '</tr>';

                            _this.exportData.push(item.name);
                            _this.exportData.push(resellCt);
                            _this.exportData.push(writtenoffCt);
                            _this.exportData.push(validCt);
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
        methods: {
            _export(evt) {
              const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
              const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
              wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(this.data);
              saveAs(new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), "车辆信息统计" + '.' + (wopts.bookType=="biff2"?"xls":wopts.bookType));
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
                _this.$http.post('api/findReports', {level:1}).then(callFun);
            },
            getCountByStatus(status,data){
                for (var i = 0; i < data.vehStatusDtos.length; i++) {
                    if (data.vehStatusDtos[i].statusType == status) {
                        return data.vehStatusDtos[i].count;
                    }
                }
            },
            getvehbrandList(){
                let _this = this;
                _this.loadHtml(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehBrandList = data.body.data.vehBrandDtos;
                    }
                })
            },
            vehicleSearchList(){
                let _this = this;
                let brand = $(".brand option:selected").val();
                let brandname = $(".brand option:selected").text();
                let series = $(".series option:selected").val();
                let seriesname = $(".series option:selected").text();
                let model = $(".model option:selected").val();
                let modelname = $(".model option:selected").text();
                if(brand != '' && series == '' && model == ''){
                    _this.$http.post('api/findReports', {level:1,vehBrandDtos:[{'id':brand}]}).then(function(data){
                        console.log(data);
                        if(data.body.status=="SUCCEED"){
                            console.log(data);
                            console.log(123);
                            $("#dataTable tbody").html("");
                            var data = data.body.data.vehBrandDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == 0){
                                    str == '';
                                }else{
                                   let validCt = _this.getCountByStatus("VALID",item);
                                   let resellCt = _this.getCountByStatus("RESELL",item);
                                   let writtenoffCt = _this.getCountByStatus("WRITTENOFF",item);
                                   if(typeof(validCt)=="undefined"){
                                    validCt = 0;
                                   };
                                   if(typeof(resellCt)=="undefined"){
                                    resellCt = 0;
                                   };
                                   if(typeof(writtenoffCt)=="undefined"){
                                    writtenoffCt = 0;
                                   };
                                    str += '<tr data-node-id="nid1_' + item.id + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  resellCt + '</td>' +
                                        '<td>' +  writtenoffCt + '</td>' +
                                        '<td>' +  validCt + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>';
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }

                    })
                }else if(brand == ''){
                    _this.loadHtml(function(data){
                        if(data.body.status=="SUCCEED"){
                            $("#dataTable tbody").html("");
                            var data = data.body.data.vehBrandDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == 0){
                                    str == '';
                                }else{
                                   let validCt = _this.getCountByStatus("VALID",item);
                                   let resellCt = _this.getCountByStatus("RESELL",item);
                                   let writtenoffCt = _this.getCountByStatus("WRITTENOFF",item);
                                   if(typeof(validCt)=="undefined"){
                                    validCt = 0;
                                   };
                                   if(typeof(resellCt)=="undefined"){
                                    resellCt = 0;
                                   };
                                   if(typeof(writtenoffCt)=="undefined"){
                                    writtenoffCt = 0;
                                   };
                                    str += '<tr data-node-id="nid1_' + item.id + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  resellCt + '</td>' +
                                        '<td>' +  writtenoffCt + '</td>' +
                                        '<td>' +  validCt + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>';
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }
                     });
                }

                if(brand != '' && series != '' && model == ''){
                    _this.$http.post('api/findReports', {level:2,vehBrandDtos:[{'id':brand,'name':brandname,'vehSeriesDtos':[{'id':series,'name':seriesname}]}]}).then(function(data){
                                if(data.body.status=="SUCCEED"){
                                    $("#dataTable tbody").html("");
                                    var data = data.body.data.vehBrandDtos[0].vehSeriesDtos;
                                    console.log(data);
                                    var str = '';
                                    var id = 0;
                                    $.each(data,function(i,item){
                                        if(item.count == 0){
                                            str == '';
                                        }else{
                                           let nid = 'nid2_'+item.id;
                                           let validCt = _this.getCountByStatus("VALID",item);
                                           let resellCt = _this.getCountByStatus("RESELL",item);
                                           let writtenoffCt = _this.getCountByStatus("WRITTENOFF",item);
                                           if(typeof(validCt)=="undefined"){
                                            validCt = 0;
                                           };
                                           if(typeof(resellCt)=="undefined"){
                                            resellCt = 0;
                                           };
                                           if(typeof(writtenoffCt)=="undefined"){
                                            writtenoffCt = 0;
                                           };
                                            
                                            str += '<tr data-node-id="'+ nid +'" data-tt-branch="true">' + 
                                                '<td>' +  item.name + '</td>' +
                                                '<td>' +  resellCt + '</td>' +
                                                '<td>' +  writtenoffCt + '</td>' +
                                                '<td>' +  validCt + '</td>' +
                                                '<td>' +  item.count + '</td>' +
                                                '</tr>'; 
                                        }
                                    });
                                    var node = $("#dataTable").treetable("node",id);
                                    $("#dataTable").treetable("loadBranch",node,str);
                                }
                            });
                }
                if(brand != '' && series != '' && model != ''){
                    _this.$http.post('api/findReports', {level:3,vehBrandDtos:[{'id':brand,'name':brandname,'vehSeriesDtos':[{'id':series,'name':seriesname,'vehModelDtos':[{'id':model,'name':modelname}]}]}]}).then(function(data){
                                if(data.body.status=="SUCCEED"){
                                    $("#dataTable tbody").html("");
                                    var data = data.body.data.vehBrandDtos[0].vehSeriesDtos[0].vehModelDtos;
                                    var str = '';
                                    var id = 0;
                                    $.each(data,function(i,item){
                                        if(item.count == 0){
                                            str == '';
                                        }else{
                                           let nid = 'nid3_'+item.id;
                                           let validCt = _this.getCountByStatus("VALID",item);
                                           let resellCt = _this.getCountByStatus("RESELL",item);
                                           let writtenoffCt = _this.getCountByStatus("WRITTENOFF",item);
                                           if(typeof(validCt)=="undefined"){
                                            validCt = 0;
                                           };
                                           if(typeof(resellCt)=="undefined"){
                                            resellCt = 0;
                                           };
                                           if(typeof(writtenoffCt)=="undefined"){
                                            writtenoffCt = 0;
                                           };
                                            
                                            str += '<tr data-node-id="'+ nid +'" data-tt-branch="false">' + 
                                                '<td>' +  item.name + '</td>' +
                                                '<td>' +  resellCt + '</td>' +
                                                '<td>' +  writtenoffCt + '</td>' +
                                                '<td>' +  validCt + '</td>' +
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
            timeChange(){
                this.timeCompare=this.offLineDate<new Date();
            },
            getProvinceList(){
                let _this = this;
                _this.$http.get('api/findProvincesAndCities',{params:{keywords: "中国", level: "COUNTRY", sub: 2}}).then(function(res){
                    if(res.body.status && res.body.data[0]){
                        _this.provinceList = res.body.data[0].divisions;
                    }
                });
            },
            getDealerIds(){
                let _this = this;
                let isArray = true;
                _this.$http.get('api/findOrgById', {}).then(function(result){
                    if(result.body.status && result.body.orgs){
                        isArray = Array.isArray(result.body.orgs);
                        if(isArray){
                            _this.dealerPageIds = result.body.orgs[0].code;
                        }else{
                            _this.dealerPageIds = result.body.orgs.code;
                        }
                    }else{
                        console.log("获取数据失败！");
                    }
                });
            },
            getVehDealerList(){
                let _this = this;
                _this.$http.get('api/getVehDealerList',{params:{pageAll:true,status:'ACTIVE'}}).then(function(res){
                    if(res.body.status){
                        _this.allgetVehDealerList = res.body.datas;
                    }
                });
            },
            importVehicle(){
                this.vehImportModal.isShow = true;
            },
            generateVehicle(scope){
                let _this = this;
                _this.addVehicle.modelId = _this.addSelect.model.id;
                _this.addVehicle.offLineDate = _this.offLineDate;
                _this.addVehicle.vin = $(".vehvin").val();
                _this.addVehicle.licensePlate = _this.vehlicensePlate;
                _this.addVehicle.engineNumber = $(".vehengineNumber").val();
                _this.addVehicle.colorId = $(".vehcolorId").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addVeh', _this.addVehicle).then(function(data){
                            if(data.body.status=="SUCCEED"){
                                _this.vehicleAddModal.isShow = false;
                                _this.vehicleSearchList();
                                _this.alert= {
                                    isShow: true,
                                    content: "添加车辆成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "添加车辆失败,"+data.body.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            generateVehicleEdit(scope){
                let _this = this;
                _this.addVehicle.modelId = _this.addSelect.model.id;
                _this.addVehicle.offLineDate = _this.offLineDate;
                _this.addVehicle.vin = $(".vehvin").val();
                _this.addVehicle.licensePlate = _this.vehlicensePlate;
                _this.addVehicle.engineNumber = $(".vehengineNumber").val();
                _this.addVehicle.colorId = $(".vehcolorId").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVeh', _this.addVehicle).then(function(data){
                            if(data.body.status=="SUCCEED"){
                                _this.vehicleAddModal.isShow = false;
                                _this.vehicleSearchList();
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车辆成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑车辆失败,"+data.body.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            allEdit(vehicle){
                let _this = this;
                _this.vehicleAddModal.isShow = true;
                _this.vehicleModelAddOrEditShow="编辑";
                _this.isAdd = false;
                _this.offLineDate = vehicle.offLineDate?new Date(vehicle.offLineDate) : "";
                _this.addVehicle = {
                    id: vehicle.id,
                    vin: vehicle.vin,
                    licensePlate: vehicle.licensePlate,
                    engineNumber: vehicle.engineNumber,
                    modelId: vehicle.modelId,
                    colorId: vehicle.colorId
                };
                $(".vehvin").val(vehicle.vin);
                _this.vehlicensePlate = vehicle.licensePlate;
                $(".vehengineNumber").val(vehicle.engineNumber);
                $(".vehcolorId").val(vehicle.colorId);
                _this.vehAttribute.forEach(function(va){
                    if(va.id == vehicle.brandId){
                        _this.addSelect.brand = va;
                        va.vehicleSeriesList.forEach(function(vs){
                            if(vs.id == vehicle.seriesId){
                                _this.addSelect.series = vs;
                                vs.vehicleModelList.forEach(function(vm){
                                    if(vm.id == vehicle.modelId){
                                        _this.addSelect.model = vm;
                                    }
                                });
                            }
                        });
                    }
                });
            },
            invalidVehicle(vehicle){
                this.vehicleValidModal.isShow = true;
                this.invalidParams.vin = vehicle.vin;
                this.invalidParams.updatedBy = "";
                this.invalidParams.remark = "";
            },
            deviceBinding(vehicle){
                this.deviceBindModal.isShow=true;
                this.equipmentBindingList = vehicle;
                this.equipmentSearchResult = {};
                this.isSearchClick = false;
                this.isSearchClickTips = false;
                this.bindingEquipmentSearch.type = "sn";
                this.bindingEquipmentSearch.keyword = "";
            },
            deviceBindingCall(){
                this.$http.get('api/deviceBinding', {params: {keyword: keyword, value: type.value}}).then(function(data){
                    if(data.status=="SUCCEED"){
                        this.vehicleinformation = data.body.data;
                    }
                });
            },
            simBindingCall(){
                this.$http.get('api/simBinding', {params: {keyword: this.keyword, value: this.type.value}}).then(function(data){
                    if(data.status=="SUCCEED"){
                        this.search = data.data;
                    }
                });
            },
            buyDetails(vehicle){
                this.ownerInfoModal.isShow=true;
                this.vehicleDetailsList = vehicle;
            },
            buyDetailsCall(){
                this.ownerInfoModal.isShow=false
            },
            buyBinding(vehicle){
                let _this = this;
                if(!_this.isCall){
                    _this.getVehDealerList();
                }
                _this.isCall = !_this.isCall;
                _this.ownerBindVehicleList = vehicle;
                _this.ownerBindVehicleParams = {
                    "dealerId": 1,
                    "saleDate":"",
                    "vehicle": {
                        "vin": "",
                        "licensePlate":""
                    },
                    "vehicleOwner": {
                        "address": "",
                        "birthday": "",
                        "cityCode": "",
                        "countryCode": "",
                        "createTime": new Date(),
                        "createdBy": "",
                        "districtCode": "",
                        "email": "",
                        "firstName": "",
                        "gender": "M",
                        "homePhone": "",
                        "id": 0,
                        "idNumber": "",
                        "idType": "ID_CARD",
                        "lastName": "",
                        "mobilePhone": "",
                        "provinceCode": "",
                        "updateTime": "",
                        "updatedBy": ""
                    }
                };
                _this.vehicleBuyDate = null;
                $(".owneridNumber").val('');
                $(".ownerfirstName").val('');
                $(".ownermobilePhone").val('');
                _this.parentDealersTips = true;
                _this.dealerName = "";
                _this.ownerAddShow = false;
                _this.searchIdNumberResult = {};
                _this.searchResult = false;
                _this.searchResultData = false;
                _this.searchIdNumber = "";
                _this.ownerStatusStyle = "newOwnername";
                _this.ownerBindModal.isShow = true;
                setTimeout(function (){
                    _this.errors.clear('ownerVali');
                },30);
            },
            buyBindingCall(value,scope){
                let _this = this;
                let isOwnerExist = false;
                _this.ownerBindVehicleParams.vehicle.vin = value.vin;
                _this.ownerBindVehicleParams.saleDate = _this.vehicleBuyDate;
                _this.ownerBindVehicleParams.vehicleOwner.idNumber = $(".owneridNumber").val();
                _this.ownerBindVehicleParams.vehicleOwner.firstName = $(".ownerfirstName").val();
                _this.ownerBindVehicleParams.vehicleOwner.mobilePhone = $(".ownermobilePhone").val();
                _this.ownerBindVehicleParams.dealerId = _this.dealerName;
                if(_this.ownerAddShow){
                    _this.ownerBindVehicleParams.vehicleOwner = _this.searchIdNumberResult;
                    isOwnerExist = true;
                    _this.bindOwner(isOwnerExist);
                }else{
                    if(scope){
                        _this.$validator.validateAll(scope).then(() => {
                            isOwnerExist = false;
                            _this.bindOwner(isOwnerExist);
                        })
                    }
                }
            },
            bindOwner(isOwnerExist){
                let _this = this;
                _this.$http.post('api/bindOwner', {vehicleSaleInfo:_this.ownerBindVehicleParams,ownerExist:isOwnerExist}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.ownerBindModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "车主与车辆绑定成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "车主与车辆绑定失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            allDetailsCall(){
                this.vehicleInfoModal.isShow=false;
            },
            vehicleSearch(){
                this.vehicleinfo.pageIndex = 1;
                this.vehicleSearchList();
            },
            pageHandler(pageIndex){
                this.vehicleinfo.pageIndex = pageIndex;
                this.vehicleSearchList();
            },
            findDealerIdByName:function(name,dealerList){
                for(var i in dealerList){
                    if(dealerList[i].name==name){
                        return dealerList[i].id;
                    }
                }
            },
            onEndDatetimeChanged(newEnd){
                this.addVehicle.offLineDate = this.offLineDate;
            },
            addSelectCall(){
                let _this = this;
                _this.vehicleAddModal.isShow = true;
                _this.vehicleModelAddOrEditShow = "新增";
                _this.isAdd = true;
                _this.addSelect = {
                    brand: "",
                    series: "",
                    model: ""
                };
                _this.addVehicle = {
                    colorId  : "",
                    vin : "",
                    engineNumber  : "",
                    licensePlate  : ""
                };
                _this.offLineDate = null;
                _this.vehlicensePlate = "";
                $(".vehcolorId").val('');
                $(".vehvin").val('');
                $(".vehengineNumber").val('');
            },
            unbundling: function (equipmentDetailsList){
                let _this = this;
                _this.vehToDeviceUnbundlingModal.isShow = true;
                _this.vehToDeviceUnbundlingInfo = equipmentDetailsList;
            },
            unbundlingCall:function (){
                let _this= this;
                let vehId = _this.vehToDeviceUnbundlingInfo.deviceList[0].vehicleId;
                let devId = _this.vehToDeviceUnbundlingInfo.deviceList[0].id;
                let installId = _this.vehToDeviceUnbundlingInfo.deviceList[0].installId;

                _this.$http.post('api/unBindDevForVehicle', {vehId:vehId,devId:devId,installId:installId }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehToDeviceUnbundlingModal.isShow = false;
                        _this.deviceInfoModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆解绑成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆解绑失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            writeOffDevice(equipmentDetailsList){
                let _this = this;
                _this.vehToDeviceWriteOffModal.isShow = true;
                _this.vehToDeviceWriteOffInfo = equipmentDetailsList;
            },
            writeOffDeviceCall(){
                let _this= this;
                let devicSn = _this.vehToDeviceWriteOffInfo.deviceList[0].sn;
                let vin = _this.vehToDeviceWriteOffInfo.vin;

                _this.$http.post('api/vehDevWriteOffAndUnBind', {devicSn:devicSn,vin:vin }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehToDeviceWriteOffModal.isShow = false;
                        _this.deviceInfoModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆作废成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆作废失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            bundlingEquipment:function (vehicle,equipment){
                let _this= this;
                let vehId = vehicle.id;
                let devId = equipment.id;

                _this.$http.post('api/bindDevForVehicle', {vehId:vehId,devId:devId }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.deviceBindModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆绑定成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "设备与车辆绑定失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            bundlingOwner: function (vehicleDetailsList){
                let _this = this;
                _this.vehToOwnerUnbundlingModal.isShow = true;
                _this.vehToOwnerUnbundlingInfo = vehicleDetailsList;
            },
            bundlingOwnerCall:function (){
                let _this= this;
                let vin = _this.vehicleDetailsList.vin;
                let ownerId = _this.vehicleDetailsList.saleInfoList[0].vehicleOwner.id;
                let installId = _this.vehicleDetailsList.saleInfoList[0].id;

                _this.$http.post('api/unbindOwner', {vin:vin,ownerId:ownerId,installId:installId}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehToOwnerUnbundlingModal.isShow = false;
                        _this.ownerInfoModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "车主与车辆解绑成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "车主与车辆解绑失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            searchBinding: function (){
                let _this = this;
                _this.equipmentSearchResult = {};
                let type = _this.bindingEquipmentSearch.type;
                let keyword = _this.bindingEquipmentSearch.keyword;
                _this.$http.get('api/getVehDeviceByType', {params:{type:type,keyword:keyword}}).then(function(data){
                    if(data.body.status=="SUCCEED" && data.body.data){
                        _this.isSearchClick = true;
                        _this.isSearchClickTips = false;
                        _this.equipmentSearchResult = data.body.data;
                    }else{
                        _this.isSearchClickTips = true;
                    }
                });
            },
            details: function (vehicle){
                let _this = this;
                _this.deviceInfoModal.isShow = true;
                _this.equipmentDetailsList = vehicle;
            },
            invalidCall: function (){
                let _this = this;
                _this.$http.post('api/writeOff',  _this.invalidParams ).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehicleValidModal.isShow = false;
                        _this.alert= {
                            isShow: true,
                            content: "车辆作废成功",
                            type: "success"
                        };
                        _this.vehicleSearchList();
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "车辆作废失败,"+data.body.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            ownerChange: function (value){
                if( value=="newOwnername" ){
                    this.ownerAddShow = false;
                }else{
                    this.ownerAddShow = true;
                }
            },
            searchByIdnumber: function (){
                let _this = this;
                _this.searchResult = true;
                let idNumber = _this.searchIdNumber;
                _this.$http.get('api/getVehOwnerByIdNumber', {params:{idNumber:idNumber}}).then(function(data){
                    if(data.body.status=="SUCCEED" && data.body.data){
                        _this.searchIdNumberResult = data.body.data;
                        _this.searchResultData = true;
                    }else{
                        _this.searchResultData = false;
                    }
                });
            },
            vehDeviceChange(deviceStatus){
                let _this = this;
                if(deviceStatus=="VALID"){
                    return "当前设备";
                }else if(deviceStatus=="UNINSTALLED"){
                    return "历史设备";
                }else{
                    return "作废设备";
                }
            },
            provinceChange:function(){
                let _this = this;
                _this.cityList={};
                for(let i in _this.provinceList){
                    if(_this.provinceList[i].id==_this.ownerBindVehicleParams.vehicleOwner.provinceCode){
                        _this.cityList=_this.provinceList[i].divisions;
                    }
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
            ownerStatus:function (value){
                if(value=="OWNED"){
                    return "当前车主";
                }else{
                    return "历史车主";
                }
            },
            isUndefined:function (value){
                if(value && value[0]){
                    return value[0].modelName;
                }else{
                    return "";
                }
            },
            equipmentStatus(status){
                if(status=="VALID"){
                    return "已安装";
                }else if(status=="UNINSTALLED"){
                    return "未安装";
                }else{
                    return "已报废";
                }
            },
            vehStatus(status){
                if(status=="VALID"){
                    return "有效";
                }else if(status=="RESALE"){
                    return "已转卖";
                }else{
                    return "已作废";
                }
            },
            invalidDetails:function(vehicle){
                let _this = this;
                _this.vehicleValidInfoModal.isShow = true;
                let vin = vehicle.vin;
                _this.$http.get('api/getVehByVin', {params:{vin:vin}}).then(function(data){
                    if(data.body.status=="SUCCEED" && data.body.data){
                        _this.invalidDetailsList = data.body.data;
                    }else{

                    }
                });
            },
            vehicleInfoBrandChanged(){
                let _this = this;
                let id = _this.vehicleinfo.brandId;
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
                _this.vehicleinfo.modelId = "";
                _this.vehicleinfo.seriesId = "";
            },
            vehicleInfoSeriesChanged(){
                let _this = this;
                let id = _this.vehicleinfo.seriesId;
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
                _this.vehicleinfo.modelId = "";
            },
            getVehAttribute(){
                this.$http.get('api/getVehAttribute', {params: {}}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        this.vehAttribute = data.body.datas;
                        this.vehBrandList = data.body.datas;
                    }
                });
            },
            getVehColorList(){
                this.$http.get('api/getVehColorList').then(function(data){
                    if(data.body.status=="SUCCEED"){
                        this.vehColorList = data.body.datas;
                    }
                });
            },
            getVehTagTypeAll(){
                this.$http.get('api/getVehTagTypeAll').then(function(data){
                    if(data.body.status=="SUCCEED"){
                        this.tagTypeList = data.body.data;
                    }
                });
            },
            previewFile (e) {
                let _this = this;
                let fileTem = e.target.files[0];
                let supportedTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                if (fileTem && supportedTypes.indexOf(fileTem.type) >= 0) {
                    this.file = fileTem;
                    this.isFileHas = false;
                } else {
                    window.alert('我们目前仅支持xlsx/xls这两种后缀名的excel文档，请注意格式！');
                    this.isFileHas = true;
                }
                if(fileTem.size>2048000){
                    this.isFileHas = true;
                    _this.alert= {
                        isShow: true,
                        content: "文件大小不建议超过2M",
                        type: "danger"
                    };
                }
            },
            clearFile () {
                this.file = null;
            },
            submitFile () {
                let _this = this;
                var form = new FormData(document.getElementById("uploadForm"));
                if (_this.file) {
                    $.ajax({
                        url:"api/importVehTag",
                        type:"post",
                        data:form,
                        processData:false,
                        contentType:false,
                        success:function(data){
                            if(data.status=='SUCCEED'){
                                _this.alert= {
                                    isShow: true,
                                    content: "导入车辆标识成功",
                                    type: "success"
                                };
                                _this.vehTagImportModal.isShow = false;
                                _this.vehicleSearchList();
                            }else if(data.errorNumber>0){
                                _this.vehTagImportResultModal.isShow = true;
                                _this.vehTagImportModal.isShow = false;
                                _this.importResult = data;
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "导入车辆标识失败，解析文件时出错",
                                    type: "danger"
                                };
                            }
                        },
                        error:function(e){
                            _this.alert= {
                                isShow: true,
                                content: "导入车辆标识失败，出现未知错误，可能是磁盘空间已满，请注意清理",
                                type: "danger"
                            };
                        }
                    });
                }
            },
            submitVehFile () {
                let _this = this;
                var form = new FormData(document.getElementById("importVehForm"));
                if (_this.file) {
                    $.ajax({
                        url:"api/importVeh",
                        type:"post",
                        data:form,
                        processData:false,
                        contentType:false,
                        success:function(data){
                            console.log(JSON.stringify(data));
                            if(data.status=='SUCCEED'){
                                _this.alert= {
                                    isShow: true,
                                    content: "导入车辆成功",
                                    type: "success"
                                };
                                _this.vehImportModal.isShow = false;
                                _this.vehicleSearchList();
                            }else if(data.errorNumber>0){
                                _this.vehImportResultModal.isShow = true;
                                _this.vehImportModal.isShow = false;
                                _this.importVehResult = data;
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "导入车辆标识失败，解析文件时出错",
                                    type: "danger"
                                };
                            }
                        },
                        error:function(e){
                            _this.alert= {
                                isShow: true,
                                content: "导入车辆标识失败，出现未知错误，可能是磁盘空间已满，请注意清理",
                                type: "danger"
                            };
                        }
                    });
                }
            }
        },
        props:["message"]
    }
</script>

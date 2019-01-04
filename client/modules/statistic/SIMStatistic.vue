<template>
    <div>
        <ul class="breadcrumb">
            <li>报表管理</li>
            <li>SIM卡信息统计</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline no-margin" @submit.prevent="simSearch">
                        
                        <div class="form-group">
                            <label class="control-label label-name">SIM卡状态：</label>
                            <select class="form-control input-sm" v-model="searchSimParam.status">
                                <option value="">全部</option>
                                <option v-for="status in statusList" v-bind:value="status.value">{{status.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">运营商：</label>
                            <select class="form-control input-sm" v-model="searchSimParam.status">
                                <option value="">全部</option>
                                <option v-for="vehSim in vehSimList" v-bind:value="vehSim.carrierName">{{vehSim.carrierName}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">套餐名称：</label>
                            <select class="form-control input-sm" v-model="searchSimParam.packageId">
                                <option value="">全部</option>
                                <option v-for="mealName in packageNameList" v-bind:value="mealName.id">{{mealName.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">激活时间：</label>
                            <div class="form-group">
                                <date-picker :options="datePickerOption" placement="bottom-end"></date-picker>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="simSearch">搜索</button>
                        <button @click="_export" class="btn btn-sm btn-default">导出</button>

                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="vehicle-sim-table">
                <thead>
                <tr>
                    <th>运营商</th>
                    <th>激活</th>
                    <th>未激活</th>
                    <th>作废</th>
                    <th>不可用</th>
                    <th>总计</th>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </div>
        <!--<div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="searchSimParam.pageIndex" :page-size="searchSimParam.pageSize"
                          :total="searchSimParam.totalCount" :max-link="maxLink"
                          :page-handler="pageHandler"></zpagenav>
            </div>
        </div>-->
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<style>
    .btn-warp{
        margin-top:15px;
        padding-top:10px;
        border-top: 1px solid #e5e5e5;
        height:50px;
    }
</style>
<script>
    import { tabs, tab ,modal,alert} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    import $ from "jquery";
    import Vue from 'vue';
    import XLSX from 'xlsx';
    import 'xlsx/dist/xlsx.full.min.js';

    export default{
        data(){
            return {
                exportData:[],
                data: [
                  ["运营商","激活","未激活","作废","不可用","总计"]
                ],
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
                simAddModal:{
                    isShow:false
                },
                simInfoModal:{
                    isShow:false
                },
                simImportModal:{
                    isShow:false
                },
                simImportResultModal:{
                    isShow:false
                },
                activeDate:null,
                simIsAdd:true,
                telcomCarrierList:{},
                packageNameList:{},
                timeTips:"入库时间需小于当前时间",
                timeCompare:true,
                simInfoAddOrEditShow:"新增",
                maxLink:5,
                purchaseDate:null,
                failureDate:null,
                importResult:{},
                searchSimParam: {
                    type:"iccid",
                    keyword:"",
                    packageId:"",
                    status:"",
                    pageIndex: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                vehSimList: [],
                statusList :[
                    {
                        value: "ACTIVE",
                        name: "激活"
                    },
                    {
                        value: "INACTIVE",
                        name: "未激活"
                    },
                    {
                        value: "DISABLED",
                        name: "作废"
                    },
                    {
                        value: "UNAVAILABLE",
                        name: "不可用"
                    }
                ],
                simInfoList:{
                    "id": 1,
                    "createTime": "",
                    "iccid": "",
                    "number": "",
                    "imsi": "",
                    "carrierId": 1,
                    "carrierName": "",
                    "vehSimInfoVOs": []
                },
                file: null,
                isFileHas:true,
                simIccid : "",
                simImsi : "",
                simNumber : "",
                simCarrierId : ""
            }
        },
        computed:{
        },
        created () {
            this.getVehSimInfoList();
            this.getTelcomCarrier();
            this.getPackageName();
            this.loadHtml();
        },
        components: {
            tabs,
            tab,
            modal,
            alert,
            datePicker,
        },
        methods: {
            _export(evt) {
              const wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
              const wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
              wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(this.data);
              saveAs(new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), "SIM信息统计" + '.' + (wopts.bookType=="biff2"?"xls":wopts.bookType));
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
                _this.$http.post('api/findSimInfoReports', {}).then(callFun);
            },
            getCountByStatus(status,data){
                for (var i = 0; i < data.simStatusDtos.length; i++) {
                    if (data.simStatusDtos[i].statusType == status) {
                        return data.simStatusDtos[i].count;
                    }
                }
            },
            simAddCancel(){
                this.simAddModal.isShow=false;
                this.errors.clear('simInfoAddOrVali');
                this.timeCompare = true;
            },
            getVehSimInfoList() {
                let _this = this;
                _this.$http.get('api/getVehSimInfoList', {params: _this.searchSimParam}).then(function (data) {
                    if (data.body.status == "SUCCEED") {
                        _this.vehSimList = data.body.datas;
                        _this.searchSimParam.pageIndex = data.body.pageIndex;
                        _this.searchSimParam.totalCount = data.body.totalCount;
                    }
                });
            },
            timeChange(){
                this.timeCompare=this.purchaseDate<new Date();
            },
            getTelcomCarrier() {
                let _this = this;
                _this.$http.get('api/getTelcomCarrier', {}).then(function (data) {
                    if (data.body.status == "SUCCEED") {
                        _this.telcomCarrierList = data.body.data;
                    }
                });
            },
            getPackageName() {
                let _this = this;
                _this.$http.get('api/getSimPackageList', {}).then(function (data) {
                    if (data.body.status == "SUCCEED") {
                        _this.packageNameList = data.body.data;
                    }
                });
            },
            simSearch(){
                this.searchSimParam.pageIndex = 1;
                this.getVehSimInfoList();
            },
            pageHandler(pageIndex){
                this.searchSimParam.pageIndex = pageIndex;
                this.getVehSimInfoList();
            },
            simInfo(vehSim){
                this.simInfoModal.isShow = true;
                this.simInfoList = vehSim;
            },
            simAdd(){
                let _this = this;
                _this.addVehSimParam = {};
                _this.simAddModal.isShow = true;
                _this.simInfoAddOrEditShow="新增";
                _this.simIsAdd = true;
                _this.purchaseDate = null;
                _this.activeDate = null;
                _this.failureDate = null;
                $(".simIccid").val('');
                $(".simImsi").val('');
                $(".simNumber").val('');
                $(".simCarrierId").val('');
            },
            simAddCall(scope){
                let _this = this;
                _this.addVehSimParam.purchaseDate = _this.purchaseDate?_this.purchaseDate:new Date();
                _this.addVehSimParam.activeDate = "";
                _this.addVehSimParam.failureDate = "";
                _this.addVehSimParam.iccid = $(".simIccid").val();
                _this.addVehSimParam.imsi = $(".simImsi").val();
                _this.addVehSimParam.number = $(".simNumber").val();
                _this.addVehSimParam.carrierId = $(".simCarrierId").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addVehSim', _this.addVehSimParam).then(function (reponse) {
                            var result = reponse.body;
                            if (result.status == "SUCCEED") {
                                _this.alert= {
                                    isShow: true,
                                    content: "新增SIM卡成功",
                                    type: "success"
                                };
                                _this.simAddModal.isShow = false;
                                this.getVehSimInfoList();
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "新增SIM卡失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            simEditCall(scope){
                let _this = this;
                _this.addVehSimParam.purchaseDate = _this.purchaseDate;
                _this.addVehSimParam.activeDate = _this.activeDate;
                _this.addVehSimParam.failureDate = _this.failureDate;
                _this.addVehSimParam.iccid = $(".simIccid").val();
                _this.addVehSimParam.imsi = $(".simImsi").val();
                _this.addVehSimParam.number = $(".simNumber").val();
                _this.addVehSimParam.carrierId = $(".simCarrierId").val();
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVehSim', _this.addVehSimParam).then(function (reponse) {
                            var result = reponse.body;
                            if (result.status == "SUCCEED") {
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑SIM卡成功",
                                    type: "success"
                                };
                                _this.simAddModal.isShow = false;
                                this.getVehSimInfoList();
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑SIM卡失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            isUndefined:function (value){
                if(value && value[0]){
                    return value[0].deviceSn;
                }else{
                    return "";
                }
            },
            statusChange:function (value){
                if(value=="VALID"){
                    return "当前设备";
                }else{
                    return "历史设备";
                }
            },
            vehDeviceChange(deviceName){
                if(deviceName=="VALID"){
                    return "有效";
                }else{
                    return "无效";
                }
            },
            vehSimStateChange(simState){
                if(simState=="ACTIVE"){
                    return "激活";
                }else if(simState=="INACTIVE"){
                    return "未激活";
                }else if(simState=="DISABLED"){
                    return "作废";
                }else{
                    return "不可用";
                }
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
                        url:"api/importSim",
                        type:"post",
                        data:form,
                        processData:false,
                        contentType:false,
                        success:function(data){
                            if(data.status=='SUCCEED'){
                                _this.alert= {
                                    isShow: true,
                                    content: "导入SIM卡成功",
                                    type: "success"
                                };
                                _this.simImportModal.isShow = false;
                                this.getVehSimInfoList();
                            }else if(data.errorNumber>0){
                                _this.simImportResultModal.isShow = true;
                                _this.simImportModal.isShow = false;
                                _this.importResult = data;
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "导入SIM卡失败，解析文件时出错",
                                    type: "danger"
                                };
                            }
                        },
                        error:function(e){
                            _this.alert= {
                                isShow: true,
                                content: "导入SIM卡失败，出现未知错误，可能是磁盘空间已满，请注意清理",
                                type: "danger"
                            };
                        }
                    });
                }
            }
        },
        mounted(){
            let _this = this;
            $('#vehicle-sim-table').treetable({
                nodeIdAttr: "nodeId",
                parentIdAttr:"parentId",
                stringCollapse: "收起",
                stringExpand: "展开",
                expandable: true,
                onNodeExpand: function() {
                    
                }
            });
            _this.loadHtml(function(data){
                if(data.body.status=="SUCCEED"){
                    var data = data.body.data.simCarrierDtos;
                    var str = '';
                    var id = 0;
                    $.each(data,function(i,item){
                        if(item.count == 0){
                            str == '';
                        }else{
                            let activeCt = _this.getCountByStatus("ACTIVE",item);
                            let inactiveCt = _this.getCountByStatus("INACTIVE",item);
                            let disabledCt = _this.getCountByStatus("DISABLED",item);
                            let unavailableCt = _this.getCountByStatus("UNAVAILABLE",item);
                            
                            if(typeof(activeCt)=="undefined"){
                                activeCt = 0;
                            };
                            if(typeof(inactiveCt)=="undefined"){
                                inactiveCt = 0;
                            };
                            if(typeof(disabledCt)=="undefined"){
                                disabledCt = 0;
                            };
                            if(typeof(unavailableCt)=="undefined"){
                                unavailableCt = 0;
                            };

                            str += '<tr data-node-id="' + (++id) + '"  data-tt-branch="false">' +
                                '<td>' +item.name + '</td>' +
                                '<td>' +  activeCt + '</td>' +
                                '<td>' +  inactiveCt + '</td>' +
                                '<td>' +  disabledCt + '</td>' +
                                '<td>' +  unavailableCt + '</td>' +
                                '<td>' +  item.count + '</td>' +
                                '</tr>';
                            _this.exportData.push(item.name);
                            _this.exportData.push(activeCt);
                            _this.exportData.push(inactiveCt);
                            _this.exportData.push(disabledCt);
                            _this.exportData.push(unavailableCt);
                            _this.exportData.push(item.count);
                            _this.data.push(_this.exportData);
                            _this.exportData = []
                        }
                    });
                    var node = $("#vehicle-sim-table").treetable("node",id);
                    $("#vehicle-sim-table").treetable("loadBranch",node,str);
                }
            });
        },
        props:["message"]
    }
</script>

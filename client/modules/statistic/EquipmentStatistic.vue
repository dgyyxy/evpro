<template>
    <div>
        <ul class="breadcrumb">
            <li>报表管理</li>
            <li>设备信息统计</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline no-margin" @submit.prevent="equipmentSearch">
                        <div class="form-group">
                            <label class="control-label label-name">设备供应商：</label>
                            <select class="form-control input-sm manufacturer" v-model="searchDeviceParam.manufacturerId" v-on:change="getDeviceModel()">
                                <option value="">全部</option>
                                <option v-for="manufacturer in vehDeviceManufacturerList" v-bind:value="manufacturer.id">{{manufacturer.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">设备类型：</label>
                            <select class="form-control input-sm device" v-model="searchDeviceParam.modelId">
                                <option value="">全部</option>
                                <option v-for="deviceModel in vehDeviceModelList" v-bind:value="deviceModel.id">{{deviceModel.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">安装时间：</label>
                            <div class="form-group">
                                <date-picker :options="datePickerOption" placement="bottom-end"></date-picker>
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="equipmentSearch">搜索</button>
                        <button @click="_export" class="btn btn-sm btn-default">导出</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="dataTable">
                <thead>
                <tr>
                    <th>设备供应商</th>
                    <th>未安装</th>
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
                <zpagenav :page="searchDeviceParam.pageIndex" :page-size="searchDeviceParam.pageSize" :total="searchDeviceTotalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
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
    .alert-left{
        text-align:left;
    }
    .alert-right{
        text-align:right;
    }
</style>
<script>
    import { tabs, tab ,modal,alert} from 'vue-strap';
    import datePicker from 'iview/src/components/date-picker';
    import XLSX from 'xlsx';
    import 'xlsx/dist/xlsx.full.min.js';
    export default{
        data(){
            return {
              exportData:[],
              data: [
              ["设备供应商","未安装","已作废","有效","总计"]
              ],
                datePickerOption: {
                    disabledDate (date) {
                        return date.valueOf() > Date.now();
                    }
                },
                equipmentAdd:{
                    isShow:false
                },
                equipmentInfo:{
                    isShow:false
                },
                equipmentBind:{
                    isShow:false
                },
                equipmentReset:{
                    isShow:false
                },
                deviceImportModal:{
                    isShow:false
                },
                deviceImportResultModal:{
                    isShow:false
                },
                isCall:false,
                importResult:{},
                equipmentaddShow:false,
                equipDetailsShow:false,
                equipmentInfoModal:false,
                equipmentBindModal:false,
                equipmentResetModal:false,
                searchBindingClick:false,
                maxLink: 5,
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                equipmentAddOrEditShow:"新增",
                searchDeviceParam: {
                    type:"imei",
                    keyword:"",
                    manufacturerId: "",
                    modelId: "",
                    status: "",
                    pageIndex: 1,
                    pageSize: 10
                },
                searchDeviceTotalCount:0,
                searchBindingParams:{
                    type:"iccid",
                    keyword:""
                },
                searchBindingResult:{},
                vehDeviceList: [],
                vehDeviceModelList: [],
                vehDeviceModelListAll: [],
                vehDeviceManufacturerList: [],
                vehDevice: {},
                searchTypes:[
                    {
                        value:"imei",
                        name:"IMEI"
                    },
                    {
                        value:"sn",
                        name:"设备编号"
                    },
                    {
                        value:"vin",
                        name:"车辆VIN码"
                    }
                ],
                equipmentStates:[
                    {
                        value:"",
                        name:"全部"
                    },
                    {
                        value:"VALID",
                        name:"有效"
                    },
                    {
                        value:"UNINSTALLED",
                        name:"未安装"
                    },
                    {
                        value:"DISABLED",
                        name:"已作废"
                    }
                ],
                addVehDeviceParam: {
                    id: 0,
                    modelId: "",
                    sn: "",
                    imei: "",
                    remark: ""
                },
                equipFormVali: {
                    modelId: {
                        required: {
                            rule: true,
                            message: "设备类型请必填"
                        }
                    },
                    sn: {
                        required: {
                            rule: true,
                            message: "序列号必填"
                        },
                        minlength: {
                            rule: 2,
                            message: "序列号至少2个字符"
                        },
                        maxlength: {
                            rule: 50,
                            message: "序列号最多50个字符"
                        }
                    },
                    imei: {
                        minlength: {
                            rule: 15,
                            message: "IMEI为15个数字"
                        },
                        maxlength: {
                            rule: 15,
                            message: "IMEI15为个数字"
                        }
                    }
                },
                equipmentDetailsList:{
                    modelName:"",
                    sn:"",
                    simInfoList:[]
                },
                equipmentBindingList:{},
                file: null,
                isFileHas:true,
                deviceModelId : "",
                deviceSn : "",
                deviceImei : "",
                deviceRemark : ""
            }
        },
        computed:{

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
              saveAs(new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), "设备信息统计" + '.' + (wopts.bookType=="biff2"?"xls":wopts.bookType));
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
                _this.$http.post('api/findEquipReports', {level:1}).then(callFun);
            },
            getCountByStatus(status,data){
                for (var i = 0; i < data.deviceStatusDtos.length; i++) {
                    if (data.deviceStatusDtos[i].statusType == status) {
                        return data.deviceStatusDtos[i].count;
                    }
                }
            },
            getDeviceModelAll(){
                let _this = this;
                _this.$http.get('api/getDeviceModel',{params:{pageAll:true}}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehDeviceModelListAll = data.body.datas;
                    }
                });
            },
            getmanufacturer(){
                let _this = this;
               // var deviceType = $(".device option:selected").val();
                //获取设备类型列表
                _this.$http.post('api/findEquipReports', {level:1}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehDeviceManufacturerList = data.body.data.manufacturerDtos;
                    }
                });
            },
            getDeviceModel(){
                let _this = this;
                var manufacturer = $(".manufacturer option:selected").val();
                if(manufacturer != ''){
                    _this.$http.post('api/findEquipReports', {level:2,manufacturerDtos:[{'id':manufacturer}]}).then(function(data){
                        console.log(data);
                        if(data.body.status=="SUCCEED"){
                            _this.vehDeviceModelList = data.body.data.manufacturerDtos[0].deviceModelDtos;
                        }
                    })
                }else{
                    return false;
                }
                 
            },
            isDevBindSim(vehDevice){
                if(vehDevice.simInfoList.length>0){
                    if(vehDevice.simInfoList[0].simdevStatus=='VALID'){
                        return false;
                    }else{
                        return true;
                    }
                }else{
                    return true;
                }
            },
            equipmentAddCancel(){
                this.equipmentAdd.isShow=false;
                this.errors.clear('deviceModalVali');
            },
            getVehDeviceInfoList(){
                let _this = this;
                let manufacturer = $(".manufacturer option:selected").val();
                let manufacturerName = $(".manufacturer option:selected").text();
                let device = $(".device option:selected").val();
                let deviceName = $(".device option:selected").text();
                if(manufacturer != '' && device == ''){
                    _this.$http.post('api/findEquipReports', {level:1,'manufacturerDtos':[{'id':manufacturer,'name':manufacturerName}]}).then(function(data){
                        if(data.body.status=="SUCCEED"){
                            $('#dataTable tbody').html("");
                            var data = data.body.data.manufacturerDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == 0){
                                    str == '';
                                }else{
                                    let validCt = _this.getCountByStatus("VALID",item);
                                    let uninstalledCt = _this.getCountByStatus("UNINSTALLED",item);
                                    let disabledCt = _this.getCountByStatus("DISABLED",item);
                                    if(typeof(validCt)=="undefined"){
                                        validCt = 0;
                                    };
                                    if(typeof(uninstalledCt)=="undefined"){
                                        uninstalledCt = 0;
                                    };
                                    if(typeof(disabledCt)=="undefined"){
                                        disabledCt = 0;
                                    };

                                    str += '<tr data-node-id="nid1_' + item.id + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  uninstalledCt + '</td>' +
                                        '<td>' +  disabledCt + '</td>' +
                                        '<td>' +  validCt + '</td>' +
                                        '<td>' +  item.count + '</td>' +
                                        '</tr>';
                                }
                            });
                            var node = $("#dataTable").treetable("node",id);
                            $("#dataTable").treetable("loadBranch",node,str);
                        }

                    })
                }else if(manufacturer == ''){
                    $('#dataTable tbody').html("");
                    _this.loadHtml(function(data){
                        if(data.body.status=="SUCCEED"){
                            var data = data.body.data.manufacturerDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.count == 0){
                                    str == '';
                                }else{
                                    let validCt = _this.getCountByStatus("VALID",item);
                                    let uninstalledCt = _this.getCountByStatus("UNINSTALLED",item);
                                    let disabledCt = _this.getCountByStatus("DISABLED",item);
                                    if(typeof(validCt)=="undefined"){
                                        validCt = 0;
                                    };
                                    if(typeof(uninstalledCt)=="undefined"){
                                        uninstalledCt = 0;
                                    };
                                    if(typeof(disabledCt)=="undefined"){
                                        disabledCt = 0;
                                    };

                                    str += '<tr data-node-id="nid1_' + item.id + '"  data-tt-branch="true">' +
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  uninstalledCt + '</td>' +
                                        '<td>' +  disabledCt + '</td>' +
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

                if(manufacturer != '' && device != ''){
                    _this.$http.post('api/findEquipReports', {level:2,'manufacturerDtos':[{'id':manufacturer,'name':manufacturerName,'deviceModelDtos':[{'id':device,'name':deviceName}]}]}).then(function(data){
                        $("#dataTable tbody").html("");
                        if(data.body.status=="SUCCEED"){
                            var data = data.body.data.manufacturerDtos[0].deviceModelDtos;
                            var str = '';
                            var id = 0;
                            $.each(data,function(i,item){
                                if(item.name == ''){
                                    str == '';
                                }else{
                                    let nid = 'nid2_'+item.id;
                                    let validCt = _this.getCountByStatus("VALID",item);
                                    let uninstalledCt = _this.getCountByStatus("UNINSTALLED",item);
                                    let disabledCt = _this.getCountByStatus("DISABLED",item);
                                    if(typeof(validCt)=="undefined"){
                                        validCt = 0;
                                    };
                                    if(typeof(uninstalledCt)=="undefined"){
                                        uninstalledCt = 0;
                                    };
                                    if(typeof(disabledCt)=="undefined"){
                                        disabledCt = 0;
                                    };
                                    
                                    str += '<tr data-node-id="'+ nid +'" data-parent-id="'+id+'"  data-tt-branch="false">' + 
                                        '<td>' +  item.name + '</td>' +
                                        '<td>' +  uninstalledCt + '</td>' +
                                        '<td>' +  disabledCt + '</td>' +
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
            equipmentSearch(){
                this.searchDeviceParam.pageIndex = 1;
                this.getVehDeviceInfoList();
            },
            pageHandler(pageIndex){
                this.searchDeviceParam.pageIndex = pageIndex;
                this.getVehDeviceInfoList();
            },
            equipmentaddVehicle(){
                let _this = this;
                _this.equipmentAddOrEditShow="新增";
                _this.addVehDeviceParam = {
                    modelId: "",
                    sn: "",
                    imei: "",
                    remark: "",
                    id:0
                };
                _this.deviceImei = "";
                _this.deviceRemark = "";
                _this.equipmentAdd.isShow = true;
                $(".deviceModelId").val('');
                $(".deviceSn").val('');
            },
            equipmentAddCall(scope){
                let _this = this;
                _this.addVehDeviceParam = {
                    modelId: $(".deviceModelId").val(),
                    sn: $(".deviceSn").val(),
                    imei: _this.deviceImei,
                    remark: _this.deviceRemark,
                    id:0
                };
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addVehDevice', _this.addVehDeviceParam).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.equipmentAdd.isShow = false;
                                _this.equipmentSearch();
                                _this.alert={
                                    isShow: true,
                                    content: "新增设备信息成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert={
                                    isShow: true,
                                    content: "新增设备信息失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            equipmentEditCall(scope){
                let _this = this;
                _this.addVehDeviceParam = {
                    modelId: $(".deviceModelId").val(),
                    sn: $(".deviceSn").val(),
                    imei: _this.deviceImei,
                    id: _this.addVehDeviceParam.id,
                    remark: _this.deviceRemark
                };
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateVehDevice', _this.addVehDeviceParam).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.equipmentAdd.isShow = false;
                                _this.equipmentSearch();
                                _this.alert={
                                    isShow: true,
                                    content: "编辑设备信息成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert={
                                    isShow: true,
                                    content: "编辑设备信息失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            equipEdit(vehDevice){
                let _this = this;
                _this.equipmentAdd.isShow = true;
                _this.equipmentAddOrEditShow="编辑"
                _this.addVehDeviceParam = {
                    modelId: vehDevice.modelId,
                    sn: vehDevice.sn,
                    imei: vehDevice.imei,
                    remark: vehDevice.remark,
                    id:vehDevice.id
                };
                _this.deviceImei = vehDevice.imei;
                _this.deviceRemark = vehDevice.remark;
                $(".deviceModelId").val(vehDevice.modelId);
                $(".deviceSn").val(vehDevice.sn);
            },
            vehDeviceChange(deviceName){
                if(deviceName=="VALID"){
                    return "有效";
                }else if(deviceName=="UNINSTALLED"){
                    return "未安装";
                }else{
                    return "已作废";
                }
            },
            vehDeviceChangeModal(deviceName){
                if(deviceName=="VALID"){
                    return "当前SIM卡";
                }else{
                    return "历史SIM卡";
                }
            },
            vehDeviceSimChange(name){
                if(name=="VALID"){
                    return "是";
                }else{
                    return "否";
                }
            },

            details(vehDevice){
                this.equipmentInfo.isShow = true;
                this.equipmentDetailsList = vehDevice;
            },
            deviceBinding(vehDevice){
                let _this = this;
                _this.equipmentBind.isShow = true;
                _this.equipmentBindingList = vehDevice;
                _this.searchBindingParams = {
                    type:"iccid",
                    keyword:""
                };
                _this.searchBindingResult = {};
                _this.searchBindingClick = false;
            },
            unbundling:function (equipmentDetailsList){
                let _this = this;
                let deviceId = equipmentDetailsList.id;
                let simId = equipmentDetailsList.simInfoList[0].id;
                let installId = equipmentDetailsList.installId;
                let simdevRemark = equipmentDetailsList.simInfoList[0].simdevRemark || "";
                _this.$http.post('api/unbindSimForDev', {deviceId:deviceId,simId:simId,installId:installId,simdevRemark:simdevRemark}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status=="SUCCEED"){
                        _this.equipmentInfo.isShow = false;
                        _this.alert={
                            isShow: true,
                            content: "设备与SIM卡解绑成功",
                            type: "success"
                        };
                        _this.pageHandler(_this.searchDeviceParam.pageIndex);
                    }else{
                        _this.alert={
                            isShow: true,
                            content: "新增与SIM卡解绑失败,"+result.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            searchBinding: function (){
                let _this = this;
                _this.$http.get('api/getVehSimByType', {params:_this.searchBindingParams}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status=="SUCCEED" && result.data){
                        _this.searchBindingClick = true;
                        _this.searchBindingResult = result.data;
                    }else{
                        _this.searchBindingClick = false;
                        _this.searchBindingResult = {};
                    }
                });
            },
            bundling: function (equipmentData,simData){
                let _this = this;
                let deviceId = equipmentData.id;
                let simId = simData.id;
                let simdevRemark = simData.simdevRemark || "";
                _this.$http.post('api/bindSimForDev', {deviceId:deviceId,simId:simId,simdevRemark:simdevRemark}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status=="SUCCEED"){
                        _this.equipmentBind.isShow = false;
                        _this.alert={
                            isShow: true,
                            content: "设备与SIM卡绑定成功",
                            type: "success"
                        };
                        _this.pageHandler(_this.searchDeviceParam.pageIndex);
                    }else{
                        _this.alert={
                            isShow: true,
                            content: "设备与SIM卡绑定失败,"+result.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            resetEdit: function (){
                this.equipmentReset.isShow = true;
            },
            isUndefined:function (value){
                if(value && value[0]){
                    return value[0].imsi;
                }else{
                    return "";
                }
            },
            isExistVin(value){
                if(value && value[0]){
                    return value[0].vin;
                }else{
                    return "";
                }
            },
            isExistOwnerName(value){
                if(value && value[0]){
                    return value[0].ownerName;
                }else{
                    return "";
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
                        url:"api/importDev",
                        type:"post",
                        data:form,
                        processData:false,
                        contentType:false,
                        success:function(data){
                            if(data.status=='SUCCEED'){
                                _this.alert= {
                                    isShow: true,
                                    content: "导入设备成功",
                                    type: "success"
                                };
                                _this.deviceImportModal.isShow = false;
                                _this.getVehDeviceInfoList();
                            }else if(data.errorNumber>=0){
                                _this.deviceImportResultModal.isShow = true;
                                _this.deviceImportModal.isShow = false;
                                _this.importResult = data;
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "导入设备失败，解析文件时出错",
                                    type: "danger"
                                };
                            }
                        },
                        error:function(e){
                            _this.alert= {
                                isShow: true,
                                content: "导入设备失败，出现未知错误，可能是磁盘空间已满，请注意清理",
                                type: "danger"
                            };
                        }
                    });
                }
            }
        },
        created (){
            let _this = this;
            _this.loadHtml();
            _this.getmanufacturer();
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
                    var node = $("#dataTable").treetable("node",id);
                    if(node.children.length == 0){
                            _this.$http.post('api/findEquipReports', {level:2,manufacturerDtos:[{'id':dataId}]}).then(function(data){
                                if(data.body.status=="SUCCEED"){
                                    var data = data.body.data.manufacturerDtos[0].deviceModelDtos;
                                    var str = '';
                                    $.each(data,function(i,item){
                                        if(item.name == ''){
                                            str == '';
                                        }else{
                                            let nid = 'nid2_'+item.id;
                                            let validCt = _this.getCountByStatus("VALID",item);
                                            let uninstalledCt = _this.getCountByStatus("UNINSTALLED",item);
                                            let disabledCt = _this.getCountByStatus("DISABLED",item);

                                            if(typeof(validCt)=="undefined"){
                                                validCt = 0;
                                            };
                                            if(typeof(uninstalledCt)=="undefined"){
                                                uninstalledCt = 0;
                                            };
                                            if(typeof(disabledCt)=="undefined"){
                                                disabledCt = 0;
                                            };
                                            
                                            str += '<tr data-node-id="'+ nid +'" data-parent-id="'+id+'"  data-tt-branch="false">' + 
                                                '<td>' +  item.name + '</td>' +
                                                '<td>' +  uninstalledCt + '</td>' +
                                                '<td>' +  disabledCt + '</td>' +
                                                '<td>' +  validCt + '</td>' +
                                                '<td>' +  item.count + '</td>' +
                                                '</tr>';
                                            _this.exportData.push(item.name);
                                            _this.exportData.push(uninstalledCt);
                                            _this.exportData.push(disabledCt);
                                            _this.exportData.push(validCt);
                                            _this.exportData.push(item.count);
                                            _this.data.push(_this.exportData);
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
            });
            _this.loadHtml(function(data){
                if(data.body.status=="SUCCEED"){
                    var data = data.body.data.manufacturerDtos;
                    var str = '';
                    var id = 0;
                    $.each(data,function(i,item){
                        if(item.count == 0){
                            str == '';
                        }else{
                            let validCt = _this.getCountByStatus("VALID",item);
                            let uninstalledCt = _this.getCountByStatus("UNINSTALLED",item);
                            let disabledCt = _this.getCountByStatus("DISABLED",item);
                            if(typeof(validCt)=="undefined"){
                                validCt = 0;
                            };
                            if(typeof(uninstalledCt)=="undefined"){
                                uninstalledCt = 0;
                            };
                            if(typeof(disabledCt)=="undefined"){
                                disabledCt = 0;
                            };

                            str += '<tr data-node-id="nid1_' + item.id + '"  data-tt-branch="true">' +
                                '<td>' +  item.name + '</td>' +
                                '<td>' +  uninstalledCt + '</td>' +
                                '<td>' +  disabledCt + '</td>' +
                                '<td>' +  validCt + '</td>' +
                                '<td>' +  item.count + '</td>' +
                                '</tr>';
                                _this.exportData.push(item.name);
                                _this.exportData.push(uninstalledCt);
                                _this.exportData.push(disabledCt);
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
        props:["message"]
    }
</script>

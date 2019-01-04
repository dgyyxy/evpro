<template>
    <div>
        <ul class="breadcrumb">
            <li>基础信息管理</li>
            <li>设备信息管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline no-margin" @submit.prevent="equipmentSearch">
                        <div class="form-group">
                            <label class="control-label label-name">条件：</label>
                            <select class="form-control input-sm" v-model="searchDeviceParam.type">
                                <option v-for="type in searchTypes" v-bind:value="type.value">{{type.name}}</option>
                            </select>
                            <input type="text" class="form-control input-sm" v-model="searchDeviceParam.keyword" placeholder="关键字"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">设备供应商：</label>
                            <select class="form-control input-sm" v-model="searchDeviceParam.manufacturerId" v-on:change="manufacturerChange()">
                                <option value="">全部</option>
                                <option v-for="manufacturer in vehDeviceManufacturerList" v-bind:value="manufacturer.id">{{manufacturer.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">设备类型：</label>
                            <select class="form-control input-sm" v-model="searchDeviceParam.modelId">
                                <option value="">全部</option>
                                <option v-for="deviceModel in vehDeviceModelList" v-bind:value="deviceModel.id">{{deviceModel.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">设备状态：</label>
                            <select class="form-control input-sm" v-model="searchDeviceParam.status">
                                <option v-for="state in equipmentStates" v-bind:value="state.value">{{state.name}}</option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="equipmentSearch">搜索</button>
                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/equipmentInformation/isDeaviceAddAndEdit']
" v-on:click="equipmentaddVehicle">新增</button>
                        <button type="button" class="btn btn-sm btn-success right m-right-lg" id="deviceImport" v-on:click="deviceImportModal.isShow=true" v-if="message['/vehicle/equipmentInformation/isDeviceImport']">导入</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="dataTable">
                <thead>
                <tr>
                    <th>设备供应商</th>
                    <th>设备类型</th>
                    <th>设备编号</th>
                    <th>IMEI</th>
                    <th>安装时间</th>
                    <th>设备状态</th>
                    <th>车辆VIN码</th>
                    <th>车主姓名</th>
                    <th>SIM卡信息</th>
                    <th v-if="message['/vehicle/equipmentInformation/isDeaviceAddAndEdit']">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="vehDevice in vehDeviceList">
                    <td>{{vehDevice.manufacturerName}}</td>
                    <td>{{vehDevice.modelName}}</td>
                    <td>{{vehDevice.sn}}</td>
                    <td>{{vehDevice.imei}}</td>
                    <td>{{vehDevice.installDate | activeDateFilter}}</td>
                    <td>{{vehDeviceChange(vehDevice.status)}}</td>
                    <td>{{vehDevice.vin}}</td>
                    <td>{{vehDevice.ownerName}}</td>
                    <td>
                        <i-button type="ghost" icon="android-apps" size="small" @click="details(vehDevice)" v-if="vehDevice.simInfoList.length>0? true : false">SIM卡与设备已绑定详情</i-button>
                        <i-button type="ghost" icon="link" size="small" @click="deviceBinding(vehDevice)" v-if="message['/vehicle/equipmentInformation/isDevBindSim'] && isDevBindSim(vehDevice)">绑定</i-button>
                    </td>
                    <td v-if="message['/vehicle/equipmentInformation/isDeaviceAddAndEdit']">
                        <i-button type="ghost" icon="edit" size="small" href="javascript:void(0)" @click="equipEdit(vehDevice)">编辑</i-button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="searchDeviceParam.pageIndex" :page-size="searchDeviceParam.pageSize" :total="searchDeviceTotalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <!--新增/编辑-->
        <modal v-model="equipmentAdd.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="equipmentAddCancel"><span>×</span></button>
                <h4 class="modal-title">{{equipmentAddOrEditShow}}设备信息</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form" novalidate data-vv-scope="deviceModalVali">
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">设备类型：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <select
                            v-validate="'required'" name="deviceModelId" data-vv-as="设备类型" :class="{'select': true, 'is-danger': errors.has('deviceModalVali.deviceModelId') }"
                             class="form-control input-sm deviceModelId">
                                <option value="">--请选择--</option>
                                <option v-for="deviceModel in vehDeviceModelListAll" v-bind:value="deviceModel.id">{{deviceModel.name}}</option>
                            </select>
                            <span v-show="errors.has('deviceModalVali.deviceModelId')" class="help is-danger">{{ errors.first('deviceModalVali.deviceModelId') }}</span>
                        </div>
                        <div class="col-md-4 col-sm-4 form-validation">

                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">设备编号：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <input
                             v-validate="'required|min:2|max:45'" name="deviceSn" data-vv-as="设备编号" :class="{'input': true, 'is-danger': errors.has('deviceModalVali.deviceSn') }"
                             type="text" class="form-control input-sm deviceSn"/>
                            <input type="text" class="form-control input-sm hide" v-model="addVehDeviceParam.id"/>
                             <i v-show="errors.has('deviceModalVali.deviceSn')" class="fa fa-warning"></i>
                            <span v-show="errors.has('deviceModalVali.deviceSn')" class="help is-danger">{{ errors.first('deviceModalVali.deviceSn')}}</span>
                        </div>
                        <div class="col-md-4 col-sm-4 form-validation">

                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">IMEI：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <input
                             v-validate="'digits:15'" name="deviceImei" data-vv-as="IMEI" :class="{'input': true, 'is-danger': errors.has('deviceModalVali.deviceImei') }"
                             type="text" class="form-control input-sm" v-model="deviceImei"/>
                             <i v-show="errors.has('deviceModalVali.deviceImei')" class="fa fa-warning"></i>
                            <span v-show="errors.has('deviceModalVali.deviceImei')" class="help is-danger">{{ errors.first('deviceModalVali.deviceImei') }}</span>
                        </div>
                        <div class="col-md-4 col-sm-4 form-validation">

                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-2 col-sm-2 control-label label-name">备注：</label>
                        <div class="col-md-10 col-sm-10 has-icon has-icon-right">
                            <textarea
                            v-validate="'max:40'" name="deviceRemark" data-vv-as="备注" :class="{'textarea': true, 'is-danger': errors.has('deviceModalVali.deviceRemark') }"
                             rows="3" cols="30" class="form-control" v-model="deviceRemark" ></textarea>
                             <i v-show="errors.has('deviceModalVali.deviceRemark')" class="fa fa-warning"></i>
                            <span v-show="errors.has('deviceModalVali.deviceRemark')" class="help is-danger">{{ errors.first('deviceModalVali.deviceRemark') }}</span>
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="equipmentAddCancel">取消</button>
                <button type="button" class="btn btn-success" v-show="equipmentAddOrEditShow=='新增'?true:false"  @click="equipmentAddCall('deviceModalVali')" :disabled="errors.any('deviceModalVali')">确定</button>
                <button type="button" class="btn btn-success" v-show="equipmentAddOrEditShow=='编辑'?true:false" @click="equipmentEditCall('deviceModalVali')" :disabled="errors.any('deviceModalVali')">确定</button>
            </div>
        </modal>
        <!--详情-->
        <modal v-model="equipmentInfo.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="equipmentInfo.isShow=false"><span>×</span></button>
                <h4 class="modal-title">设备详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <label class="control-label label-title">设备信息：</label>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">设备型号：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{equipmentDetailsList.modelName}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">设备编号：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{equipmentDetailsList.sn}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">IMEI：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{equipmentDetailsList.imei}}</label>
                </div>
                <label class="control-label label-title">SIM卡信息：</label>
                <div class="data-table table-responsive" v-if="equipmentDetailsList.simInfoList[0]">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>ICCID</th>
                            <th>IMSI</th>
                            <th>SIM卡电话号码</th>
                            <th>SIM与设备关系</th>
                            <th>解绑时间</th>
                            <th v-if="message['/vehicle/equipmentInformation/isDevUnbindSim']">操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in equipmentDetailsList.simInfoList">
                            <td>{{item.iccid}}</td>
                            <td>{{item.imsi}}</td>
                            <td>{{item.number}}</td>
                            <td>{{vehDeviceChangeModal(item.simdevStatus)}}</td>
                            <td>{{item.simdevUninstalldate | activeDateFilter}}</td>
                            <td v-if="message['/vehicle/equipmentInformation/isDevUnbindSim']">
                                <button type="button" class="btn btn-sm btn-success" v-on:click="unbundling(equipmentDetailsList)" :disabled="item.simdevStatus=='VALID'?false:true">解绑</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="equipmentInfo.isShow = false">关闭</button>
            </div>
        </modal>
        <!--绑定-->
        <modal v-model="equipmentBind.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="equipmentBind.isShow=false"><span>×</span></button>
                <h4 class="modal-title">SIM卡绑定</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">设备型号：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{equipmentBindingList.modelName}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">设备编号：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{equipmentBindingList.sn}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">IMEI：</label>
                    <label class="control-label label-text col-md-3 col-sm-3">{{equipmentBindingList.imei}}</label>
                </div>
                <div class="form-group clearfix">
                    <div class="col-md-3 col-sm-3">
                        <select class="form-control" v-model="searchBindingParams.type">
                            <option value="iccid">ICCID</option>
                            <option value="imsi">IMSI</option>
                            <option value="number">SIM卡电话号码</option>
                        </select>
                    </div>
                    <div class="col-md-4 col-sm-4">
                        <input type="text" class="form-control" v-model="searchBindingParams.keyword"/>
                    </div>
                    <button type="button" class="btn btn-sm btn-success" :disabled="searchBindingParams.keyword==''?true:false" v-on:click="searchBinding">搜索</button>
                </div>
                <div class="data-table table-responsive" v-show="searchBindingClick && searchBindingResult">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>ICCID</th>
                            <th>ISMI</th>
                            <th>SIM卡电话号码</th>
                            <th>是否绑定</th>
                            <th>激活时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="result in searchBindingResult">
                            <td>{{result.iccid}}</td>
                            <td>{{result.imsi}}</td>
                            <td>{{result.number}}</td>
                            <td>{{vehDeviceSimChange(result.simdevStatus)}}</td>
                            <td>{{result.activeDate | activeDateFilter}}</td>
                            <td>
                                <button type="button" class="btn btn-sm btn-success" v-on:click="bundling(equipmentBindingList,result)" :disabled="result.simdevStatus=='VALID'?true:false">绑定</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <p v-show="!searchBindingClick || !searchBindingResult">暂无数据，请注意此处仅支持精确搜索！</p>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="equipmentBind.isShow = false">关闭</button>
            </div>
        </modal>
        <!--设置-->
        <modal v-model="equipmentReset.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="equipmentReset.isShow=false"><span>×</span></button>
                <h4 class="modal-title">设备参数设置</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">设备号：</label>
                    <label class="control-label label-text col-md-2 col-sm-2">6160200001</label>
                    <label class="control-label label-name col-md-2 col-sm-2"></label>
                    <label class="control-label label-name col-md-2 col-sm-2">车辆VIN：</label>
                    <label class="control-label label-text col-md-2 col-sm-2">东风</label>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="equipmentReset.isShow = false">关闭</button>
            </div>
        </modal>
        <!--导入-->
        <modal v-model="deviceImportModal.isShow">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="deviceImportModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">设备导入</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form method="POST" id="uploadForm" action="api/importDev" enctype="multipart/form-data">
                    <input type="file" name="simFile" @change="previewFile"/>
                    <div class="btn-warp">
                        <button type="button" class="btn btn-default right" @click="deviceImportModal.isShow = false">取消</button>
                        <button type="button" class="btn btn-success right m-right-sm" @click="submitFile" :disabled="isFileHas">导入</button>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer hide">
                <button type="button" class="btn btn-default" @click="deviceImportModal.isShow = false">取消</button>
                <button type="submit" class="btn btn-success" :disabled="isFileHas">导入</button>
            </div>
        </modal>
        <!--导入结果反馈-->
        <modal v-model="deviceImportResultModal.isShow">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="deviceImportResultModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">导入结果反馈</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">导入数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importResult.totalRowNumber}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">正常数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importResult.correctNumber}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">绑定数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importResult.succeedNumber}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2 alert-right">错误数量：</label>
                    <label class="control-label label-text col-md-4 col-sm-4 alert-left">{{importResult.errorNumber}}</label>
                </div>
                <label class="control-label label-title">出错详情：</label>
                <div class="data-table table-responsive importResultClass" v-if="importResult.errorList">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>行号</th>
                            <th>错误原因</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in importResult.errorList" v-if="index<10">
                            <td>{{item.rowNumber}}</td>
                            <td>{{item.message}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="deviceImportResultModal.isShow = false">关闭</button>
            </div>
        </modal>
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
    export default{
        data(){
            return {
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
            alert
        },
        methods: {
            getDeviceModelAll(){
                let _this = this;
                _this.$http.get('api/getDeviceModel',{params:{pageAll:true}}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehDeviceModelListAll = data.body.datas;
                    }
                });
            },
            manufacturerChange(){
                let _this = this;
                _this.vehDeviceModelList = [];
                //获取设备类型列表
                _this.$http.get('api/getDeviceModel', {params: {manufacturerId:_this.searchDeviceParam.manufacturerId,type:'name',keyword:''}}).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehDeviceModelList = data.body.datas;
                    }
                });
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
                _this.$http.get('api/getVehDeviceInfoList', { params: _this.searchDeviceParam }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehDeviceList = data.body.datas;
                        _this.searchDeviceParam.pageIndex = data.body.pageIndex;
                        _this.searchDeviceTotalCount = data.body.totalCount;
                    }
                });
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
                /*let supportedTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];*/
                let suffixName =  fileTem.name.split('.')[1];
                if (fileTem && (suffixName=='xls'||suffixName=='xlsx') ) {
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
            _this.getVehDeviceInfoList();
            _this.getDeviceModelAll();
            //获取设备供应商列表
            _this.$http.get('api/getDeviceManufacturer', {params: {pageAll:true}}).then(function(data){
                if(data.body.status=="SUCCEED"){
                    _this.vehDeviceManufacturerList = data.body.datas;
                }
            });
        },
        mounted(){
        },
        props:["message"]
    }
</script>

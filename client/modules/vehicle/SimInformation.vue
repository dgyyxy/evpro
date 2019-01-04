<template>
    <div>
        <ul class="breadcrumb">
            <li>基础信息管理</li>
            <li>SIM卡信息管理</li>
        </ul>
        <div class="smart-widget">
            <div class="smart-widget-inner">
                <div class="smart-widget-body">
                    <form class="form-inline no-margin" @submit.prevent="simSearch">
                        <div class="form-group">
                            <label class="control-label label-name">条件：</label>
                            <select class="form-control input-sm" v-model="searchSimParam.type">
                                <option v-for="type in searchTypes" v-bind:value="type.value">{{type.name}}</option>
                            </select>
                            <input type="text" class="form-control input-sm" v-model="searchSimParam.keyword" placeholder="关键字"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">状态：</label>
                            <select class="form-control input-sm" v-model="searchSimParam.status">
                                <option value="">全部</option>
                                <option v-for="status in statusList" v-bind:value="status.value">{{status.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">套餐名称：</label>
                            <select class="form-control input-sm" v-model="searchSimParam.packageId">
                                <option value="">全部</option>
                                <option v-for="mealName in packageNameList" v-bind:value="mealName.id">{{mealName.name}}</option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-sm btn-success" v-on:click="simSearch">搜索</button>
                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/simInformation/isSimAddAndEdit']" v-on:click="simAdd">新增</button>
                        <button type="button" class="btn btn-sm btn-success right m-right-sm" id="simImport" v-on:click="simImportModal.isShow=true" v-if="message['/vehicle/simInformation/isSimImport']">导入</button>
                    </form>
                </div>
            </div>
        </div>
        <div class="data-table table-responsive">
            <table class="table table-bordered" id="vehicle-sim-table">
                <thead>
                <tr>
                    <th>ICCID</th>
                    <th>IMSI</th>
                    <th>SIM卡电话号码</th>
                    <th>SIM卡状态</th>
                    <th>入库时间</th>
                    <th>套餐名称</th>
                    <th>运营商</th>
                    <th>绑定时间</th>
                    <th>设备编号</th>
                    <th>车辆VIN码</th>
                    <th>激活时间</th>
                    <th>作废时间</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="vehSim in vehSimList">
                    <td>{{vehSim.iccid}}</td>
                    <td>{{vehSim.imsi}}</td>
                    <td>{{vehSim.number}}</td>
                    <td v-text="vehSimStateChange(vehSim.status)"></td>
                    <td>{{vehSim.purchaseDate | activeDateFilter}}</td>
                    <td>{{vehSim.packageName }}</td>
                    <td>{{vehSim.carrierName}}</td>
                    <td>{{vehSim.simdevInstalldate | activeDateFilter}}</td>
                    <td>{{vehSim.deviceSn }}</td>
                    <td>{{vehSim.vin }}</td>
                    <td>{{vehSim.activeDate | activeDateFilter}}</td>
                    <td>{{vehSim.failureDate | activeDateFilter}}</td>
                    <td>
                        <a href="javascript:void(0)" v-on:click="simInfo(vehSim)">详情</a>
                        <a href="javascript:void(0)" v-if="message['/vehicle/simInformation/isSimAddAndEdit']" v-on:click="simEdit(vehSim)">编辑</a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="searchSimParam.pageIndex" :page-size="searchSimParam.pageSize"
                          :total="searchSimParam.totalCount" :max-link="maxLink"
                          :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <!--新增-->
        <modal v-model="simAddModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="simAddCancel"><span>×</span></button>
                <h4 class="modal-title">{{simInfoAddOrEditShow}}SIM信息</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal" role="form" novalidate data-vv-scope="simInfoAddOrVali">
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">ICCID：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <input 
                                type="text" 
                                class="form-control simIccid"
                                v-validate="'required|ICCID'" 
                                name="simIccid" data-vv-as="ICCID"
                                :class="{'input': true, 'is-danger': errors.has('simInfoAddOrVali.simIccid') }" 
                                :disabled="simInfoAddOrEditShow=='编辑'?true:false"/>

                            <i v-if="errors.has('simInfoAddOrVali.simIccid')" class="fa fa-warning"></i>

                            <span v-show="errors.has('simInfoAddOrVali.simIccid')"
                            class="help is-danger">
                                ICCID只能是20位数字或字母
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">IMSI：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <input type="text" class="form-control simImsi"
                            v-validate="'required|min:11|max:15|numeric'" name="simImsi" data-vv-as="IMSI"
                            :class="{'input': true, 'is-danger': errors.has('simInfoAddOrVali.simImsi') }" :disabled="simInfoAddOrEditShow=='编辑'?true:false"/>
                            <i v-show="errors.has('simInfoAddOrVali.simImsi')" class="fa fa-warning"></i>
                            <span v-show="errors.has('simInfoAddOrVali.simImsi')"
                            class="help is-danger">{{ errors.first('simInfoAddOrVali.simImsi') }}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">SIM卡电话号码：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <input type="text" class="form-control simNumber"
                            v-validate="'required|max:15|numeric|min:11'" 
                            name="simNumber" data-vv-as="SIM卡电话号码"
                            :class="{'input': true, 'is-danger': errors.has('simInfoAddOrVali.simNumber') }"
                            :disabled="simInfoAddOrEditShow=='编辑'?true:false"/>
                            <i v-show="errors.has('simInfoAddOrVali.simNumber')" class="fa fa-warning"></i>
                            <span v-show="errors.has('simInfoAddOrVali.simNumber')"
                            class="help is-danger">{{ errors.first('simInfoAddOrVali.simNumber') }}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">运营商：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <select class="form-control input-sm form-input-width simCarrierId" v-validate="'required'" name="simCarrierId" data-vv-as="运营商"
                                    :class="{'select': true, 'is-danger': errors.has('simInfoAddOrVali.simCarrierId') }">
                                <option value="">--请选择--</option>
                                <option v-for="operatorItem in telcomCarrierList" v-bind:value="operatorItem.id">{{operatorItem.nameAlias}}</option>
                            </select>
                            <span v-show="errors.has('simInfoAddOrVali.simCarrierId')"
                                  class="help is-danger">{{ errors.first('simInfoAddOrVali.simCarrierId') }}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">套餐名称：</label>
                        <div class="col-md-4 col-sm-4">
                            <select class="form-control input-sm form-input-width" v-model="addVehSimParam.packageId">
                                <option value="">--请选择--</option>
                                <option v-for="packageNameItem in packageNameList" v-bind:value="packageNameItem.id">{{packageNameItem.name}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">入库时间：</label>
                        <div class="col-md-4 col-sm-4">
                            <date-picker :confirm="true" class="float-l" v-model="purchaseDate" type="datetime" placeholder="入库时间" style="width: 183px" @on-ok="timeChange"></date-picker>
                            <i v-show="!timeCompare" class="fa fa-warning"></i>
                            <span v-show="!timeCompare" class="help is-danger">{{ timeTips }}</span>
                        </div>
                        <div class="col-md-4 col-sm-4 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">SIM卡状态：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <input type="text" class='input'/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">激活时间：</label>
                        <div class="col-md-4 col-sm-4">
                             <Date-picker 
                             type="datetime" 
                             placeholder="激活时间" 
                             style="width: 183px"
                             :confirm="true"
                             @on-ok="timeChange"
                             v-model="activeDate"
                             ></Date-picker>
                        </div>
                        <div class="col-md-4 col-sm-4 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">作废时间：</label>
                        <div class="col-md-4 col-sm-4">
                            <Date-picker 
                             type="datetime" 
                             placeholder="作废时间" 
                             style="width: 183px"
                             :confirm="true"
                             @on-ok="timeChange"
                             v-model="failureDate"
                             ></Date-picker>
                        </div>
                        <div class="col-md-4 col-sm-4 form-validation">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">已用流量：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <input type="text" class='input'/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 col-sm-3 control-label label-name">总流量：</label>
                        <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                            <input type="text" class='input'/>
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="simAddCancel">取消</button>
                <button type="button" class="btn btn-success" @click="simAddCall('simInfoAddOrVali')" v-show="simIsAdd" :disabled="errors.any('simInfoAddOrVali') || !timeCompare">确定</button>
                <button type="button" class="btn btn-success" @click="simEditCall('simInfoAddOrVali')" v-show="!simIsAdd" :disabled="errors.any('simInfoAddOrVali') || !timeCompare">确定</button>
            </div>
        </modal>
        <!--详情-->
        <modal v-model="simInfoModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="simInfoModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">SIM卡详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <label class="control-label label-title">SIM卡信息：</label>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">ICCID：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{simInfoList.iccid}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">IMSI：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{simInfoList.imsi}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">运营商：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{simInfoList.carrierName }}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">套餐名称：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{simInfoList.packageName }}</label>
                </div>
                <label class="control-label label-title">设备信息：</label>
                <div class="data-table table-responsive" v-if="simInfoList.vehSimInfoVOs[0]">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>设备类型</th>
                            <th>设备编号</th>
                            <th>设备与SIM关系</th>
                            <th>IMEI</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in simInfoList.vehSimInfoVOs">
                            <td>{{item.modelName}}</td>
                            <td>{{item.deviceSn}}</td>
                            <td v-text="statusChange(item.simdevStatus)"></td>
                            <td>{{item.imei}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="simInfoModal.isShow = false">关闭</button>
            </div>
        </modal>
        <!--导入-->
        <modal v-model="simImportModal.isShow">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="simImportModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">SIM卡导入</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form method="POST" id="uploadForm" action="api/importSim" enctype="multipart/form-data">
                    <input type="file" name="simFile" @change="previewFile"/>
                    <div class="btn-warp">
                        <button type="button" class="btn btn-default right" @click="simImportModal.isShow = false">取消</button>
                        <button type="button" class="btn btn-success right m-right-sm" @click="submitFile" :disabled="isFileHas">导入</button>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer hide">
                <button type="button" class="btn btn-default" @click="simImportModal.isShow = false">取消</button>
                <button type="submit" class="btn btn-success" :disabled="isFileHas">导入</button>
            </div>
        </modal>
        <!--导入结果反馈-->
        <modal v-model="simImportResultModal.isShow">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="simImportResultModal.isShow=false"><span>×</span></button>
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
                <button type="button" class="btn btn-default" @click="simImportResultModal.isShow = false">关闭</button>
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

    export default{
        data(){
            return {
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
                addVehSimParam: {
                    activeDate:"",
                    id: 0,
                    iccid: "",
                    carrierId: "",
                    imsi: "",
                    number: "",
                    packageId:"",
                    createTime:"",
                    createdBy:"",
                    failureDate:"",
                    purchaseDate:"",
                    status:"ACTIVE",
                    totalFlow:"",
                    updateTime:"",
                    updatedBy:"",
                    usedFlow:""
                },
                searchTypes:[
                    {
                        value:"iccid",
                        name:"ICCID"
                    },
                    {
                        value:"imsi",
                        name:"IMSI"
                    },
                    {
                        value:"simNumber",
                        name:"SIM卡电话号码"
                    },
                    {
                        value:"deviceSn",
                        name:"设备编号"
                    },
                    {
                        value:"vin",
                        name:"车辆VIN码"
                    }
                ],
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
                simCarrierId : "",
                activeTime:'',

            }
        },
        computed:{
        },
        created () {
            this.getVehSimInfoList();
            this.getTelcomCarrier();
            this.getPackageName();
        },
        components: {
            tabs,
            tab,
            modal,
            alert,
            datePicker
        },
        methods: {
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
            simEdit(vehSim){
                let _this = this;
                _this.simAddModal.isShow = true;
                _this.simInfoAddOrEditShow="编辑";
                _this.simIsAdd = false;
                _this.purchaseDate = vehSim.purchaseDate?new Date(vehSim.purchaseDate):"";
                _this.activeDate = vehSim.activeDate?new Date(vehSim.activeDate):"";
                _this.failureDate = vehSim.failureDate?new Date(vehSim.failureDate):"";
                _this.addVehSimParam = {
                    id: vehSim.id,
                    iccid: vehSim.iccid,
                    carrierId: vehSim.carrierId,
                    imsi: vehSim.imsi,
                    number: vehSim.number,
                    packageId:vehSim.packageId,
                    createTime:vehSim.createTime?new Date(vehSim.createTime):"",
                    createdBy:vehSim.createdBy,
                    failureDate:vehSim.failureDate?new Date(vehSim.failureDate):"",
                    purchaseDate:vehSim.purchaseDate?new Date(vehSim.purchaseDate):"",
                    status:vehSim.status || "",
                    totalFlow:vehSim.totalFlow,
                    updateTime:vehSim.updateTime?new Date(vehSim.updateTime):"",
                    activeDate:vehSim.activeDate?new Date(vehSim.activeDate):"",
                    updatedBy:vehSim.updatedBy,
                    usedFlow:vehSim.usedFlow
                };
                $(".simIccid").val(vehSim.iccid);
                $(".simImsi").val(vehSim.imsi);
                $(".simNumber").val(vehSim.number);
                $(".simCarrierId").val(vehSim.carrierId);
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
                _this.addVehSimParam.activeDate = _this.activeDate?_this.activeDate:'';
                _this.addVehSimParam.failureDate = _this.failureDate?_this.purchaseDate:'';
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
                /*let supportedTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                if (fileTem && supportedTypes.indexOf(fileTem.type) >= 0) {
                */
                /*前端只能判断后缀名！！！！！*/
                let suffixName =  fileTem.name.split('.')[1];
                /**/
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
        },
        props:["message"]
    }
</script>

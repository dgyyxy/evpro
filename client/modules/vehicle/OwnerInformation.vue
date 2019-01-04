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
                            <select class="form-control input-sm input-fixed" v-model="searchOwner.provinceCode" v-on:change="provinceChange()">
                                <option value="">全部</option>
                                <option v-for="provinceItem in provinceList" v-bind:value="provinceItem.id">{{provinceItem.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">城市：</label>
                            <select class="form-control input-sm input-fixed" v-model="searchOwner.cityCode">
                                <option value="">全部</option>
                                <option v-for="cityItem in cityList" v-bind:value="cityItem.id">{{cityItem.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">条件：</label>
                            <select class="form-control input-sm input-fixed" v-model="searchOwner.type">
                                <option v-for="type in searchTypes" v-bind:value="type.value">{{type.name}}</option>
                            </select>
                            <input type="text" class="form-control input-sm" v-model="searchOwner.keyword" placeholder="关键字"/>
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
                            <label class="control-label label-name">品牌：</label>
                            <select class="form-control input-sm input-fixed" v-model="searchOwner.brandId" v-on:change="searchOwnerBrandChanged()">
                                <option value="">全部</option>
                                <option v-for="brand in vehBrandList" v-bind:value="brand.id">{{brand.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">车系：</label>
                            <select class="form-control input-sm input-fixed" v-model="searchOwner.seriesId" v-on:change="searchOwnerSeriesChanged()">
                                <option value="">全部</option>
                                <option v-for="series in vehSeriesList" v-bind:value="series.id">{{series.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">车型：</label>
                            <select class="form-control input-sm input-fixed" v-model="searchOwner.modelId">
                                <option value="">全部</option>
                                <option v-for="model in vehModelList" v-bind:value="model.id">{{model.name}}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label label-name">年龄段：</label>
                            <select class="form-control input-sm input-fixed" v-model="searchOwner.ageBracket">
                                <option value="">全部</option>
                                <option v-for="age in ageRangeList" v-bind:value="age.value">{{age.text}}</option>
                            </select>
                        </div>
                        <button type="button" id="vehicleSearch" class="btn btn-sm btn-success" v-on:click="vehicleSearch">搜索</button>
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
                    <th>车主姓名</th>
                    <th>身份证号</th>
                    <th>性别</th>
                    <th>省</th>
                    <th>市</th>
                    <th>手机号</th>
                    <th>车辆VIN码</th>
                    <th>品牌</th>
                    <th>车系</th>
                    <th>车型</th>
                    <th>购车时间</th>
                    <th>SIM卡电话号码</th>
                    <th>设备编号</th>
                    <th v-if="message['/vehicle/ownerInformation/isOwnerTserviceAndStatus']">T服务开通状态</th>
                    <th v-if="message['/vehicle/ownerInformation/isOwnerTserviceAndStatus']">T服务开通时间</th>
                    <th v-if="message['/vehicle/ownerInformation/isOwnerTserviceAndStatus']">车主状态</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="vehicleOwnerItem in vehicleOwnerList">
                    <td>{{vehicleOwnerItem.ownerName}}</td>
                    <td>{{vehicleOwnerItem.idNumber}}</td>
                    <td>{{genderChange(vehicleOwnerItem.gender)}}</td>
                    <td v-text="searchByprovinceCode(vehicleOwnerItem.provinceCode)"></td>
                    <td v-text="searchByCityCode(vehicleOwnerItem.cityCode)"></td>
                    <td>{{vehicleOwnerItem.mobilePhone}}</td>
                    <td>{{vehicleOwnerItem.vin}}</td>
                    <td>{{vehicleOwnerItem.brandName}}</td>
                    <td>{{vehicleOwnerItem.seriesName}}</td>
                    <td>{{vehicleOwnerItem.modelName}}</td>
                    <td>{{vehicleOwnerItem.saleDate | activeDateFilter}}</td>
                    <td>{{vehicleOwnerItem.simNumber}}</td>
                    <td>{{vehicleOwnerItem.deviceSN}}</td>
                    <td v-if="message['/vehicle/ownerInformation/isOwnerTserviceAndStatus']" v-text="TserviceStatusChange(vehicleOwnerItem.tServerStatus)"></td>
                    <td v-if="message['/vehicle/ownerInformation/isOwnerTserviceAndStatus']">{{vehicleOwnerItem.tServerStartTime | activeDateFilter}}</td>
                    <td v-if="message['/vehicle/ownerInformation/isOwnerTserviceAndStatus']" v-text="vehOwnerTranslate(vehicleOwnerItem)"></td>
                    <td>
                        <i-button type="ghost" size="small" icon="document-text" @click="ownerInfo(vehicleOwnerItem)">详情</i-button>
                        <i-button type="ghost" size="small" icon="edit" @click="ownerEdit(vehicleOwnerItem)" v-if="message['/vehicle/ownerInformation/isOwnerEdit']">编辑</i-button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="pagination-row clearfix">
            <div class="pull-right pull-left-sm">
                <zpagenav :page="searchOwner.pageIndex" :page-size="searchOwner.pageSize" :total="searchOwnerTotalCount" :max-link="maxLink" :page-handler="pageHandler"></zpagenav>
            </div>
        </div>
        <!--车主详情-->
        <modal v-model="ownerInfoModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="ownerInfoModal.isShow=false"><span>×</span></button>
                <h4 class="modal-title">车主详情</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <label class="control-label label-title">车主信息：</label>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">省份：</label>
                    <label class="control-label label-text col-md-4 col-sm-4" v-text="searchByprovinceCode(ownerInfoList.provinceCode)"></label>
                    <label class="control-label label-name col-md-2 col-sm-2">城市：</label>
                    <label class="control-label label-text col-md-4 col-sm-4" v-text="searchByCityCode(ownerInfoList.cityCode)"></label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">姓名：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{ownerInfoList.firstName}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">身份证号：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{ownerInfoList.idNumber}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">邮箱：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{ownerInfoList.email}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">家庭电话：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{ownerInfoList.homePhone}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">手机号：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{ownerInfoList.mobilePhone}}</label>
                    <label class="control-label label-name col-md-2 col-sm-2">联系人：</label>
                    <label class="control-label label-text col-md-4 col-sm-4">{{ownerInfoList.emergencyContact}}</label>
                </div>
                <div class="form-group clearfix">
                    <label class="control-label label-name col-md-2 col-sm-2">联系地址：</label>
                    <label class="control-label label-text col-md-10 col-sm-10">{{ownerInfoList.address}}</label>
                </div>
                <label class="control-label label-title" v-if="ownerInfoList.vin">车辆信息：</label>
                <div class="data-table table-responsive" v-if="ownerInfoList.vin">
                    <table class="table table-condensed table-hover table-bordered" style="margin-bottom:0px;">
                        <thead>
                        <tr>
                            <th>车辆VIN码</th>
                            <th>经销商名称</th>
                            <th>车牌号</th>
                            <th>购车日期</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{ownerInfoList.vin}}</td>
                            <td>{{ownerInfoList.dealerName}}</td>
                            <td>{{ownerInfoList.licensePlate}}</td>
                            <td>{{ownerInfoList.saleDate | activeDateFilter}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="ownerInfoModal.isShow = false">关闭</button>
            </div>
        </modal>
        <!--车主编辑-->
        <modal v-model="ownerEditModal.isShow" :backdrop="false">
            <div slot="modal-header" class="modal-header">
                <button type="button" class="close" v-on:click="ownerEditCancel"><span>×</span></button>
                <h4 class="modal-title">编辑车主信息</h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <form class="form-horizontal no-margin" role="form" novalidate data-vv-scope="ownerVali">
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="idNumber" class="col-md-4 col-sm-4 control-label label-name">身份证号<span class="red">*</span>:</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input type="text" class="form-control input-sm ownerIdNumber" id="idNumber" placeholder="" :disabled="ownerEditModal" v-validate="'required'" name="ownerIdNumber" data-vv-as="身份证号" :class="{'select': true, 'is-danger': errors.has('ownerVali.ownerIdNumber') }"/>
                                <i v-show="errors.has('ownerVali.ownerIdNumber')" class="fa fa-warning"></i>
                                <span v-show="errors.has('ownerVali.ownerIdNumber')" class="help is-danger">{{ errors.first('ownerVali.ownerIdNumber') }}</span>

                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="mobilePhone" class="col-md-4 col-sm-4 control-label label-name">手机号<span class="red">*</span>:</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input type="text" class="form-control input-sm ownerMobilePhone" id="mobilePhone" placeholder="" :disabled="ownerEditModal" v-validate="'required'" name="ownerMobilePhone" data-vv-as="手机号" :class="{'select': true, 'is-danger': errors.has('ownerVali.ownerMobilePhone') }">
                                <i v-show="errors.has('ownerVali.ownerMobilePhone')" class="fa fa-warning"></i>
                                <span v-show="errors.has('ownerVali.ownerMobilePhone')" class="help is-danger">{{ errors.first('ownerVali.ownerMobilePhone') }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label for="ownerName" class="col-md-4 col-sm-4 control-label label-name">车主姓名<span class="red">*</span>:</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input type="text" class="form-control input-sm ownerFirstName" id="ownerName" placeholder="" :disabled="ownerEditModal" v-validate="'required'" name="ownerFirstName" data-vv-as="车主姓名" :class="{'select': true, 'is-danger': errors.has('ownerVali.ownerFirstName') }">
                                <i v-show="errors.has('ownerVali.ownerFirstName')" class="fa fa-warning"></i>
                                <span v-show="errors.has('ownerVali.ownerFirstName')" class="help is-danger">{{ errors.first('ownerVali.ownerFirstName') }}</span>
                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label for="email" class="col-md-4 col-sm-4 control-label label-name">邮箱:</label>
                            <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                <input type="text" class="form-control input-sm ownerEmail" id="email" placeholder="" v-validate="'email'" name="ownerEmail" data-vv-as="邮箱" :class="{'select': true, 'is-danger': errors.has('ownerVali.ownerEmail') }">
                                <i v-show="errors.has('ownerVali.ownerEmail')" class="fa fa-warning"></i>
                                <span v-show="errors.has('ownerVali.ownerEmail')" class="help is-danger">{{ errors.first('ownerVali.ownerEmail') }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label class="col-md-4 col-sm-4 control-label label-name">省份:</label>
                            <div class="col-md-8 col-sm-8">
                                <select class="form-control input-sm form-input-width" v-model="ownerEditParams.provinceCode" v-on:change="provinceChange">
                                    <option value="">--请选择--</option>
                                    <option v-for="provinceItem in provinceList" v-bind:value="provinceItem.id">{{provinceItem.name}}</option>
                                </select>

                            </div>
                        </div>
                        <div class="form-line-validator">
                            <label class="col-md-4 col-sm-4 control-label label-name">城市:</label>
                            <div class="col-md-8 col-sm-8">
                                <select class="form-control input-sm form-input-width" v-model="ownerEditParams.cityCode">
                                    <option value="">--请选择--</option>
                                    <option v-for="cityItem in cityList" v-bind:value="cityItem.id">{{cityItem.name}}</option>
                                </select>

                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="form-line-validator">
                            <label class="col-md-4 col-sm-4 control-label label-name">详细地址:</label>
                            <div class="col-md-8 col-sm-8">
                                <input type="text" class="form-control input-sm" v-model="ownerEditParams.address"/>
                                <input type="text" class="form-control input-sm hide" v-model="ownerEditParams.id"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="ownerEditCancel">取消</button>
                <button type="button" class="btn btn-success" :disabled="errors.any('ownerVali')" @click="saveOwnerInfoCall('ownerVali')">保存</button>
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
    .input-fixed{
        width:140px !important;
    }
</style>
<script>
    import {modal,alert} from 'vue-strap';
    import $ from "jquery";
    import datePicker from 'iview/src/components/date-picker';
    export default{
        data(){
            return {
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
            vehOwnerTranslate(owner){
                if(owner.relationType){
                    if(owner.relationType=='OWNED'){
                        return "有效车主";
                    }else{
                        return "无效车主";
                    }
                }else{
                    return "无效车主";
                }
            },
            TserviceStatusChange(status){
                switch (status){
                    case "using":
                        return "开通成功";
                        break;
                    case "failed":
                        return "开通失败";
                        break;
                    case "closed":
                        return "已关闭";
                        break;
                    case "expired":
                        return "已过期";
                        break;
                }
            },
            ownerEditCancel(){
                this.ownerEditModal.isShow = false;
                this.errors.clear('ownerVali');
            },
            getVehOwnerList(){
                let _this = this;
                if(_this.message['/vehicle/ownerInformation/isOwnerTserviceAndStatus'] && (_this.tServerStartTime || _this.tServerEndTime)){
                    let tempStart = eval(_this.tServerStartTime);
                    let tempEnd = eval(_this.tServerEndTime);
                    _this.searchOwner.tServerStartTime = _this.tServerStartTime ? tempStart.getTime() : 0;
                    _this.searchOwner.tServerEndTime = _this.tServerEndTime ? tempEnd.getTime() : new Date().getTime();
                }else{
                    _this.searchOwner.tServerStartTime = new Date();
                    _this.searchOwner.tServerEndTime = new Date();
                }
                _this.$http.get('api/getVehOwnerList', { params: _this.searchOwner }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.vehicleOwnerList = data.body.datas;
                        _this.pageIndex = data.body.pageIndex;
                        _this.searchOwnerTotalCount = data.body.totalCount;
                        _this.openTServerNum = data.body.openTServerNum;
                    }
                });
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
        },
        mounted(){
            this.getVehOwnerList();
        },
        props:["message"]
    }
</script>

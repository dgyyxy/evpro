<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="model-container">
        <ul class="breadcrumb">
            <li>基础信息管理</li>
            <li>设备基础信息管理</li>
        </ul>
        <div class="tab-container">
            <tabs >
                <tab header="设备供应商">
                    <div class="smart-widget">
                        <div class="smart-widget-inner">
                            <div class="smart-widget-body">
                                <form class="form-inline no-margin" @submit.prevent="manufacturerSearch">
                                    <div class="form-group" style="width:100%;">
                                        <label class="control-label">搜索条件:</label>
                                        <select class="form-control input-sm m-right-lg" v-model="searchDeviceManufacturer.type">
                                            <option v-for="item in manufacturerSearchType" v-bind:value="item.value">{{item.name}}</option>
                                        </select>
                                        <label class="control-label">关键字:</label>
                                        <input type="text" class="form-control input-sm m-right-lg" v-model="searchDeviceManufacturer.keyword"/>
                                        <button type="button" class="btn btn-sm btn-success" v-on:click="manufacturerSearch()">搜索</button>
                                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/deviceType/isDeviceManufacturerAdd']" v-on:click="addManufacturer()">新增</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="data-table table-responsive">
                        <table class="table table-bordered" id="dataTable4">
                            <thead>
                            <tr>
                                <th>供应商名称</th>
                                <th>别名</th>
                                <th>备注</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="deviceManufacturerItem in deviceManufacturerList">
                                <td>{{deviceManufacturerItem.name}}</td>
                                <td>{{deviceManufacturerItem.nameAlias}}</td>
                                <td>{{deviceManufacturerItem.remark}}</td>
                                <td>
                                    <i-button type="ghost" icon="edit" size="small" v-if="message['/vehicle/deviceType/isDeviceManufacturerEdit']"  @click="manufacturerEdit(deviceManufacturerItem)">编辑</i-button>
                                    <i-button type="ghost" icon="android-delete" size="small" v-if="message['/vehicle/deviceType/isDeviceManufacturerDel']" v-on:click="manufacturerDel(deviceManufacturerItem)">删除</i-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination-row clearfix">
                        <div class="pull-right pull-left-sm">
                            <zpagenav :page="searchDeviceManufacturer.pageIndex" :page-size="searchDeviceManufacturer.pageSize" :total="searchDeviceManufacturer.totalCount" :max-link="maxLink" :page-handler="manufacturerPageHandler"></zpagenav>
                        </div>
                    </div>
                    <!--供应商-新增-->
                    <modal v-model="manufacturerAdd.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="manufacturerAddCancel"><span>×</span></button>
                            <h4 class="modal-title">{{manufacturerModalTitle}}供应商</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <form class="form-horizontal" role="form" novalidate data-vv-scope="manufacturerForm">
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">供应商名称：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input type="text" class="form-control input-sm hide" v-model="manufacturerParams.id"/>
                                        <input type="text" class="form-control input-sm manufacturerName" name="manufacturerName"
                                        data-vv-as="供应商名称" v-validate="'required|max:10'" :class="{'input': true, 'is-danger': errors.has('manufacturerForm.manufacturerName') }"/>
                                        <i v-show="errors.has('manufacturerForm.manufacturerName')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('manufacturerForm.manufacturerName')" class="help is-danger">{{ errors.first('manufacturerForm.manufacturerName') }}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">别名：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input
                                         data-vv-as="别名" v-validate="'max:10'" name="manufacturerNameAlias" :class="{'input': true, 'is-danger': errors.has('manufacturerForm.manufacturerNameAlias') }"
                                         type="text" class="form-control input-sm" v-model="manufacturerNameAlias"/>
                                         <i v-show="errors.has('manufacturerForm.manufacturerNameAlias')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('manufacturerForm.manufacturerNameAlias')" class="help is-danger">{{ errors.first('manufacturerForm.manufacturerNameAlias') }}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">备注：</label>
                                    <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                        <textarea
                                        v-validate="'max:40'" name="manufacturerRemark" data-vv-as="备注" :class="{'textarea': true, 'is-danger': errors.has('manufacturerForm.manufacturerRemark') }"
                                         rows="2" cols="20" class="form-control" id="remark" v-model="manufacturerRemark" placeholder=""></textarea>
                                         <i v-show="errors.has('manufacturerForm.manufacturerRemark')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('manufacturerForm.manufacturerRemark')" class="help is-danger">{{ errors.first('manufacturerForm.manufacturerRemark') }}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="manufacturerAddCancel">取消</button>
                            <button type="button" class="btn btn-success" @click="manufacturerAddCall('manufacturerForm')" v-show="manufacturerModalTitle=='新增'?true:false" :disabled="errors.any('manufacturerForm')">确定</button>
                            <button type="button" class="btn btn-success" @click="manufacturerEditCall('manufacturerForm')" v-show="manufacturerModalTitle=='编辑'?true:false" :disabled="errors.any('manufacturerForm')">确定</button>
                        </div>
                    </modal>
                    <!-- 供应商-删除-->
                    <modal v-model="manufacturerDelModal.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="manufacturerDelModal.isShow=false"><span>×</span></button>
                            <h4 class="modal-title">删除确认</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <p>您确定要删除供应商{{manufacturerDelList.name}}?</p>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="manufacturerDelModal.isShow = false">取消</button>
                            <button type="button" class="btn btn-success" @click="manufacturerDelCall">确定</button>
                        </div>
                    </modal>
                </tab>
                <tab header="设备类型">
                    <div class="smart-widget">
                        <div class="smart-widget-inner">
                            <div class="smart-widget-body">
                                <form class="form-inline no-margin" @submit.prevent="searchModel">
                                    <div class="form-group" style="width:100%;">
                                        <label class="control-label">供应商:</label>
                                        <select class="form-control input-sm m-right-lg" v-model="searchDeviceModel.manufacturerId">
                                            <option value="">--请选择--</option>
                                            <option v-for="deviceManufacturerItem in deviceManufacturerListAll" v-bind:value="deviceManufacturerItem.id">{{deviceManufacturerItem.name}}</option>
                                        </select>
                                        <label class="control-label">设备类型关键字:</label>
                                        <input type="text" class="form-control input-sm m-right-lg" v-model="searchDeviceModel.keyword"/>
                                        <button type="button" class="btn btn-sm btn-success" v-on:click="searchModel">搜索</button>
                                        <button type="button" class="btn btn-sm btn-success right" v-if="message['/vehicle/deviceType/isDeviceModelAdd']" v-on:click="addModel">新增</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="data-table table-responsive">
                        <table class="table table-bordered" id="dataTable3">
                            <thead>
                            <tr>
                                <th>设备类型</th>
                                <th>别名</th>
                                <th>设备供应商</th>
                                <th>备注</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="searchDeviceModelItem in searchDeviceModelList">
                                <td>{{searchDeviceModelItem.name}}</td>
                                <td>{{searchDeviceModelItem.nameAlias}}</td>
                                <td>{{searchDeviceModelItem.manufacturerName}}</td>
                                <td>{{searchDeviceModelItem.remark}}</td>
                                <td>
                                    <i-button type="ghost" size="small" icon="edit" v-if="message['/vehicle/deviceType/isDeviceModelEdit']" @click="deviceModelEdit(searchDeviceModelItem)">编辑</i-button>
                                    <i-button type="ghost" size="small" icon="android-delete" v-if="message['/vehicle/deviceType/isDeviceModelDel']" @click="deviceModelDel(searchDeviceModelItem)">删除</i-button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="pagination-row clearfix">
                        <div class="pull-right pull-left-sm">
                            <zpagenav :page="searchDeviceModel.pageIndex" :page-size="searchDeviceModel.pageSize" :total="searchDeviceModel.totalCount" :max-link="maxLink" :page-handler="modelPageHandler"></zpagenav>
                        </div>
                    </div>
                    <!--新增  设备类型-->
                    <modal v-model="deviceAdd.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="deviceAddCancel"><span>×</span></button>
                            <h4 class="modal-title">{{deviceModelTitle}}设备类型</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <form class="form-horizontal" role="form" novalidate data-vv-scope="deviceManufacturerItemVali">
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">设备供应商：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <select
                                        v-validate="'required'" name="manufacturerInfo" data-vv-as="设备供应商" :class="{'select': true, 'is-danger': errors.has('deviceManufacturerItemVali.manufacturerInfo') }"
                                         class="form-control input-sm manufacturerInfo">
                                            <option value="">--请选择--</option>
                                            <option v-for="deviceManufacturerItem in deviceManufacturerListAll" v-bind:value="deviceManufacturerItem.id">{{deviceManufacturerItem.name}}</option>
                                        </select>
                                        <span v-show="errors.has('deviceManufacturerItemVali.manufacturerInfo')" class="help is-danger">{{ errors.first('deviceManufacturerItemVali.manufacturerInfo') }}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">设备类型：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input
                                        v-validate="'required|max:10'" name="modelName" data-vv-as="设备类型" :class="{'input': true, 'is-danger': errors.has('deviceManufacturerItemVali.modelName') }"
                                         type="text" class="form-control input-sm modelName"/>
                                         <i v-show="errors.has('deviceManufacturerItemVali.modelName')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('deviceManufacturerItemVali.modelName')" class="help is-danger">{{ errors.first('deviceManufacturerItemVali.modelName')}}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">别名：</label>
                                    <div class="col-md-4 col-sm-4 has-icon has-icon-right">
                                        <input
                                        v-validate="'max:10'" name="modelNameAlias" data-vv-as="别名" :class="{'input': true, 'is-danger': errors.has('deviceManufacturerItemVali.modelNameAlias') }"
                                         type="text" class="form-control input-sm" v-model="modelNameAlias"/>
                                         <i v-show="errors.has('deviceManufacturerItemVali.modelNameAlias')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('deviceManufacturerItemVali.modelNameAlias')" class="help is-danger">{{ errors.first('deviceManufacturerItemVali.modelNameAlias')}}</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-md-2 col-sm-2 control-label label-name">备注：</label>
                                    <div class="col-md-8 col-sm-8 has-icon has-icon-right">
                                        <textarea
                                        v-validate="'max:40'" name="modelRemark" data-vv-as="备注" :class="{'input': true, 'is-danger': errors.has('deviceManufacturerItemVali.modelRemark') }"
                                         rows="3" cols="30" class="form-control" v-model="modelRemark" ></textarea>
                                         <i v-show="errors.has('deviceManufacturerItemVali.modelRemark')" class="fa fa-warning"></i>
                                        <span v-show="errors.has('deviceManufacturerItemVali.modelRemark')" class="help is-danger">{{ errors.first('deviceManufacturerItemVali.modelRemark')}}</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="deviceAddCancel">取消</button>
                            <button type="button" class="btn btn-success" @click="addDeviceModelCall('deviceManufacturerItemVali')" v-show="deviceModelTitle=='新增'?true:false" :disabled="errors.any('deviceManufacturerItemVali')">确定</button>
                            <button type="button" class="btn btn-success" @click="editDeviceModelCall('deviceManufacturerItemVali')" v-show="deviceModelTitle=='编辑'?true:false" :disabled="errors.any('deviceManufacturerItemVali')">确定</button>
                        </div>
                    </modal>
                    <!--删除  设备类型-->
                    <modal v-model="deviceDel.isShow" :backdrop="false">
                        <div slot="modal-header" class="modal-header">
                            <button type="button" class="close" v-on:click="deviceDel.isShow=false"><span>×</span></button>
                            <h4 class="modal-title">删除确认</h4>
                        </div>
                        <div slot="modal-body" class="modal-body">
                            <p>确认删除设备类型：{{deviceModelDelList.name}}？</p>
                        </div>
                        <div slot="modal-footer" class="modal-footer">
                            <button type="button" class="btn btn-default" @click="deviceDel.isShow = false">取消</button>
                            <button type="button" class="btn btn-success" @click="deviceModelDelCall">确定</button>
                        </div>
                    </modal>
                </tab>
            </tabs>
        </div>
        <alert v-model="alert.isShow" placement="top" duration="3000" :type="alert.type" width="400px" dismissable
               class="prompt-alert-box">
            <span class="icon-info-circled alert-icon-float-left"></span>
            <p v-text="alert.content"></p>
        </alert>
    </div>
</template>
<script>
    import { tabs, tab ,modal,alert} from 'vue-strap';

    export default{
        data(){
            return {
                manufacturerAdd:{
                    isShow:false
                },
                manufacturerDelModal:{
                    isShow:false
                },
                deviceAdd:{
                    isShow:false
                },
                deviceDel:{
                    isShow:false
                },
                alert: {
                    isShow: false,
                    content: "",
                    type: ""
                },
                maxLink:5,
                manufacturerModalTitle:"新增",
                deviceManufacturerList:{},
                deviceManufacturerListAll:{},
                manufacturerDelList:{},
                searchDeviceManufacturer:{
                    type:"name",
                    keyword:"",
                    pageIndex:1,
                    pageSize:10,
                    totalCount:1
                },
                manufacturerParams:{
                    id:0,
                    name:"",
                    nameAlias:"",
                    remark:""
                },
                manufacturerSearchType:[
                    {
                        name:"供应商名称",
                        value:"name"
                    },
                    {
                        name:"别名",
                        value:"nameAlias"
                    }
                ],
                deviceModelDelList:{},
                manufacturerInfo:[],
                modelParams:{
                    id:0,
                    manufacturerId:"",
                    manufacturerName:"",
                    name:"",
                    nameAlias:"",
                    remark:""
                },
                deviceModelTitle:"新增",
                searchDeviceModel:{
                    type:"name",
                    keyword:"",
                    manufacturerId:"",
                    pageIndex:1,
                    pageSize:10,
                    totalCount:1
                },
                searchDeviceModelList:{},
                manufacturerName : "",
                manufacturerNameAlias: "",
                manufacturerRemark: "",
                modelName : "",
                modelNameAlias : "",
                modelRemark : ""
            }
        },
        components: {
            tabs,
            tab,
            modal,
            alert
        },
        methods: {
            manufacturerAddCancel(){
                this.manufacturerAdd.isShow=false;
                this.errors.clear('manufacturerForm');
            },
            deviceAddCancel(){
                this.deviceAdd.isShow=false;
                this.errors.clear('deviceManufacturerItemVali');
            },
            getDeviceManufacturer(way){
                let _this = this;
                _this.$http.get('api/getDeviceManufacturer', { params: _this.searchDeviceManufacturer }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.deviceManufacturerList = data.body.datas;
                        if(way!='search'){
                            _this.$http.get('api/getDeviceManufacturer', { params:{pageAll:true} }).then(function(data){
                                if(data.body.status=="SUCCEED"){
                                    _this.deviceManufacturerListAll = data.body.datas;
                                }
                            });
                        }
                        _this.searchDeviceManufacturer.pageIndex = data.body.pageIndex;
                        _this.searchDeviceManufacturer.totalCount = data.body.totalCount;
                    }
                });
            },
            getDeviceModel(){
                let _this = this;
                _this.$http.get('api/getDeviceModel', { params: _this.searchDeviceModel }).then(function(data){
                    if(data.body.status=="SUCCEED"){
                        _this.searchDeviceModelList = data.body.datas;
                        _this.searchDeviceModel.pageIndex = data.body.pageIndex;
                        _this.searchDeviceModel.totalCount = data.body.totalCount;
                    }
                });
            },
            manufacturerSearch:function (){
                this.searchDeviceManufacturer.pageIndex = 1;
                this.getDeviceManufacturer('search');
            },
            manufacturerPageHandler:function (pageIndex){
                this.searchDeviceManufacturer.pageIndex = pageIndex;
                this.getDeviceManufacturer('page');
            },
            addManufacturer:function (){
                let _this = this;
                _this.manufacturerModalTitle = "新增";
                _this.manufacturerAdd.isShow = true;
                _this.manufacturerParams = {};
                _this.manufacturerNameAlias = "";
                _this.manufacturerRemark = "";
                $(".manufacturerName").val('');
            },
            manufacturerEdit:function (manufacturer){
                let _this = this;
                _this.manufacturerModalTitle = "编辑";
                _this.manufacturerAdd.isShow = true;
                _this.manufacturerParams = {
                    id:manufacturer.id,
                    name:manufacturer.name,
                    nameAlias:manufacturer.nameAlias,
                    remark:manufacturer.remark
                };
                _this.manufacturerNameAlias = manufacturer.nameAlias;
                _this.manufacturerRemark = manufacturer.remark;
                $(".manufacturerName").val(manufacturer.name);
            },
            manufacturerDel:function (manufacturer){
                let _this = this;
                _this.manufacturerDelModal.isShow = true;
                _this.manufacturerDelList = manufacturer;
            },
            manufacturerAddCall:function (scope){
                let _this = this;
                _this.manufacturerParams.name = $(".manufacturerName").val();
                _this.manufacturerParams.nameAlias = _this.manufacturerNameAlias;
                _this.manufacturerParams.remark = _this.manufacturerRemark;
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addDeviceManufacturer', _this.manufacturerParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.manufacturerAdd.isShow = false;
                                _this.getDeviceManufacturer('add');
                                _this.alert= {
                                    isShow: true,
                                    content: "新增设备供应商成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "新增设备供应商失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            manufacturerEditCall:function (scope){
                let _this = this;
                _this.manufacturerParams.name = $(".manufacturerName").val();
                _this.manufacturerParams.nameAlias = _this.manufacturerNameAlias;
                _this.manufacturerParams.remark = _this.manufacturerRemark;
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateDeviceManufacturer', _this.manufacturerParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.manufacturerAdd.isShow = false;
                                _this.getDeviceManufacturer('edit');
                                _this.getDeviceModel();
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑设备供应商成功",
                                    type: "success"
                                };
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑设备供应商失败,"+result.errorMessage,
                                    type: "danger"
                                };
                            }
                        });
                    })
                }
            },
            manufacturerDelCall:function (){
                let _this = this;
                let deviceManufacturerId = _this.manufacturerDelList.id;
                _this.$http.post('api/delDeviceManufacturer', {deviceManufacturerId:deviceManufacturerId}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status == "SUCCEED"){
                        _this.manufacturerDelModal.isShow = false;
                        _this.getDeviceManufacturer('del');
                        _this.alert= {
                            isShow: true,
                            content: "删除设备供应商成功",
                            type: "success"
                        };
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "删除设备供应商失败,"+result.errorMessage,
                            type: "danger"
                        };
                    }
                });
            },
            searchModel:function (){
                this.searchDeviceModel.pageIndex = 1;
                this.getDeviceModel();
            },
            modelPageHandler:function (page){
                this.searchDeviceModel.pageIndex = page;
                this.getDeviceModel();
            },
            addModel:function (DeviceModel){
                let _this = this;
                _this.deviceAdd.isShow = true;
                _this.deviceModelTitle = "新增";
                _this.modelParams = {};
                _this.modelNameAlias = "";
                _this.modelRemark = "";
                $(".modelName").val('');
                $(".manufacturerInfo").val('');
            },
            deviceModelEdit:function (DeviceModel){
                let _this = this;
                _this.deviceAdd.isShow = true;
                _this.deviceModelTitle = "编辑";
                _this.manufacturerInfo = [DeviceModel.manufacturerId,DeviceModel.manufacturerName];
                _this.modelParams = {
                    id:DeviceModel.id,
                    manufacturerId:DeviceModel.manufacturerId,
                    manufacturerName:DeviceModel.manufacturerName,
                    name:DeviceModel.name,
                    nameAlias:DeviceModel.nameAlias,
                    remark:DeviceModel.remark
                };
                _this.modelNameAlias = DeviceModel.nameAlias;
                _this.modelRemark = DeviceModel.remark;
                $(".manufacturerInfo").val(DeviceModel.manufacturerId);
                $(".modelName").val(DeviceModel.name);
            },
            deviceModelDel:function (deviceModel){
                this.deviceDel.isShow = true;
                this.deviceModelDelList = deviceModel;
            },
            addDeviceModelCall:function (scope){
                let _this = this;
                _this.modelParams.manufacturerId = $(".manufacturerInfo").val();
                _this.modelParams.name = $(".modelName").val();
                _this.modelParams.nameAlias = _this.modelNameAlias;
                _this.modelParams.remark = _this.modelRemark;
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/addDeviceModel', _this.modelParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.deviceAdd.isShow = false;
                                this.getDeviceModel();
                                _this.alert= {
                                    isShow: true,
                                    content: "新增设备类型成功",
                                    type: "success"
                                }
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "新增设备类型失败,"+result.errorMessage,
                                    type: "danger"
                                }
                            }
                        });
                    })
                }
            },
            editDeviceModelCall:function (scope){
                let _this = this;
                _this.modelParams.manufacturerId = $(".manufacturerInfo").val();
                _this.modelParams.name = $(".modelName").val();
                _this.modelParams.nameAlias = _this.modelNameAlias;
                _this.modelParams.remark = _this.modelRemark;
                if(scope){
                    _this.$validator.validateAll(scope).then(() => {
                        _this.$http.post('api/updateDeviceModel', _this.modelParams).then(function(reponse){
                            var result = reponse.body;
                            if(result.status == "SUCCEED"){
                                _this.deviceAdd.isShow = false;
                                this.getDeviceModel();
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑设备类型成功",
                                    type: "success"
                                }
                            }else{
                                _this.alert= {
                                    isShow: true,
                                    content: "编辑设备类型失败,"+result.errorMessage,
                                    type: "danger"
                                }
                            }
                        });
                    })
                }
            },
            deviceModelDelCall:function (){
                let _this = this;
                let deviceModelId = _this.deviceModelDelList.id;
                _this.$http.post('api/delDeviceModel', {deviceModelId:deviceModelId}).then(function(reponse){
                    var result = reponse.body;
                    if(result.status == "SUCCEED"){
                        _this.deviceDel.isShow = false;
                        this.getDeviceModel();
                        _this.alert= {
                            isShow: true,
                            content: "删除设备类型成功",
                            type: "success"
                        }
                    }else{
                        _this.alert= {
                            isShow: true,
                            content: "删除设备类型失败,"+result.errorMessage,
                            type: "danger"
                        }
                    }
                });
            }
        },
        created (){
            this.getDeviceManufacturer('onload');
            this.getDeviceModel();
        },
        props:["message"]
    }
</script>